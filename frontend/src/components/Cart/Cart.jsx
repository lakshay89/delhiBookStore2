"use client";
import React, { useEffect, useRef, useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import EmptyCart from "../../app/Images/DowloadImage/EmptyCart.png";
import toast from "react-hot-toast";
import Image from "next/image";
// import product1 from "../../Images/DBS/1.jpg";
import { useSelector, useDispatch } from "react-redux";
import {
  applyCoupon,
  calculateTotalsLoad,
  removeFromCart,
  setApplyCoupon,
  updateCartState,
  updateQuantity,
} from "@/app/redux/AddtoCart/cartSlice";
import Link from "next/link";
import {
  addToCartAPIThunk,
  getAllCartItemsAPI,
  removeFromCartAPI,
  removeFromCartState,
  updateStateQuantity,
} from "@/app/redux/AddtoCart/apiCartSlice";
import axiosInstance, {
  debounce,
  serverUrl,
} from "@/app/redux/features/axiosInstance";
import CallBackImg from "../../app/Images/DBS/DBSLOGO.jpg";
import EmptyWishlist from "../../app/Images/DowloadImage/EmptyCart.png";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/app/redux/hooks/useCurrency";
export default function Cart() {
  const { cartItems, totalAmount, tax, discountAmount, total, couponCode } =
    useSelector((state) => state.cart);
  const { currencySymbol, convert, country } = useCurrency();

  const { items, loading } = useSelector((state) => state.apiCart);
  const { coupons } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.login);
  const { shippingCosts } = useSelector((state) => state.order);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);

  const debouncedUpdateAPI = useRef(
    debounce((id, quantity) => {
      dispatch(addToCartAPIThunk({ productId: id, quantity }));
    }, 500)
  ).current;

  const dispatch = useDispatch();

  let cartItemsValue = [];

  if (user?.email) {
    cartItemsValue = items;
  } else {
    cartItemsValue = cartItems;
  }
  const router = useRouter();

  const [couponCodeInput, setCouponCode] = useState("");

  let newQty = 0;
  const handleRemoveItem = (item) => {
    if (item.quantity > 1) {
      if (user?.email) {
        // newQty--;
        // dispatch(
        //   updateStateQuantity({
        //     id: item.productId._id,
        //     quantity: -1,
        //   })
        // );
        dispatch(
          addToCartAPIThunk({ productId: item.productId._id, quantity: -1 })
        );
      } else {
        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
        // dispatch(removeFromCart(item.id));
        // toast.success(`${item.name} removed from cart`);
      }
    }
  };

  let addnewQty = 0;
  const handleAddItem = (item) => {
    const newQty = item.quantity + 1;
    addnewQty++;
    if (user?.email) {
      // dispatch(
      //   updateStateQuantity({ id: item.productId._id, quantity: 1 })
      // );
      dispatch(
        addToCartAPIThunk({ productId: item.productId._id, quantity: 1 })
      );
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQty }));
    }
  };


  const handleDeleteProduct = (id) => {
    if (user?.email) {
      dispatch(removeFromCartState(id));
      dispatch(removeFromCartAPI(id));
      toast.error("Product removed from cart");
    } else {
      dispatch(removeFromCart(id));
      toast.error("Product removed from cart");
    }
  };

  const subtotal = cartItemsValue.reduce((acc, item) => {
    const price = item?.price || item?.price || item?.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  let discountAmountValue = 0;
  if (user?.email) {
    discountAmountValue = cartItemsValue.reduce((acc, item) => {
      const price = item.productId?.price;
      const finalPrice = item?.finalPrice || item?.totalPrice || item?.productId?.finalPrice;
      const discountPrice = price - finalPrice;
      return acc + discountPrice * item.quantity;
    }, 0);
  } else {
    discountAmountValue = cartItemsValue.reduce((acc, item) => {
      const price = item.price;
      const finalPrice = item?.finalPrice || item?.totalPrice || item?.productId?.finalPrice;
      const discountPrice = price - finalPrice;
      return acc + discountPrice * item.quantity;
    }, 0);
  }
  // Shipping logic
  // const shippingCost = subtotal >= 6 ? 0 : 0.58;
  const shippingCost =
    shippingCosts?.find((item) => item?.countryCode === country)
      ?.shippingCost || 0;
  // Final Total
  const baseAmount = subtotal - discountAmountValue;

  const adjustedCouponDiscount =
    couponDiscount < 100 ? (baseAmount * couponDiscount) / 100 : couponDiscount;

  const finalTotal = baseAmount + shippingCost - adjustedCouponDiscount;

  const handleHasOutOfStockItems = () => {
    if (user?.email) {

      const items = cartItemsValue?.some(
        (item) => item?.productId?.stock === 0
      );

      setHasOutOfStockItems(items);
    } else {
      const items = cartItemsValue?.some((item) => item.isOutOfStock);
      setHasOutOfStockItems(items);
    }
  };
  useEffect(() => {
    dispatch(calculateTotalsLoad());
    dispatch(getAllCartItemsAPI());
  }, [dispatch, cartItems]);

  useEffect(() => {
    handleHasOutOfStockItems();
  }, [cartItemsValue]);

  const initializedRef = useRef(false);


  useEffect(() => {
    const cartFromLocal = JSON.parse(localStorage.getItem("cart")) || [];

    const fetchLatestProducts = async () => {
      try {
        const productIds = cartFromLocal.map((item) => item.id);
        const res = await axiosInstance.post(
          "/product/get-multiple-products-by-id",
          { productIds }
        );

        const latestProducts = res?.data?.products;

        const mergedCart = cartFromLocal.map((item) => {
          const productInfo = latestProducts.find((p) => p._id === item.id);
          return {
            ...item,
            isOutOfStock: productInfo?.stock === 0,
          };
        });

        dispatch(updateCartState(mergedCart));
      } catch (err) {
        console.error("Error syncing cart with stock:", err);
      }
    };

    // setShippingCost
    fetchLatestProducts();
  }, []);

  const handleCheckout = () => {
    if (!user?.email || user?.email === null || user?.email === undefined) {
      router.push("/login");
    } else {
      router.push("/checkout");
    }
  };
  if (cartItemsValue?.length === 0) {
    return (
      <div className="mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={EmptyWishlist} // ✅ Replace with your image path
            alt="Empty Wishlist"
            className="w-60 h-60 object-contain opacity-100"
          />
          <p className="blue-color text-lg font-bold">Your Cart is empty.</p>
          <p className="text-sm text-black font-semibold">
            Start exploring and add items you like!
          </p>
          <Link href="/shop">
            <button className="mt-4 black-btn cursor-pointer">
              Continue to Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  cartItemsValue.map((item) => {
    console.log("item", item?.image ? "IMAGE NOT" : item?.productId?.images);
  });


  cartItemsValue.map((item) => {
    console.log("CHACK=>", item);
  });

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-xl font-bold mb-4">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div
            className="bg-white shadow-lg rounded p-5"
            style={{
              maxHeight: "700px",
              overflowY: "auto",
            }}
          >
            <div className="space-y-4 pr-2">
              {cartItemsValue?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between md:justify-around gap-3 md:gap-4 border-b border-gray-300 pb-3"
                >
                  {/* Image */}
                  <div className="w-16 md:w-20 flex-shrink-0">
                    <Link href={`/shop/${item?.productId?._id ?? item?.id}`}>
                      <Image
                        src={
                          item?.image
                            ? `${serverUrl}/public/image/${item.image}`
                            : item?.productId?.images?.[0]
                            ? `${serverUrl}/public/image/${item.productId.images[0]}`
                            : item?.productId?.image
                            ? `${serverUrl}/public/image/${item.productId.image}`
                            : CallBackImg
                        }
                        alt={item?.name ?? item?.productId?.title}
                        width={72}
                        height={72}
                        className="w-full h-16 md:h-20 object-cover rounded"
                      />
                    </Link>
                  </div>

                  {/* Title + Price - use available space */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-around">
                      <div className="min-w-0">
                        <div
                          className="text-sm md:text-base font-medium text-gray-800 truncate"
                          title={item?.name ?? item?.productId?.title}
                        >
                          {((item?.name ?? item?.productId?.title) || "").slice(0, 40)}{(item?.name ?? item?.productId?.title)?.length > 40 ? "..." : ""}
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">
                            {convert(item?.finalPrice || item?.totalPrice || item?.productId?.finalPrice, "ceil")}
                          </span>
                          {((item?.productId?.price || item?.price) && (item?.productId?.price || item?.price) > (item?.finalPrice || item?.totalPrice || item?.productId?.finalPrice)) && (
                            <span className="text-xs text-gray-400 line-through">
                              {convert(item?.productId?.price || item?.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Desktop: quantity horizontal + delete */}
                      <div className="hidden md:flex items-center ml-4 space-x-3">
                        {!(item?.isOutOfStock || item?.productId?.stock === 0) ? (
                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleRemoveItem(item)} disabled={item.quantity === 1} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200">
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="text-sm font-medium px-2">{item.quantity}</div>
                            <button onClick={() => handleAddItem(item)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 font-semibold">Out of Stock</div>
                        )}

                        {/* Desktop-only total price */}
                        <div className="text-sm font-semibold text-gray-800 ml-3">
                          {convert((item?.finalPrice || item?.totalPrice || item?.productId?.finalPrice) * item.quantity, "ceil")}
                        </div>

                        <button onClick={() => handleDeleteProduct(item?.id ?? item?.productId?._id)} className="text-red-500 ml-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Mobile row: quantity + total */}
                    <div className="flex items-center justify-between mt-3 md:hidden">
                      {/* Mobile quantity */}
                      {!(item?.isOutOfStock || item?.productId?.stock === 0) ? (
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleRemoveItem(item)} disabled={item.quantity === 1} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="text-sm font-medium">{item.quantity}</div>
                          <button onClick={() => handleAddItem(item)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-red-600 font-semibold">Out of Stock</div>
                      )}

                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-semibold">
                          {convert((item?.finalPrice || item?.totalPrice || item?.productId?.finalPrice) * item.quantity, "ceil")}
                        </div>
                        <button onClick={() => handleDeleteProduct(item?.id ?? item?.productId?._id)} className="text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
               ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{convert(subtotal)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                {/* <span>{shippingCost === 0 ? "Free" : convert(shippingCost)}</span> */}
                <span>
                  {convert(
                    shippingCosts?.find((item) => item?.countryCode === country)
                      ?.shippingCost || 0
                  )}
                </span>
              </div>
              {discountAmountValue > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>
                    -{convert(Number(discountAmountValue.toFixed(2)))}
                  </span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Coupon Discount</span>
                  <span>
                    -{`${couponDiscount > 100 ? `${currencySymbol}` : ""}`}
                    {couponDiscount}
                    {couponDiscount < 100 ? "%" : ""}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{convert(finalTotal, "ceil")}</span>
              </div>
            </div>

            {/* Coupon Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const coupon = coupons.find(
                  (coupon) => coupon.couponCode == couponCodeInput
                );

                if (!coupon) {
                  toast.error("Please enter a valid coupon code.");
                  setCouponDiscount(0);
                  return;
                }
                if (coupon.minAmount > finalTotal) {
                  toast.error("Minimum amount should be " + coupon.minAmount);
                  setCouponDiscount(0);
                  return;
                }
                if (coupon.maxAmount < finalTotal) {
                  toast.error("Maximum amount should be " + coupon.maxAmount);
                  setCouponDiscount(0);
                  return;
                }
                // dispatch(applyCoupon(couponCodeInput));

                if (couponCodeInput === coupon.couponCode) {
                  setCouponDiscount(coupon.discount);
                  dispatch(
                    setApplyCoupon({
                      couponCode: coupon.couponCode,
                      discount: coupon.discount,
                    })
                  );
                  toast.success("Coupon Applied Successfully!");
                  return;
                } else {
                  toast.error("Please enter a valid coupon code.");
                  setCouponDiscount(0);
                  return;
                }
              }}
              className="mt-4 space-y-2"
            >
              <label htmlFor="coupon" className="text-sm font-medium">
                Coupon Code
              </label>
              <input
                type="text"
                id="coupon"
                placeholder="Enter code"
                value={couponCodeInput}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full border border-gray-300 focus:outline-purple-600 rounded px-3 py-2"
              />
              <button
                type="submit"
                className="w-full purple-btn cursor-pointer"
                disabled={!couponCodeInput.trim()}
              >
                Apply Coupon
              </button>
            </form>

            <button
              className={`w-full ${hasOutOfStockItems ? "bg-gray-400" : "bg-black cursor-pointer"
                } text-white py-2 rounded text-lg cursor-pointer`}
              disabled={hasOutOfStockItems}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <div className="text-center text-xs text-gray-500 mt-2">
              <p>🔒 Secure checkout powered by DELHI BOOK STORE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
