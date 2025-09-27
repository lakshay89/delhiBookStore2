"use client";
import { fetchCategories } from "@/app/redux/features/getAllCategory/categorySlice";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bookImage from "../../Images/DBS/1.jpg";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import AllSubCategory from "../SubCategoryByCategory/AllSubCategoryByCategory";

const HomeSubCategory = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [showAll, setShowAll] = useState(false);

  // Helper function to generate light pastel color
  const getRandomLightColor = () => {
    const hue = Math.floor(Math.random() * 360); // hue between 0-360
    return `hsl(${hue}, 100%, 90%)`; // pastel background
  };

  // Stable colors once categories load
  const categoryColors = useMemo(() => {
    const colorMap = {};
    categories.forEach((cat) => {
      colorMap[cat._id] = getRandomLightColor();
    });
    return colorMap;
  }, [categories]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-xl font-bold mb-4 text-start blue-color">
          All Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg h-20 animate-pulse bg-purple-100"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading categories
      </div>
    );
  }

  // Show only first 2 rows when not expanded
  // Assuming 8 categories per row (md:grid-cols-8)
  const categoriesPerRow = 8;
  const visibleCategories = showAll
    ? [...categories].reverse()
    : [...categories.slice(0, categoriesPerRow * 2)].reverse();

  return (
    <div className="max-w-7xl mx-auto py-4 px-4">
      <div className="flex items-center justify-between mb-4">
        
        <div>
          <h2 className="text-xl font-bold text-start blue-color">
            Shop By Subject
          </h2>
          <p className="text-sm w-64 mb-3 text-gray-500 md:w-full">
            Browse through a wide range of book categories at Delhi Book Store.
          </p>
        </div>
        <div className="block">
          {categories.length > categoriesPerRow * 2 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm font-semibold text-white blue-color rounded cursor-pointer transition"
              >
                {showAll ? "View Less" : "View All"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-8 gap-4">
        {visibleCategories.map((cat) => (
          <Link
            href={`/pages/categories/${cat._id}`}
            key={cat._id}
            className="p-1 md:p-2 border border-blue-900 rounded-lg"
          >
            <div
              className="shadow-md rounded-lg hover:shadow-lg transition"
              style={{
                backgroundColor: categoryColors[cat._id],
                color: "#333",
              }}
            >
              <Image
                src={`${serverUrl}/public/image/${cat?.Image}` || bookImage}
                alt={cat.Parent_name}
                width={100}
                height={150}
                quality={100}
                className="w-full h-20 sm:h-56 lg:h-35 object-fill rounded-md mb-1"
              />
            </div>
            <p className="text-center text-[8px] md:text-[11px] break-words font-semibold">
              {cat.Parent_name}
            </p>
          </Link>
        ))}
      </div>
      {/* View More Button */}
    </div>
  );
};

export default HomeSubCategory;
