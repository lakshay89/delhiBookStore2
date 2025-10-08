"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  BookOpenText,
  CheckCheck,
  ChevronsLeft,
  Heart,
  Share2,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";
import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CallBackImg from "../../app/Images/DBS/DBSLOGO.jpg";
import { Parser } from "html-to-react";
import {
  addToCartAPIThunk,
  addtoCartState,
} from "@/app/redux/AddtoCart/apiCartSlice";
import {
  addToWishlist,
  addToWishlistApi,
  addToWishlistState,
  removeFromWishlist,
  removeFromWishlistApi,
  removeFromWishlistState,
} from "@/app/redux/wishlistSlice";
import ISBNBarcode from "../ISBNBarcode/ISBNBarcode";
import { useCurrency } from "@/app/redux/hooks/useCurrency";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

export default function ProductDetails() {
  // Api for show ingle prodict data
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  console.log("------------------------" + name + category + subcategory);
  const [activeTab, setActiveTab] = useState("details");
  const htmlParser = new Parser();
  const dispatch = useDispatch();
  const { currency, convert } = useCurrency();

  const user = useSelector((state) => state.login.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: apiCartItems } = useSelector((state) => state.apiCart);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const handleAddToCart = async (product) => {
    const exists = cartItems.some((item) => item.id === product._id);
    const insideApiExists = apiCartItems.some(
      (item) => item.productId?._id === product._id
    );

    const cartItem = {
      id: product._id,
      name: product.title,
      image: product?.images[0],
      price: Math.round(product.finalPrice),
      finalPrice: Math.round(product.finalPrice),
      quantity: 1,
    };

    if (!user && !user?.email) {
      try {
        await dispatch(addToCart(cartItem));

        toast.success(
          exists
            ? "Quantity updated in your cart!"
            : `Great choice! ${product.title} added.`
        );
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Cart error:", error);
      }
    } else {
      dispatch(addtoCartState({ id: product._id }));
      dispatch(addToCartAPIThunk({ productId: product._id, quantity: 1 }));
      toast.success(
        insideApiExists
          ? "Quantity updated in your cart!"
          : `Great choice! ${product.title} added.`
      );
    }
  };

  const handleAddToWishlist = (_id, title, images, finalPrice, price) => {
    if (user?.email) {
      const isAlreadyInWishlist = wishlistItems.some(
        (item) => item._id === _id
      );
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlistState(_id));
        dispatch(removeFromWishlistApi(_id));
        toast.error("Remove from wishlist.");
      } else {
        dispatch(addToWishlistState({ _id }));
        dispatch(addToWishlistApi({ productId: _id }));
        toast.success(`"${title}" added to wishlist.`);
      }
    } else {
      const isAlreadyInWishlist = wishlistItems?.some(
        (item) => item.id === _id
      );
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlist(_id));
        toast.error("removed from wishlist.");
      } else {
        dispatch(
          addToWishlist({
            id: _id,
            name: title,
            image: images,
            price: finalPrice,
            oldPrice: price,
          })
        );
        toast.success(`"${title}" added to wishlist.`);
      }
    }
  };

  const router = useRouter();

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    router.push("/pages/checkout");
  };
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Check out this product!",
          text: `I found this amazing book on DELHI BOOK STORE`,
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(
        "Sharing not supported in this browser. You can copy the link manually."
      );
    }
  };

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params?.id;
  console.log("idididididididididididididididididididididididididididididid=>", id)
  useEffect(() => {
    if (!id) return;
    // alert("id")
    const fetchProductDetail = async () => {
      try {

        const response = await axiosInstance.get(`/product/get-product/${id}`);
        console.log("Product data:=>", response);
        setBook(response.data.product);

      } catch (err) {
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!book) {
    return (
      <div className="text-center text-gray-500">
        {loading ? "Loading..." : "Product not found."}
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-0">
      {/* Back Button */}

      <div className="mb-6 flex" onClick={() => router.back()}>
        {/* <Link
          href="/pages/shop"
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        > */}
        <ChevronsLeft />
        Back to Books
        {/* </Link> */}

      </div>
      <Breadcrumbs />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}

          <div className="h-[100%] border border-green-500 rounded-lg overflow-hidden bg-white p-4 flex items-center justify-center">
            <Image
              // src={book1}
              src={
                book?.images?.[0]
                  ? `${serverUrl}/public/image/${book?.images[0]}`
                  : CallBackImg
              }
              width={500}
              height={500}
              alt={book?.title}
              zoom={2}
            />
          </div>
        </div>

        {/* Middle Column - Book Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <p className="text-lg text-gray-500">by {book.author}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 border border-green-600 rounded-md hover:bg-green-100 cursor-pointer"
                  onClick={() =>
                    handleAddToWishlist(
                      book._id,
                      book.title,
                      book?.images[0],
                      book.finalPrice,
                      book.oldPrice
                    )
                  }
                >
                  {(
                    user?.email
                      ? wishlistItems?.some((item) => item?._id === book._id)
                      : wishlistItems?.some((item) => item.id === book._id)
                  ) ? (
                    "❤️"
                  ) : (
                    <Heart size={20} />
                  )}
                  <span className="sr-only">Add to wishlist</span>
                </button>
                <button
                  className="p-2 border border-green-600 rounded-md hover:bg-green-100 cursor-pointer"
                  onClick={handleShare}
                >
                  <Share2 />
                  <span className="sr-only">Share</span>
                </button>
              </div>
            </div>

            {book?.category && book?.category?.SubCategoryName && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Link
                  href={`/pages/shop/productBysubcategory/${book?.category?._id}`}
                >
                  <span className="px-2.5 py-0.5 bg-green-100 blue-color text-xs font-medium rounded-full">
                    {book?.category?.SubCategoryName}
                  </span>
                </Link>
              </div>
            )}
          </div>

          <hr className="border-green-400" />

          <div className="space-y-4">
            <div className="space-y-1 text-left">
              {/* Discount and Final Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-red-600 text-2xl font-semibold">
                  -{book.discount}%
                </span>
                <span className="text-[28px] font-bold text-gray-900">
                  {convert(book?.finalPrice)}
                </span>
              </div>

              {/* MRP */}
              <div className="text-sm text-gray-500">
                M.R.P.:{" "}
                <span className="line-through">{convert(book?.price)}</span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-700">
              <BookOpenText />

              <span>
                Hardcover · {book.pages} pages{" "}
                {/* {book?.language && `. ${book.language}`} */}
              </span>
            </div>

            {book?.stock === 0 && (
              <div className="w-full flex items-center gap-2 p-3 text-sm text-white bg-gradient-to-r from-red-600 to-red-500 rounded shadow-sm">
                <i className="fa-solid fa-ban text-white"></i>
                <span>Sorry! This book is currently out of stock.</span>
              </div>
            )}
          </div>
          {book?.stock > 0 && (
            <div className="flex flex-col space-y-3">
              <button
                className={`${cartItems.some((item) => item.id === book.id)
                  ? "w-full bg-black cursor-pointer text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  : "w-full blue-bg cursor-pointer hover:bg-yellow-bg text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  }`}
                onClick={() => handleAddToCart(book)}
              >
                {cartItems.some((item) => item.id === book.id) ? (
                  <>
                    Added to cart <CheckCheck />
                  </>
                ) : (
                  <>
                    <ShoppingCart /> Add to cart
                  </>
                )}
              </button>
              {/* <Link href={"/pages/checkout"}> */}
              <button
                className="w-full border cursor-pointer border-gray-500 hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
                onClick={() => handleBuyNow(book)}
              >
                Buy Now
              </button>
              {/* </Link> */}
            </div>
          )}
        </div>

        {/* Right Column - Description and QR Code */}
        <div className="space-y-6">
          <div>
            <div className="flex border-b border-green-700">
              <button
                className="px-4 py-2 font-medium text-sm text-black hover:text-green-700 cursor-pointer"
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "details" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Format:</div>
                    <div>Hardcover</div>

                    <div className="font-medium">Pages:</div>
                    <div>{book?.pages || "N/A"}</div>

                    {/* <div className="font-medium">Language:</div>
                    <div>{book?.language || "N/A"}</div> */}

                    <div className="font-medium">ISBN-10:</div>
                    <div>{book?.ISBN || "N/A"}</div>
                    <div className="font-medium">ISBN-13:</div>
                    <div>{book?.ISBN13 || "N/A"}</div>

                    <div className="font-medium">Publisher:</div>
                    <div>{book.publisher}</div>

                    <div className="font-medium">Publication Date:</div>
                    <div>{book.publicationDate}</div>
                  </div>
                </div>
              )}

              {/* {activeTab === "highlights" && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{book.highlights}</p>
                </div>
              )} */}
            </div>
          </div>

          <div className="border border-green-600 rounded-lg overflow-hidden">
            <div className="p-3">
              <div className="text-center space-y-2">
                <h3 className="font-medium">
                  Scan to view this book information.
                </h3>
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-lg">
                    {/* <Image src={QR} alt="QR Code" width={180} height={180} /> */}
                    <ISBNBarcode isbn={book.ISBN13} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="text-gray-200 my-5" />
      {book?.description && (
        <p className="text-sm leading-relaxed">
          Description :{htmlParser.parse(book.description)}
        </p>
      )}

      <hr className="text-gray-200 my-5" />
    </div>
  );
}
