"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "https://job-application.bitstarz.workers.dev";

interface Product {
  id: string;
  title: string;
  image: string;
}

interface ProductsSectionProps {
  initialProducts: Product[];
  category: string;
}

export default function ProductsSectionClient({
  initialProducts,
  category,
}: ProductsSectionProps) {
  const [cachedProducts, setCachedProducts] = useState<Product[]>(initialProducts);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(initialProducts.slice(0, 5));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const LIMIT = 5;
  const router = useRouter();

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "secret-key-{some_name}",
        },
      });
      const fetchedFavorites: string[] = await response.json();
      setFavorites(fetchedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchProducts = async () => {
    if (isLoading || offset + LIMIT < cachedProducts.length) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/products/${category}?offset=${cachedProducts.length}&limit=${LIMIT}`
      );
      const fetchedProducts: Product[] = await response.json();
      setCachedProducts((prev) => [...prev, ...fetchedProducts]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDisplayedProducts = () => {
    const start = offset;
    const end = start + LIMIT;
    setDisplayedProducts(cachedProducts.slice(start, end));
  };

  const toggleFavorite = async (id: string) => {
    try {
      if (favorites.includes(id)) {
        await fetch(`${API_BASE_URL}/favorites`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "secret-key-{some_name}",
          },
          body: JSON.stringify({ id }),
        });
        setFavorites((prev) => prev.filter((fav) => fav !== id));
      } else {
        await fetch(`${API_BASE_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "secret-key-{some_name}",
          },
          body: JSON.stringify({ id }),
        });
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const viewProductDetails = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleScrollLeft = () => {
    if (offset > 0) {
      setOffset((prev) => prev - 1);
    }
  };

  const handleScrollRight = () => {
    const nextOffset = offset + 1;
    if (nextOffset * LIMIT < cachedProducts.length) {
      setOffset(nextOffset);
    } else {
      fetchProducts();
      setOffset(nextOffset);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    updateDisplayedProducts();
  }, [offset, cachedProducts]);

  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold dark:text-white capitalize">
        {category} Products
      </h2>
      <div className="flex items-center space-x-4 my-4">
        <button
          onClick={handleScrollLeft}
          disabled={offset === 0 || isLoading}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
        >
          &lt; Prev
        </button>

        <div className="flex space-x-4 my-4">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="w-64 p-4 border rounded shadow dark:bg-gray-700 dark:text-white"
            >
              <h3 className="mt-2 text-lg">{product.title}</h3>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover rounded"
              />
              <button
                className={`mt-2 px-4 py-2 text-sm rounded ${
                  favorites.includes(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 dark:bg-gray-500"
                }`}
                onClick={() => toggleFavorite(product.id)}
              >
                {favorites.includes(product.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
              <button
                className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded"
                onClick={() => viewProductDetails(product.id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleScrollRight}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
        >
          Next &gt;
        </button>
      </div>

      {isLoading && <p className="text-center mt-4 dark:text-white">Loading...</p>}
    </section>
  );
}