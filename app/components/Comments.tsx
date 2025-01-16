import React from "react";

const API_BASE_URL = "https://job-application.bitstarz.workers.dev";

async function fetchComments(productId: string) {
  try{
    const res = await fetch(`${API_BASE_URL}/comments?id=${productId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }
    return await res.json();
  } catch(error) {
    console.error("Error fetching comments:", error);
  }
}

const Comments = async ({ productId }: { productId: string }) => {
  const comments : string[] = await fetchComments(productId);

  return (
    <section className="mt-6 w-full">
      <h2 className="text-lg font-semibold dark:text-white">Comments</h2>
      <ul className="mt-2 space-y-2">
        {comments.map((comment, index) => (
          <li
            key={index}
            className="p-2 border rounded shadow dark:bg-gray-700 dark:text-white"
          >
            {comment}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Comments;