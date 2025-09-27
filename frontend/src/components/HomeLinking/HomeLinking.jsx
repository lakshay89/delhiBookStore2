"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function HomeLinking({ category, product }) {
  const router = useRouter();
  const params = useParams();
  console.log("HHHHH:==>", category)
  // Fallback: if props not passed, use dynamic params
  const currentCategory = category || params.category;
  const currentProduct = product || params.product;

  return (
    <nav className="p-4 text-gray-700">
      <ol className="flex items-center space-x-2">
        {/* Home */}
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>

        <li>›</li>

        {/* Category (go back or link) */}
        <li>
          <button
            // onClick={() => router.back()}
            className="text-blue-600"
          >
            {currentCategory}
          </button>
        </li>

        {currentProduct && <li>›</li>}

        {currentProduct && <li className="font-semibold">{currentProduct}</li>}
      </ol>
    </nav>
  );
}
