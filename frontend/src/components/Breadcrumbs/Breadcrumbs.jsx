"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import "./Breadcrumbs.css";

export default function Breadcrumbs({
  categoryName,
  subCategoryName,
  productTitle,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // read the ?name= param for nicer label
  const queryName = searchParams.get("name");

  // if props passed, use them; else derive from URL
  let crumbs = [];

  if (categoryName) {
    crumbs.push({ label: categoryName, href: null });
  } else if (subCategoryName) {
    crumbs.push({ label: subCategoryName, href: null });
  } else if (productTitle) {
    crumbs.push({ label: productTitle, href: null });
  } else if (queryName) {
    // show only decoded name from query param
    crumbs.push({
      label: decodeURIComponent(queryName),
      href: null,
    });
  } else {
    // fallback: build from pathname segments
    const segments = pathname.split("/").filter(Boolean);
    segments.forEach((segment, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      crumbs.push({
        label: decodeURIComponent(segment),
        href: idx === segments.length - 1 ? null : href,
      });
    });
  }

  return (
    <nav aria-label="breadcrumb" className="mb-10">
      <ol className="breadcrumb custom-breadcrumb flex gap-2">
        {/* Home always */}
        <li className="breadcrumb-item">
          <Link href="/">Home</Link>
        </li>

        {crumbs.map((c, i) => (
          <li
            key={i}
            className={`breadcrumb-item ${
              i === crumbs.length - 1 ? "active" : ""
            }`}
            aria-current={i === crumbs.length - 1 ? "page" : undefined}
          >
            {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
