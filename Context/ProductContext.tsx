import React, { createContext, useContext } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

// Define the Product Schema
 const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: z.object({
    rate: z.number(),
    count: z.number(),
  }),
});

// Infer the TypeScript type from the schema
export type Product = z.infer<typeof ProductSchema>;

// Create Context
export const ProductContext = createContext<Product[] | undefined>(undefined);

// Fetch Products Function
const fetchProducts = async (): Promise<Product[]> => {
  const URL = "https://fakestoreapi.com/products";
  const res = await fetch(URL);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const rawData = await res.json();
  const result = ProductSchema.array().safeParse(rawData);

  if (!result.success) {
    console.error(result.error.format());
    throw new Error("Validation failed for fetched products");
  }

  return result.data;
};

// ProductsProvider Props Interface
interface ProductsProviderProps {
  children: React.ReactNode;
}

// ProductsProvider Component
export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load products</div>;
  }

  return (
    <ProductContext.Provider value={products}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom Hook for Consuming Products
export const useProducts = (): Product[] => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }

  return context;
};
