import "dotenv/config";
import { readFileSync } from "fs";
import {
  shoppingList_schema,
  type Product,
  type ShoppingList,
} from "./types/ShoppingList";
import { chromium, Page } from "playwright";

// ### ENV VALIDATION
console.log(`Billa Roboshopper`);
console.log(`------------------------`);
console.log(`BILLA EMAIL: ${process.env.BILLA_EMAIL}`);
console.log(
  `BILLA PASSWORD: ${
    (process.env.BILLA_PASSWORD?.length && "********") ?? "NO PASSWORD"
  }`
);
console.log(`SHOPPING LIST: ${process.env.JSON_FILENAME}`);
console.log(`------------------------`);

if (
  !process.env.JSON_FILENAME ||
  !process.env.BILLA_EMAIL ||
  !process.env.BILLA_PASSWORD
) {
  console.error("Invalid .env");
  process.exit(1);
}

const jsonFilename = process.env.JSON_FILENAME;
const billaEmail = process.env.BILLA_EMAIL;
const billaPassword = process.env.BILLA_PASSWORD;

async function login(page: Page) {
  await page.goto("https://shop.billa.at/anmelden?returnUrl=%2F");
  await page.click("#onetrust-accept-btn-handler");
  await page.waitForTimeout(500);
  await page.fill('[data-test="login-mail"]', billaEmail);
  await page.fill('[data-test="login-pw"]', billaPassword);
  await page.click('[data-test="login-submit"]');
  await page.waitForTimeout(500);
}

async function logout(page: Page) {
  await page.goto("https://shop.billa.at/profil?returnUrl=%2F");
  await page.click('[data-test="logout-button"]');
}

async function changeToRightQuantity(
  page: Page,
  quantityToDecrement: number,
  selector: string
) {
  // console.log(`Clicking ${selector} ${quantityToDecrement} times`);
  for (let i = 0; i < quantityToDecrement; i++) {
    await page.click(selector);
    await page.waitForTimeout(500);
  }
}

async function addToCart(page: Page, product: Product, i: number) {
  await page.goto(product.url, { waitUntil: "networkidle" });

  const productNotAvailable = await page.isVisible(
    ".ws-product-product-unavailable-text"
  );

  if (productNotAvailable && !product.fallback) {
    console.log("Product not available, skipping");
    return;
  }
  if (productNotAvailable && product.fallback) {
    console.log("Product not available, trying fallback");
    await addToCart(page, product.fallback, i);
    await page.waitForTimeout(500);
    return;
  }

  const productNotAdded = !(await page.isVisible(
    "[data-test='select-quantity-decrement']"
  ));
  if (productNotAdded) {
    await page.click(".ws-product-actions__add-to-cart");
    await page.waitForTimeout(500);
    console.log("> Added product: ", product.url);
  } else {
    console.log("> Product already added: ", product.url);
  }

  const currentQuantity =
    Number(await page.inputValue("[data-test='select-quantity-input']")) ?? 0;
  
  if (currentQuantity < product.quantity) {
    await changeToRightQuantity(
      page,
      product.quantity - currentQuantity,
      "[data-test='select-quantity-increment']"
    );
  }
  if (currentQuantity > product.quantity) {
    await changeToRightQuantity(
      page,
      currentQuantity - product.quantity,
      "[data-test='select-quantity-decrement']"
    );
  }
}

async function fillCart(page: Page, shoppingList: ShoppingList) {
  for (let i = 0; i < shoppingList.length; i++) {
    const product = shoppingList[i];
    try {
      await addToCart(page, product, i);
      await page.waitForTimeout(500);
    } catch (e) {
      console.error(`Error adding product ${product.url}: ${e}`);
    }
  }
}

async function main() {
  let shoppingList: ShoppingList;
  try {
    const rawData = readFileSync(jsonFilename ?? "", "utf8");
    shoppingList = shoppingList_schema.parse(JSON.parse(rawData));
  } catch (e) {
    console.error(`Error while parsing shopping list: ${e}`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await login(page);

  await fillCart(page, shoppingList);

  await logout(page);

  await browser.close();
}

main();

