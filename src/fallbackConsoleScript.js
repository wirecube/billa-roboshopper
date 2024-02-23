let shoppingList = [
  {
    url: "https://shop.billa.at/produkte/alpro-mandeldrink-ungesuesst-00878303",
    quantity: 3,
    fallback: {
      url: "https://shop.billa.at/produkte/ja-natuerlich-mandeldrink-ungesuesst-00599435",
      quantity: 1,
    },
  },
];

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function getSKUFromURL(url) {
  const parts = url.split("-00");
  return `00-${parts[1]}`;
}

async function addToCart(url, quantity, fallback) {
  const storeId = appDataLayer?.checkout?.storeId ?? "00-6011";
  const result = await fetch(
    `https://shop.billa.at/api/carts/items?storeId=${storeId}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json; charset=UTF-8",
        credentials: "include",
        pragma: "no-cache",
        "sec-ch-ua": '"Not(A:Brand";v="24", "Chromium";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-xsrf-token": getCookie("XSRF-TOKEN") || "",
      },
      referrer: "https://shop.billa.at/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"sku":"${getSKUFromURL(url)}","quantity":${quantity}}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  if (result.status === 200) {
    console.log("✅ Added: ", url);
  } else if (fallback) {
    console.log("🚧 Falling back to: ", fallback.url);
    await addToCart(fallback.url, fallback.quantity, fallback.fallback);
  } else {
    console.error("❌ Failed: ", url);
  }
}

async function main() {
  for (let index = 0; index < shoppingList.length; index++) {
    const element = shoppingList[index];

    const result = await addToCart(
      element.url,
      element.quantity,
      element.fallback
    );
  }
  console.log("Done 🎉");
}

main();
