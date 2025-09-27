"use client";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import CallBackImg from "../../app/Images/DBS/DBSLOGO.jpg";
import Loder from "./Loder";
import AllProductById from "../AllProductById/AllProductById";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/app/redux/features/productByCategory/productByCategorySlice";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

export default function AllSubCategory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const timeoutRef = useRef(null);
  const redirectedRef = useRef(false);
  // const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams?.get("page")) || 1;
  const initialLimit = parseInt(searchParams?.get("limit")) || 50;
  const name = searchParams?.get("name");
  const sort = searchParams?.get("sort") || false;
  const [page, setPage] = useState(initialPage);

  const categoriesPerRow = 8; // default per row

  const { products, loading: loadingProducts, error: errorProducts } =
    useSelector((state) => state.productByCategory);

  // 🔹 Fetch subcategories by categoryId
  const fetchProductsByCategorys = async (categoryId) => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get(
        `/subcategory/get-subcategories-by-category/${categoryId}`
      );
      setSubCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to load subcategories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch when `id` changes
  useEffect(() => {
    if (id) {
      fetchProductsByCategorys(id);
    }
  }, [id]);


  useEffect(() => {
    if (id) {
      fetchProductsByCategory({
        id: id,
        limit: initialLimit,
        page: initialPage,
        sort,
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if ((!loading && !error && subCategories.length === 0 && !redirectedRef.current) && (!products || products.length === 0)) {
      timeoutRef.current = setTimeout(() => {
        redirectedRef.current = true; // ✅ prevent loop
        router.push(
          `/shop/productBysubcategory/${id}?name=${encodeURIComponent(
            subCategories[0]?.Parent_name?.Parent_name || "Category"
          )}`
        );
      }, 2000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [loading, error, subCategories, router, id, products]);


  // 🔹 Error State
  if (error) {
    return (
      <div className="text-center py-6 text-red-500 font-medium">❌ {error}</div>
    );
  }
  console.log("subCategories==>", subCategories)
  // 🔹 Visible categories
  const visibleCategories = showAll
    ? subCategories
    : subCategories.slice(0, categoriesPerRow);

  return (
    <section className="w-full py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
    <Breadcrumbs />

        {subCategories.length > 0 ? <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {subCategories.length > 0
              ? `Shop by ${name || "Category"}`
              : "No SubCategories Available"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subCategories?.length > 0
              ? "Discover our wide range of products across different subcategories."
              : "This category currently has no subcategories. Please explore other categories."}
          </p>
        </div> : !products.length > 0 && <div className="flex justify-center"> <Loder /></div>}

        {/* SubCategories Grid */}
        {subCategories.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {visibleCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/shop/productBysubcategory/${category?._id}`}
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
                      alt={category.subCategoryName || "SubCategory"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Category Name */}
                  <div className="p-2">
                    <h3 className="text-[12px] md:text-sm font-semibold text-gray-800 text-center truncate">
                      {category?.subCategoryName}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* View More / View Less */}
            {subCategories.length > categoriesPerRow && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  {showAll ? "View Less" : "View All"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {products && <div className="mt-10">
        <AllProductById initialPage={initialPage} initialLimit={initialLimit} sort={sort} page={page} setPage={setPage} categoryId={id} />
      </div>}
    </section>
  );
}
