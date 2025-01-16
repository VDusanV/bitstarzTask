"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "https://job-application.bitstarz.workers.dev";

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/favorites`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "secret-key-{some_name}",
          },
        });

        if (res.ok) {
          const favoriteIds: string[] = await res.json();
          setIsFavorite(favoriteIds.includes(productId));
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [productId]);

  const toggleFavorite = async () => {
    try {
      const method = isFavorite ? "DELETE" : "POST";
      await fetch(`${API_BASE_URL}/favorites`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "secret-key-{some_name}",
        },
        body: JSON.stringify({ id: productId }),
      });

      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="flex justify-between w-full mb-4">
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Return to Home
      </button>

      <button
        onClick={toggleFavorite}
        className={`px-4 py-2 rounded ${
          isFavorite ? "bg-red-500 text-white" : "bg-gray-300 dark:bg-gray-500"
        }`}
      >
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}