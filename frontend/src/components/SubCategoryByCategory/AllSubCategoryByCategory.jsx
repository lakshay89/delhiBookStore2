"use client";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

export default function AllSubCategory({ categoryId, setCategoryId }) {
    const router = useRouter();
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAll, setShowAll] = useState(false);

    const categoriesPerRow = 8; // adjust for grid

    // 🔹 Fetch subcategories by categoryId
    const fetchProductsByCategory = async (id) => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get(`/category/category-by-main-category/${id}`);
            console.log("SubCategories:=>", res);
            setSubCategories(res.data || []);
        } catch (err) {
            console.error("Error fetching subcategories:", err);
            setError("Failed to load subcategories. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryId) {
            fetchProductsByCategory(categoryId);
        }
    }, [categoryId]);

    // 🔹 Skeleton Loader
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse space-y-2 rounded-lg border border-gray-200 p-4 shadow"
                    >
                        <div className="h-32 bg-gray-300 rounded-md"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    // 🔹 Error State
    if (error) {
        return (
            <div className="text-center py-6 text-red-500 font-medium">
                ❌ {error}
            </div>
        );
    }

    // 🔹 Limit visible categories unless "show all"
    const visibleCategories = showAll ? subCategories : subCategories.slice(0, categoriesPerRow);

    return (
        <section className="w-full py-8 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {subCategories.length > 0
                            ? `Shop by ${subCategories[0]?.Parent_name?.Parent_name ?? "Category"}`
                            : "No SubCategories Available"}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {subCategories.length > 0
                            ? "Discover our wide range of products across different subcategories."
                            : "This category currently has no subcategories. Please explore other categories."}
                    </p>
                </div>

                {/* SubCategories Grid */}
                {subCategories.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
                            {visibleCategories.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/pages/shop/productBysubcategory/${category._id}`}
                                    className="group block rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white border"
                                >
                                    {/* Image */}
                                    <div className="relative w-full h-32 sm:h-40 md:h-48">
                                        <Image
                                            src={
                                                category.categoryImage
                                                    ? `${serverUrl}/public/image/${category.categoryImage}`
                                                    : CallBackImg
                                            }
                                            alt={category.SubCategoryName || "SubCategory"}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Category Name */}
                                    <div className="p-2">
                                        <h3 className="text-[12px] md:text-sm font-semibold text-gray-800 text-center truncate">
                                            {category.SubCategoryName}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View More / View Less */}
                        {subCategories.length > categoriesPerRow && (
                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                                >
                                    {showAll ? "View Less" : "View All"}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // 🔹 Empty State
                    <div className="text-center mt-16">
                        <div className="inline-block bg-gray-100 p-10 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                🤷‍♂️ Nothing to Show Here
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Try exploring other categories that have available products.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href="/pages/categories">
                                    <button className="bg-[#da7921] hover:bg-[#c86c1b] text-white font-medium py-2 px-4 rounded-lg transition">
                                        Go to All Categories
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setCategoryId(null)}
                                    className="border border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                                >
                                    🔙 Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
