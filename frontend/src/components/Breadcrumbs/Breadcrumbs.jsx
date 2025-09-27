// "use client";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
// import "./Breadcrumbs.css";

// export default function Breadcrumbs({ productTitle, categoryName, subCategoryName }) {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const queryCategoryName = searchParams.get("name");
//   const catName = categoryName || queryCategoryName || null;

//   const originalSegments = pathname.split("/").filter(Boolean);

//   const skip = ["pages"];
//   let pathArray = originalSegments.filter((s) => !skip.includes(s.toLowerCase()));

//   return (
//     <nav aria-label="breadcrumb" className="mb-10">
//       <ol className="breadcrumb custom-breadcrumb flex gap-2">
//         <li className="breadcrumb-item">
//           <Link href="/">Home</Link>
//         </li>

//         {/* Category breadcrumb */}
//         {catName && (
//           <li className="breadcrumb-item">
//             <span>{catName}</span>
//           </li>
//         )}

//         {/* Subcategory breadcrumb */}
//         {subCategoryName && (
//           <li className="breadcrumb-item active" aria-current="page">
//             <span>{subCategoryName}</span>
//           </li>
//         )}

//         {/* Product breadcrumb */}
//         {!subCategoryName && productTitle && (
//           <li className="breadcrumb-item active" aria-current="page">
//             <span>{productTitle}</span>
//           </li>
//         )}
//       </ol>
//     </nav>
//   );
// }
"use client";
import Link from "next/link";
import "./Breadcrumbs.css";

export default function Breadcrumbs({ categoryName, subCategoryName, productTitle }) {
  return (
    <nav aria-label="breadcrumb" className="mb-10">
      <ol className="breadcrumb custom-breadcrumb flex gap-2">
        {/* Home always */}
        <li className="breadcrumb-item">
          <Link href="/">Home</Link>
        </li>

        {/* Category */}
        {categoryName && (
          <li className="breadcrumb-item">
            <span>{categoryName}</span>
          </li>
        )}

        {/* Subcategory */}
        {subCategoryName && (
          <li className="breadcrumb-item">
            <span>{subCategoryName}</span>
          </li>
        )}

        {/* Product */}
        {productTitle && (
          <li className="breadcrumb-item active" aria-current="page">
            <span>{productTitle}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}
