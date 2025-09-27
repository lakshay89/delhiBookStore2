// src/app/categories/[id]/page.js
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

// ✅ Use NEXT_PUBLIC_API_URL (defined in .env.local)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params, searchParams }) {
  const rawName = searchParams?.name;

  const categoryName = rawName
    ? decodeURIComponent(rawName).replace(/-/g, " ")
    : "Category";

  return {
    title: `${categoryName} | DelhiBookStore`,
    description: `Explore ${categoryName} books at DelhiBookStore.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { id } = params;
  const rawName = searchParams?.name;

  const categoryName = rawName
    ? decodeURIComponent(rawName).replace(/-/g, " ")
    : "Category";

  // ✅ Fetch the category data from backend API
  const res = await fetch(`${API_URL}/categories/${id}`, {
    cache: "no-store", // always fresh
  });

  if (!res.ok) {
    return (
      <div>
        <Breadcrumbs categoryName={categoryName} />
        <h1>{categoryName}</h1>
        <p>Sorry, this category could not be found.</p>
      </div>
    );
  }

  const categoryData = await res.json();

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs categoryName={categoryName} />

      {/* Category title */}
      <h1>{categoryName}</h1>

      {/* ✅ Subcategories listing */}
      {categoryData.subCategories && categoryData.subCategories.length > 0 ? (
        <ul>
          {categoryData.subCategories.map((sub) => (
            <li key={sub._id}>{sub.name}</li>
          ))}
        </ul>
      ) : (
        <p>No subcategories available.</p>
      )}
    </>
  );
}
