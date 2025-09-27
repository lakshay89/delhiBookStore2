"use client";
import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from "lucide-react";
import Webfeature from "@/components/Webfeature/Webfeature";
import axiosInstance from "@/app/redux/features/axiosInstance";
import toast from "react-hot-toast";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [phone, setPhone] = useState([])

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Phone number is required.";
    } else if (!/^[0-9]{10,15}$/.test(formData.subject)) {
      newErrors.subject = "Invalid phone number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await axiosInstance.post("/contact-form/send-contact-form", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 py-5 text-gray-700">
      <Breadcrumbs />
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium uppercase text-gray-500">
          Contact With Us
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
          You can ask us questions
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Contact us for all your questions and opinions, or you can solve your
          problems in a shorter time with our contact offices.
        </p>
      </div>

      <hr className="my-10 border-gray-200" />

      {/* Contact Info + Form Section */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Our Offices</h2>
          <p className="mb-6 text-gray-600">
            Visit our main store in New Delhi for a wide selection of academic,
            professional, and general books. We’re here to help you find what
            you need.
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="mb-8 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span>Delhi</span>
              </div>
              <h3 className="text-lg font-semibold">Delhi Book Store</h3>
              <p className="text-gray-600">
                19, Ansari Rd, Daryaganj, New Delhi, Delhi, 110002
              </p>
              <p className="font-medium mt-1"><span className="text-red-500">Toll Free:</span>{phone.map((phone) => <div>{phone?.phone}</div>)}</p>
              <p className="text-sm mb-2">info@delhibookstore.com</p>

              <div className="text-sm text-gray-600 mt-2">
                <p>
                  <strong>Saturday</strong> (Ashura): 9:00 am – 6:30 pm{" "}
                  <span className="italic text-red-500">
                    Hours might differ
                  </span>
                </p>
                <p>
                  <strong>Sunday</strong> (Ashura):{" "}
                  <span className="text-red-500">Closed</span>
                </p>
                <p>
                  <strong>Monday – Friday:</strong> 9:00 am – 6:30 pm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name *"
                required
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email *"
                required
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Your phone number *"
                required
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.subject && (
                <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows={5}
                required
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white font-semibold py-2 px-6 rounded-md transition flex items-center justify-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Social Icons */}
      {/* <div className="mt-16 flex items-center gap-4 text-gray-600 text-sm">
        <span>Follow us:</span>
        <a
          href="#"
          aria-label="Facebook"
          className="text-white bg-blue-600 p-2 rounded-full hover:opacity-80"
        >
          <Facebook className="w-4 h-4" />
        </a>
        <a
          href="#"
          aria-label="Twitter"
          className="text-white bg-sky-400 p-2 rounded-full hover:opacity-80"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a
          href="#"
          aria-label="Instagram"
          className="text-white bg-pink-500 p-2 rounded-full hover:opacity-80"
        >
          <Instagram className="w-4 h-4" />
        </a>
        <a
          href="#"
          aria-label="LinkedIn"
          className="text-white bg-blue-800 p-2 rounded-full hover:opacity-80"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div> */}

      <Webfeature />
    </div>
  );
};

export default ContactUs;
