import { z } from "zod";

// export type ShoppingList = Product[];

export type Product = {
  url: string;
  quantity: number;
  fallback?: Product;
};

export const product_schema = z.object({
  url: z.string().url(),
  quantity: z.number().positive(),
  fallback: z.optional(z.lazy(() => product_schema)),
}) as z.ZodSchema<Product>;

export const shoppingList_schema = z.array(product_schema);

export type ShoppingList = z.infer<typeof shoppingList_schema>;
