import React from "react";
import ProductsSectionClient from "./ProductsSectionClient";

const API_BASE_URL = "https://job-application.bitstarz.workers.dev";

async function fetchProducts(category: string) {
  const response = await fetch(
    `${API_BASE_URL}/products/${category}?offset=0&limit=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return await response.json();
}

const ProductsSectionServer = async ({ category }: { category: string }) => {
  const products = await fetchProducts(category);

  return (
    <ProductsSectionClient initialProducts={products} category={category} />
  );
};

export default ProductsSectionServer;