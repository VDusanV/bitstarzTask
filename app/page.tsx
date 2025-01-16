// app/page.tsx

import { DarkThemeToggle } from "flowbite-react";
import ProductsSectionServer from "./components/ProductsSectionServer";

export default function Home() {
  const categories = ["top", "exclusive", "recent"];

  return (
    <main className="flex flex-col items-center gap-8 min-h-screen p-4 dark:bg-gray-800">
      <header className="flex justify-between w-full">
        <h1 className="text-2xl font-bold dark:text-white">Bitstarz task</h1>
        <DarkThemeToggle />
      </header>

      {categories.map((category) => (
        <div key={category}>
          <ProductsSectionServer category={category} />
        </div>
      ))}
    </main>
  );
}