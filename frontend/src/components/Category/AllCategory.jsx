// "use client";
// import { fetchCategories, fetchSubCategories } from "@/app/redux/features/getAllCategory/categorySlice";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import bookImage from "../../Images/DBS/1.jpg";
// import { serverUrl } from "@/app/redux/features/axiosInstance";
// import AllSubCategory from "../SubCategoryByCategory/AllSubCategoryByCategory";

// const AllCategory = () => {
//   const dispatch = useDispatch();
//   const { subCategories, categories, loading, error } = useSelector((state) => state.category);
//   // const { subCategories, loading, error } = useSelector((state) => state.category);

//   const [showAll, setShowAll] = useState(false);

//   // Helper function to generate light pastel color
//   const getRandomLightColor = () => {
//     const hue = Math.floor(Math.random() * 360); // hue between 0-360
//     return `hsl(${hue}, 100%, 90%)`; // pastel background
//   };

//   // Stable colors once categories load
//   // const categoryColors = useMemo(() => {
//   //   const colorMap = {};
//   //   categories.forEach((cat) => {
//   //     colorMap[cat._id] = getRandomLightColor();
//   //   });
//   //   return colorMap;
//   // }, [categories]);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const HomeCategory = categories.filter((cat) => cat.isHome === true);

//   useEffect(() => {
//     if (HomeCategory[0]?._id) {
//       dispatch(fetchSubCategories(HomeCategory[0]?._id));
//     }
//   }, [])

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto py-8 px-4">
//         <h2 className="text-xl font-bold mb-4 text-start blue-color">
//           All Categories
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {Array.from({ length: 20 }).map((_, index) => (
//             <div
//               key={index}
//               className="rounded-lg h-20 animate-pulse bg-purple-100"
//             ></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-6 text-red-500">
//         Error loading categories
//       </div>
//     );
//   }

//   // Show only first 2 rows when not expanded
//   // Assuming 8 categories per row (md:grid-cols-8)
//   const categoriesPerRow = 8;
//   const visibleCategories = showAll
//     ? [...categories].reverse()
//     : [...categories.slice(0, categoriesPerRow * 2)].reverse();
//   console.log("jJJJJJJJJJJJJ==>", categories.filter((cat) => cat.isHome === true))
//   return (
//     <>

//       {subCategories.length > 0 && <div className="max-w-7xl mx-auto py-4 px-4">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="text-xl font-bold text-start blue-color">
//               Shop By {HomeCategory.Parent_name}
//             </h2>
//             <p className="text-sm w-64 mb-3 text-gray-500 md:w-full">
//               Browse through a wide range of book categories at Delhi Book Store.
//             </p>
//           </div>

//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-8 gap-4">
//           {subCategories.map((cat) => (
//             <Link
//               href={`/pages/categories/${cat._id}`}
//               key={cat._id}
//               className="p-1 md:p-2 border border-blue-900 rounded-lg"
//             >
//               <div className="shadow-md rounded-lg hover:shadow-lg transition"              >
//                 <Image
//                   src={`${serverUrl}/public/image/${cat.categoryImage}` || bookImage}
//                   alt={cat.SubCategoryName}
//                   width={100}
//                   height={150}
//                   quality={100}
//                   className="w-full h-20 sm:h-56 lg:h-35 object-fill rounded-md mb-1"
//                 />
//               </div>
//               <p className="text-center text-[8px] md:text-[11px] break-words font-semibold">
//                 {cat.SubCategoryName}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </div>
//       }

//       <div className="max-w-7xl mx-auto py-4 px-4">
//         <div className="flex items-center justify-between mb-4">

//           <div>
//             <h2 className="text-xl font-bold text-start blue-color">
//               Shop By Subject
//             </h2>
//             <p className="text-sm w-64 mb-3 text-gray-500 md:w-full">
//               Browse through a wide range of book categories at Delhi Book Store.
//             </p>
//           </div>
//           <div className="block">
//             {categories.length > categoriesPerRow * 2 && (
//               <div className="text-center mt-4">
//                 <button
//                   onClick={() => setShowAll(!showAll)}
//                   className="text-sm font-semibold text-white blue-color rounded cursor-pointer transition"
//                 >
//                   {showAll ? "View Less" : "View All"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-8 gap-4">
//           {visibleCategories.map((cat) => (
//             <Link
//               href={`/pages/categories/${cat._id}`}
//               key={cat._id}
//               className="p-1 md:p-2 border border-blue-900 rounded-lg"
//             >
//               <div
//                 className="shadow-md rounded-lg hover:shadow-lg transition"
//               // style={{
//               //   backgroundColor: categoryColors[cat._id],
//               //   color: "#333",
//               // }}
//               >
//                 <Image
//                   src={`${serverUrl}/public/image/${cat?.Image}` || bookImage}
//                   alt={cat.Parent_name}
//                   width={100}
//                   height={150}
//                   quality={100}
//                   className="w-full h-20 sm:h-56 lg:h-35 object-fill rounded-md mb-1"
//                 />
//               </div>
//               <p className="text-center text-[8px] md:text-[11px] break-words font-semibold">
//                 {cat.Parent_name}
//               </p>
//             </Link>
//           ))}
//         </div>
//         {/* View More Button */}
//       </div>
//     </>);
// };

// export default AllCategory;

"use client";

import {
  fetchCategories,
  fetchSubCategories,
} from "@/app/redux/features/getAllCategory/categorySlice";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bookImage from "../../app/Images/DBS/1.jpg";
import { serverUrl } from "@/app/redux/features/axiosInstance";

const AllSubCategory = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [showAll, setShowAll] = useState(false);
  const [allSubCategories, setAllSubCategories] = useState({}); // store {categoryId: [subCats...]}

  // ✅ Fetch all categories once
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ✅ Find Home categories
  const homeCategories = categories.filter((cat) => cat?.isHome === true);

  // console.log("HHH=>", sortedData)

  // ✅ Fetch subcategories for EACH home category
  useEffect(() => {
    const fetchAll = async () => {
      for (let cat of homeCategories) {
        if (cat?._id) {
          const res = await dispatch(fetchSubCategories(cat?._id));
          console.log("FFF====>", res?.payload);
          setAllSubCategories((prev) => ({
            ...prev,
            [cat?._id]: res?.payload || [],
          }));
        }
      }
    };
    if (homeCategories?.length) {
      fetchAll();
    }
  }, [dispatch, homeCategories.length]);

  // ✅ Handle Loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-xl font-bold mb-4 text-start blue-color">
          All Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg h-20 animate-pulse bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  // ✅ Handle Error
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        ❌ Error loading categories
      </div>
    );
  }

  // ✅ Categories for "Shop By Subject"
  // const categoriesPerRow = 8;
  // const visibleCategories = showAll
  //   ? categories
  //   : categories.slice(0, categoriesPerRow * 2);

  const visibleCategories = [...(categories || [])].sort((a, b) =>
    a?.Parent_name?.localeCompare(b?.Parent_name)
  );

  return (
    <>
      {/* ====== Shop by EACH Home Category ====== */}
      {homeCategories.map((homeCat) => {
        const subCats = allSubCategories[homeCat?._id] || [];
        if (!subCats?.length) return null;
        const sortedData = [...(subCats || [])].sort((a, b) =>
          a?.SubCategoryName?.localeCompare(b?.SubCategoryName)
        );
        return (
          <div key={homeCat?._id} className="max-w-7xl mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-start blue-color">
                  Shop By {homeCat.Parent_name || "Category"}
                </h2>
                <p className="text-sm mb-3 text-gray-500">
                  Browse through a wide range of book categories at Delhi Book
                  Store.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {sortedData.map((cat) => (
                <Link
                  href={`/subCategories/${cat?._id}?name=${cat?.SubCategoryName}`}
                  key={cat._id}
                  className="p-1 md:p-2 border border-blue-900 rounded-lg group"
                >
                  <div className="shadow-md rounded-lg overflow-hidden group-hover:shadow-lg transition">
                    <Image
                      src={
                        cat.categoryImage
                          ? `${serverUrl}/public/image/${cat.categoryImage}`
                          : bookImage
                      }
                      alt={cat.SubCategoryName}
                      width={100}
                      height={120}
                      quality={90}
                      className="w-full h-24 sm:h-32 lg:h-36 object-cover rounded-md"
                    />
                  </div>
                  <p className="text-center text-[10px] md:text-sm font-semibold mt-1">
                    {cat.SubCategoryName}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* ====== Shop by Subject (All Categories) ====== */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-start blue-color">
              Shop By Subject
            </h2>
            <p className="text-sm text-gray-500">
              Browse through a wide range of book categories at Delhi Book
              Store.
            </p>
          </div>
          {/* {categories.length > categoriesPerRow * 2 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {showAll ? "View Less" : "View All"}
            </button>
          )} */}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {visibleCategories.map((cat) => (
            <Link
              href={`http://localhost:3000/categories/${cat?._id}?name=${cat?.Parent_name}`}
              key={cat._id}
              className="p-1 md:p-2 border border-blue-900 rounded-lg group"
            >
              <div className="shadow-md rounded-lg overflow-hidden group-hover:shadow-lg transition">
                <Image
                  src={
                    cat?.Image
                      ? `${serverUrl}/public/image/${cat.Image}`
                      : bookImage
                  }
                  alt={cat.Parent_name}
                  width={100}
                  height={120}
                  quality={90}
                  className="w-full h-24 sm:h-32 lg:h-36 object-cover rounded-md"
                />
              </div>
              <p className="text-center text-[10px] md:text-sm font-semibold mt-1">
                {cat.Parent_name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllSubCategory;
