"use client";
import React, { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
// import payment from "../../Images/DowloadImage/paymentsecure.avif";
import payment from "../../app/Images/DowloadImage/paymentsecure.avif";
import Image from "next/image";
import Link from "next/link";
import logo from "../../app/Images/DBS/DBSLOGO.jpg";
// import logo from "../../../Images/DBS/DBSLOGO.jpg";
import { fetchCategories } from "@/app/redux/features/getAllCategory/categorySlice";
import { verifyUser } from "@/app/redux/features/auth/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "@/app/redux/features/axiosInstance";

const Footer = () => {
  const user = useSelector((state) => state.login.user);

  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [product, setProduct] = useState([]);
  const [phone, setPhone] = useState([]);
  const fetchNewArrivals = async () => {
    try {
      const response = await axiosInstance.get(
        "/product/get-best-selling-books"
      );
      setProduct(response.data.products || []);
    } catch (err) {
      toast.error(
        "Failed to load New Arrival product. Please try again later."
      );
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(verifyUser());
    fetchNewArrivals();
  }, [dispatch]);
  const fetchNumber = async () => {
    try {
      const res = await axiosInstance.get(`/setting/get-all-setting`);
      console.log("formData=>", res.data.data);
      if (res.status === 200) {
        setPhone(res?.data?.data);
      }
    } catch (err) {
      toast.error("Failed to fetch number");
    }
  }
  useEffect(() => {
    fetchNumber()
  }, [])
  console.log("CCCCCCCCCCC=>", phone.map((i) => i))
  return (
    <footer className="bg-gray-100 text-black text-sm border-t border-gray-400" >
      {/* Links section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Help */}
        <div>
          <Link href={"/"}>
            <Image src={logo} alt="logo" className="w-30 h-20 md:m-auto" />
          </Link>
          <div className="my-2 flex items-center gap-4">
            <Phone style={{ color: "var(--purple)" }} />{" "}
            <div className="flex flex-col items-left text-sm">
              <p className=" text-gray-600">Office timing: 9.00am to 6.30pm</p>

              {phone?.map((phone) => (
                <a
                  key={phone?._id}
                  href={`tel:${phone?.phone}`}
                  className="text-lg font-bold mt-1  hover:underline"
                >
                  {phone?.phone}
                </a>
              ))}

            </div>
          </div>
          <div className="mb-2 flex items-center gap-4">
            <Mail style={{ color: "var(--purple)" }} />{" "}
            <div className="flex flex-col items-left">
              <p className=" text-gray-600">info@delhibookstore.com</p>
              {/* <p className=" text-gray-600">info@delhibookstore.com</p> */}
            </div>
          </div>
        </div>

        {/* Make Money */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-gray-600">
            {categories.slice(0, 5).map((category, id) => (
              <li className="hover:underline hover:text-black" key={id}>
                <Link href={`/pages/categories/${category._id}`}>
                  {category.Parent_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help You */}
        <div>
          <h3 className="font-semibold mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/shop">Shop Books</Link>
            </li>
            <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/featurebook">Feature Books</Link>
            </li>
            <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/bestSellerbook">Best Sellers</Link>
            </li>
            {/* <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/blog">Blog</Link>
            </li> */}
            <li className="hover:underline hover:text-black">
              {" "}
              <Link href="/pages/contact">Contact US</Link>
            </li>
          </ul>
        </div>

        {/* Know Us */}
        <div>
          <h3 className="font-semibold mb-3">Best Selling Books</h3>
          <ul className="space-y-2 text-gray-600">
            {product?.slice(0, 5)?.map((pro, id) => (
              <li
                className="hover:underline hover:text-black line-clamp-1"
                key={id}
              >
                <Link href={`/pages/shop/${pro._id}`}>{pro.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Download + Social */}
        <div>
          <h3 className="font-semibold mb-3">Follow us on social media</h3>
          <div className="flex space-x-3">
            <Link
              href="https://www.instagram.com/delhibookstore?igsh=MTU2anY5b25oZzN6ZQ=="
              target="_blank"
              aria-label="Visit our Instagram"
              className="p-2 bg-white text-red-600 rounded shadow"
            >
              <Instagram />
            </Link>
            <Link
              href="https://www.linkedin.com/company/delhibookstore/"
              target="_blank"
              aria-label="Visit our Linkedin"
              className="p-2 bg-white text-blue-500 rounded shadow"
            >
              <Linkedin />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t text-center pb-25 md:pb-4 text-sm text-gray-400 pt-1 px-4 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="flex flex-col">
          <Image src={payment} className="h-25 w-70 m-auto md:m-0" alt="Visa" />

          <p className="m-0 text-gray-600">
            Copyright 2025 © DELHI BOOK STORE.
          </p>
        </div>
        <div className="flex flex-wrap space-x-3 space-y-4 md:space-y-0 mt-2 md:mt-0">
          <Link
            href="/pages/privacy-policy"
            className="text-gray-600 hover:text-gray-700"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/pages/legal-policy"
            className="text-gray-600 hover:text-gray-700"
          >
            Legal Policy
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/pages/sales-policy"
            className="text-gray-600 hover:text-gray-700"
          >
            Sales Policy
          </Link>
          <span className="text-gray-600">|</span>
          {/* <Link
            href="/pages/return-refund-policy"
            className="text-gray-600 hover:text-gray-700"
          >
            Return & Refund Policy
          </Link>
          <span className="text-gray-600">|</span> */}

          <Link
            href="/pages/shipping-policy"
            className="text-gray-600 hover:text-gray-700"
          >
            Shipping Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
