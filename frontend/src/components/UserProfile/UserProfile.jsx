"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import userImage from "../../Images/DowloadImage/testi6.jpg";
import bookimage1 from "../../Images/DBS/1.jpg";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Edit,
  HelpCircle,
  LogOut,
  Package,
  ShoppingBag,
  User,
  BookOpenText,
  ShoppingCartIcon,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
import {
  handleLogout,
  resetState,
  updateProfileImg,
  updateUser,
} from "@/app/redux/features/auth/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getOrder } from "@/app/redux/features/order/orderSlice";
import toast from "react-hot-toast";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import { resetWishlistState } from "@/app/redux/wishlistSlice";
import { resetCartState } from "@/app/redux/AddtoCart/apiCartSlice";
import { useCurrency } from "@/app/redux/hooks/useCurrency";

export default function UserProfile() {
  // 🟢 all hooks at top
  const [activeTab, setActiveTab] = useState("orders");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { currency, convert } = useCurrency();

  const { user, loading } = useSelector((state) => state.login);
  const { order: orders } = useSelector((state) => state.order);

  // effects always run regardless
  useEffect(() => {
    if (!user) router.push("/");
    dispatch(getOrder());
  }, [user, dispatch, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading("Updating image...");
    dispatch(updateProfileImg({ image: file }))
      .unwrap()
      .then(() => {
        toast.dismiss(loadingToast);
        setSelectedFile(URL.createObjectURL(file));
        toast.success("Image updated successfully");
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error(err || "Something went wrong");
      });
  };

  const handleSaveChanges = () => {
    let payload = {
      fullName: formData.fullName,
      city: formData.city,
      phone: formData.phone,
      address: formData.address,
    };
    dispatch(updateUser(payload))
      .unwrap()
      .then(() => toast.success("Profile updated successfully"))
      .catch(() => toast.error("Failed to update profile"))
      .finally(() => setIsEditingProfile(true));
  };

  const handleLogoutFun = () => {
    handleLogout();
    dispatch(resetState());
    dispatch(resetWishlistState());
    dispatch(resetCartState());
  };

  const handleOrderClick = (order) => setSelectedOrder(order);
  const handleBackToOrders = () => setSelectedOrder(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { question: "How do I track my order?", answer: "You can track your order by going to the 'My Orders' section..." },
    { question: "How can I return an item?", answer: "To return an item, go to your orders, select the item..." },
    { question: "What is your refund policy?", answer: "We process refunds within 5-7 business days..." },
    { question: "How do I change my password?", answer: "Go to Account Settings > Security > Change Password..." },
    { question: "How can I contact customer support?", answer: "You can reach out to our support team via the Contact Us page..." },
  ];

  // 🟢 always return the same JSX tree, conditional content inside
  return (
    <div className="min-h-screen bg-gray-100">
      {loading || !user ? (
        <div className="p-6 text-center">Loading…</div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold blue-color">My Profile</h1>
                <div className="flex items-center space-x-4">
                  <button className="p-2 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200">
                    <BookOpenText className="h-6 w-6 text-gray-600" />
                  </button>
                  <div className="relative">
                    <Image
                      src={
                        selectedFile
                          ? selectedFile
                          : user?.profileImage
                          ? user.profileImage.includes("picsum.photos") ||
                            user.profileImage.includes("res.cloudinary.com")
                            ? user.profileImage
                            : `${serverUrl}/public/image/${user.profileImage}`
                          : CallBackImg
                      }
                      alt="Profile"
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              {/* ...keep your sidebar JSX here exactly as before... */}

              {/* Main content area */}
              <div className="w-full md:w-3/4">
                {activeTab === "orders" && !selectedOrder && (
                  <div className="bg-white rounded-lg shadow">
                    {/* orders list JSX */}
                  </div>
                )}

                {activeTab === "orders" && selectedOrder && (
                  <div className="bg-white rounded-lg shadow">
                    {/* selected order details JSX */}
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div className="bg-white rounded-lg shadow">
                    <Wishlist />
                  </div>
                )}

                {activeTab === "cart" && (
                  <div>
                    <Cart />
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="bg-white rounded-lg shadow">
                    {/* profile form JSX */}
                  </div>
                )}

                {activeTab === "help" && (
                  <div className="bg-white rounded-lg shadow">
                    {/* help center JSX */}
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
