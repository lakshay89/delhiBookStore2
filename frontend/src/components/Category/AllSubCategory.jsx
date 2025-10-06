// "use client";
// import { serverUrl } from "@/app/redux/features/axiosInstance";
// import { fetchSubCategories } from "@/app/redux/features/getAllCategory/categorySlice";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
// import HomeLinking from "../HomeLinking/HomeLinking";
// import Loader from "../SubCategory/Loder";
// import AllProductById from "../AllProductById/AllProductById";
// import { fetchProductsByCategory } from "@/app/redux/features/productByCategory/productByCategorySlice";

// export default function AllSubCategory() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { id: categoryId } = useParams();

//   const { subCategories, loading, error } = useSelector(
//     (state) => state.category
//   );
//   ////////////////////////PRODUCT UI////////////////////////////////

//   const { products, loading2, error2, totalPages } = useSelector(
//     (state) => state.productByCategory
//   );
// console.log("HHH==>",subCategories)
//   ///////////////////////////////////////////////////////////////////

//   const timeoutRef = useRef(null);

//   // ✅ Fetch subcategories
//   useEffect(() => {
//     if (categoryId) {
//       dispatch(fetchSubCategories(categoryId));
//     }
//   }, [dispatch, categoryId]);

//   // ✅ Handle redirect with 3s wait
//   useEffect(() => {
//     // Clear old timer if rerun
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);

//     if (!loading && !error) {
//       if (!subCategories && !products || subCategories?.length === 0 && products?.length === 0) {
//         // 🚀 Wait 3s before redirect
//         timeoutRef.current = setTimeout(() => {
//           // router.push(`/pages/shop/productBysubcategory/${categoryId}?name=${subCategories[0]?.Parent_name?.Parent_name}`);
//           router.push(`/pages/subCategories/${categoryId}?name=${subCategories[0]?.Parent_name?.Parent_name}`);
//         }, 2000);
//       }
//     }

//     return () => clearTimeout(timeoutRef.current);
//   }, [loading, error, subCategories, products, router, categoryId, loading2, error2]);

//   ///////////////////////////////////PRODUCT UI/////////////////////////////

//   useEffect(() => {
//     if (categoryId) {
//       dispatch(
//         fetchProductsByCategory({
//           id: categoryId,
//           limit: 12,
//           page: 1,
//           sort: true,
//         })
//       );
//     }
//   }, [dispatch, categoryId,]);

//   ////////////////////////////////////////////////////////////////////////////////

//   // ✅ Loading UI
//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
//         {Array.from({ length: 8 }).map((_, index) => (
//           <div
//             key={index}
//             className="animate-pulse space-y-2 rounded-lg border border-gray-200 p-4 shadow"
//           >
//             <div className="h-32 bg-gray-300 rounded-md"></div>
//             <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // ✅ Error UI
//   if (error) {
//     return (
//       <div className="text-center py-6 text-red-500">
//         Error loading SubCategories
//       </div>
//     );
//   }

//   // ✅ No data (redirect triggered after 3s, so show fallback until then)
//   if (!subCategories || subCategories?.length === 0 && !products || products?.length === 0) {
//     return (
//       <section className="w-full py-8 px-4 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-center">
//             {/* Checking subcategories... */}
//             <Loader />
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // ✅ Sort categories alphabetically
//   const visibleCategories = [...subCategories].sort((a, b) =>
//     a?.SubCategoryName?.localeCompare(b?.SubCategoryName)
//   );

//   return (
//     <section className="w-full py-8 px-4 bg-gray-50">
//       <div className="max-w-7xl mx-auto">

//         {/* Title */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Shop by {subCategories[0]?.Parent_name?.Parent_name}
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Discover our wide range of books across different SubCategories
//           </p>
//         </div>

//         {/* SubCategories Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
//           {visibleCategories.map((category) => (
//             <Link
//               key={category?._id}
//               // href={`/pages/shop/productBysubcategory/${category._id}`}
//               href={`/pages/subCategories/${category?._id}`}
//               className="group block rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
//             >
//               <div className="relative w-full h-40 sm:h-56 lg:h-35">
//                 <Image
//                   src={
//                     category.categoryImage
//                       ? `${serverUrl}/public/image/${category.categoryImage}`
//                       : CallBackImg
//                   }
//                   alt={category.SubCategoryName}
//                   fill
//                   className="object-fill group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <div className="p-2">
//                 <h3 className="text-[12px] md:text-md font-semibold text-black text-center">
//                   {category.SubCategoryName}
//                 </h3>
//               </div>
//             </Link>
//           ))}
//         </div>

