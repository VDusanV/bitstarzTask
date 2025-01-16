import { Suspense } from "react";
import { notFound } from "next/navigation";
import Comments from "../../components/Comments";
import ProductActions from "../../components/ProductActions"; // Client Component for actions (favorites & home button)

const API_BASE_URL = "https://job-application.bitstarz.workers.dev";

interface Product {
  id: string;
  title: string;
  image: string;
}

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/product?id=${id}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4 dark:bg-gray-800">
      <ProductActions productId={product.id} />

      <h1 className="text-2xl font-bold dark:text-white">{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        className="w-full max-w-md h-60 object-cover rounded"
      />

      <Suspense fallback={<p className="mt-4 text-gray-500 dark:text-gray-400">Loading comments...</p>}>
        <Comments productId={params.id} />
      </Suspense>
    </main>
  );
}