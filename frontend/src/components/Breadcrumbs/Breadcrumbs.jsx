// "use client";

// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function Breadcrumbs({
//   categoryName,
//   subCategoryName,
//   productTitle,
// }) {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // read the ?name= param for nicer label
//   const queryName = searchParams.get("name");

//   // if props passed, use them; else derive from URL
//   let crumbs = [];

//   if (categoryName) {
//     crumbs.push({ label: categoryName, href: null });
//   } else if (subCategoryName) {
//     crumbs.push({ label: subCategoryName, href: null });
//   } else if (productTitle) {
//     crumbs.push({ label: productTitle, href: null });
//   } else if (queryName) {
//     // show only decoded name from query param
//     crumbs.push({
//       label: decodeURIComponent(queryName),
//       href: null,
//     });
//   } else {
//     // fallback: build from pathname segments
//     const segments = pathname.split("/").filter(Boolean);
//     segments.forEach((segment, idx) => {
//       const href = "/" + segments.slice(0, idx + 1).join("/");
//       crumbs.push({
//         label: decodeURIComponent(segment),
//         href: idx === segments.length - 1 ? null : href,
//       });
//     });
//   }

//   return (
//     <nav aria-label="breadcrumb" className="mb-10">
//       <ol className="breadcrumb custom-breadcrumb flex gap-2">
//         {/* Home always */}
//         <li className="breadcrumb-item">
//           <Link href="/">Home</Link>
//         </li>

//         {crumbs.map((c, i) => (
//           <li
//             key={i}
//             className={`breadcrumb-item ${
//               i === crumbs.length - 1 ? "active" : ""
//             }`}
//             aria-current={i === crumbs.length - 1 ? "page" : undefined}
//           >
//             {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function Breadcrumbs() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // split the path into parts
//   const segments = pathname.split("/").filter(Boolean);

//   // build crumbs array
//   const crumbs = [{ label: "Home", href: "/" }];

//   segments.forEach((segment, idx) => {
//     // look for ?name= param on this page
//     const nameParam = searchParams.get("name");
//     // by default use the segment itself
//     let label = decodeURIComponent(segment);

//     // if there is a ?name param, use it for the last segment
//     if (idx === segments.length - 1 && nameParam) {
//       label = decodeURIComponent(nameParam);
//     }

//     const href = "/" + segments.slice(0, idx + 1).join("/");
//     crumbs.push({ label, href: idx === segments.length - 1 ? null : href });
//   });

//   return (
//     <nav aria-label="breadcrumb" className="mb-10">
//       <ol className="breadcrumb custom-breadcrumb flex gap-2">
//         {crumbs.map((c, i) => (
//           <li
//             key={i}
//             className={`breadcrumb-item ${i === crumbs.length - 1 ? "active" : ""}`}
//             aria-current={i === crumbs.length - 1 ? "page" : undefined}
//           >
//             {c.href && i !== crumbs.length - 1 ? (
//               <Link href={c.href}>{c.label}</Link>
//             ) : (
//               <span>{c.label}</span>
//             )}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Breadcrumbs({
  categoryName,
  categoryId,
  subCategoryName,
  subCategoryId,
  productTitle,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const crumbs = [{ label: "Home", href: "/" }];

  // helper: make a nice label
  const nice = (s) => {
    if (!s) return s;
    // replace dashes/underscores, decode, trim
    const decoded = decodeURIComponent(s).replace(/[-_]/g, " ").trim();
    // capitalize words
    return decoded
      .split(" ")
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ");
  };

  // mapping for known route segments to friendlier labels and links
  const labelMap = {
    categories: { label: "Categories", href: "/categories" },
    shop: { label: "Shop Books", href: "/shop" },
    productBysubcategory: { label: "Shop", href: "/shop" },
    "product-by-maincategory": { label: "Main Category", href: "/" },
    subCategories: { label: "SubCategories", href: "/subCategories" },
    wishlist: { label: "Wishlist", href: "/wishlist" },
    cart: { label: "Cart", href: "/cart" },
  };

  // Read optional parent info from query if present
  const parentNameFromQuery = searchParams?.get("parentName");
  const parentIdFromQuery = searchParams?.get("parentId");

  // If explicit props are provided use them (keeps existing behavior)
  if (categoryName || subCategoryName || productTitle) {
    if (categoryName) {
      crumbs.push({
        label: categoryName,
        href: categoryId ? `/categories/${categoryId}` : null,
      });
    }

    if (subCategoryName) {
      crumbs.push({
        label: subCategoryName,
        href:
          subCategoryId && categoryId
            ? `/categories/${categoryId}/${subCategoryId}`
            : null,
      });
    }

    if (productTitle) {
      crumbs.push({ label: productTitle, href: null });
    }
  } else if (parentNameFromQuery || parentIdFromQuery) {
    // Build crumbs using parent info from query params when available
    if (parentNameFromQuery) {
      crumbs.push({ label: nice(parentNameFromQuery), href: parentIdFromQuery ? `/categories/${parentIdFromQuery}` : null });
    }

    const nameParam = searchParams?.get("name");
    if (nameParam) {
      crumbs.push({ label: nice(nameParam), href: null });
    } else {
      // fallback to deriving from pathname
      const segments = (pathname || "").split("/").filter(Boolean);
      segments.forEach((segment, idx) => {
        const isIdLike = /^[0-9a-fA-F]{24}$/.test(segment) || /^[0-9]+$/.test(segment);
        if (isIdLike) return; // skip raw ids
        const href = "/" + segments.slice(0, idx + 1).join("/");
        crumbs.push({ label: nice(segment), href: idx === segments.length - 1 ? null : href });
      });
    }
  } else {
    // Otherwise derive crumbs from the URL and ?name= query param for nicer labels
    const segments = (pathname || "").split("/").filter(Boolean);
    const nameParam = searchParams?.get("name");

    segments.forEach((segment, idx) => {
      const isIdLike = /^[0-9a-fA-F]{24}$/.test(segment) || /^[0-9]+$/.test(segment);

      let label = null;
      let href = "/" + segments.slice(0, idx + 1).join("/");

      if (isIdLike && idx === segments.length - 1 && nameParam) {
        label = nice(nameParam);
        href = null; // last crumb
      } else if (labelMap[segment]) {
        label = labelMap[segment].label;
        href = idx === segments.length - 1 ? null : labelMap[segment].href || href;
      } else {
        label = nice(segment);
        if (idx === segments.length - 1 && nameParam) {
          label = nice(nameParam);
          href = null;
        } else {
          href = idx === segments.length - 1 ? null : href;
        }
      }

      if (!isIdLike || (isIdLike && label)) {
        crumbs.push({ label, href });
      }
    });
  }

  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="breadcrumb flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li
              key={i}
              className={`breadcrumb-item ${isLast ? "font-semibold text-gray-900" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {!isLast && c.href ? (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="mx-1">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