//         <div>
//           <AllProductById categoryId={categoryId} />
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { serverUrl } from "@/app/redux/features/axiosInstance";
import { fetchSubCategories } from "@/app/redux/features/getAllCategory/categorySlice";
import { fetchProductsByCategory } from "@/app/redux/features/productByCategory/productByCategorySlice";

import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
import Loader from "../SubCategory/Loder";
import AllProductById from "../AllProductById/AllProductById";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

export default function AllSubCategory() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: categoryId } = useParams();
  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = parseInt(searchParams.get("limit")) || 50;
  const name = searchParams.get("name")
    ? decodeURIComponent(searchParams.get("name"))
    : "Category";
  const sort = searchParams.get("sort") || false;
  const [page, setPage] = useState(initialPage);

  const { subCategories, loading, error } = useSelector(
    (state) => state.category
  );

  const { products, loading: loadingProducts, error: errorProducts } =
    useSelector((state) => state.productByCategory);

  const timeoutRef = useRef(null);

  /** ✅ Fetch subcategories */
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSubCategories(categoryId));
    }
  }, [dispatch, categoryId]);

  /** ✅ Fetch products for the category */
  useEffect(() => {
    if (categoryId) {
      dispatch(
        fetchProductsByCategory({
          id: categoryId,
          limit: initialLimit,
          page: initialPage,
          sort,
        })
      );
    }
  }, [dispatch, categoryId, initialLimit, initialPage, sort]);

  // /** ✅ Redirect if no data (after 2s) */
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!loading && !error) {
      if (
        (!subCategories || subCategories.length === 0) &&
        (!products || products.length === 0)
      ) {
        timeoutRef.current = setTimeout(() => {
          // 🚀 fixed path (remove /pages/)
          router.push(`/subCategories/${categoryId}`);
        }, 2000);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [loading, error, subCategories, products, router, categoryId]);

  /** ✅ Loading UI */
  if ((!subCategories || subCategories.length === 0) &&
    (!products || products?.length === 0) && loading) {
    return (
      <section className="w-full py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  /** ✅ No data yet */
  if (
    (!subCategories || subCategories.length === 0) &&
    (!products || products?.length === 0)
  ) {
    return (
      <section className="w-full py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p>No data available for this category.</p>
        </div>
      </section>
    );
  }

  /** ✅ Sort categories alphabetically */
  const visibleCategories = [...subCategories].sort((a, b) =>
    a?.SubCategoryName?.localeCompare(b?.SubCategoryName)
  );
  console.log("ZZZZZZZZZ:==>", products, subCategories)
  return (
    <section className="w-full py-8 px-4 bg-gray-50">
      {/* Pass category name to breadcrumbs */}
      <Breadcrumbs categoryName={name} />
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        {visibleCategories.length > 0 && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by {name}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of books across different SubCategories
            </p>
          </div>
        )}

        {/* SubCategories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
          {visibleCategories.map((category) => (
            <Link
              key={category?._id}
              href={`/subCategories/${category?._id}?name=${encodeURIComponent(
                category.SubCategoryName
              )}&parentName=${encodeURIComponent(name)}&parentId=${encodeURIComponent(
                categoryId
              )}`}
              className="group block rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative w-full h-40 sm:h-56">
                <Image
                  src={
                    category.categoryImage
                      ? `${serverUrl}/public/image/${category.categoryImage}`
                      : CallBackImg
                  }
                  alt={category.SubCategoryName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2">
                <h3 className="text-xs md:text-base font-semibold text-black text-center">
                  {category.SubCategoryName}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Products */}
        {products && (
          <div className="mt-10">
            <AllProductById
              initialPage={initialPage}
              initialLimit={initialLimit}
              sort={sort}
              page={page}
              setPage={setPage}
              categoryId={categoryId}
            />
          </div>
        )}
      </div>
    </section>
  );
}
