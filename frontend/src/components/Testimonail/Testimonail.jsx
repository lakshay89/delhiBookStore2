"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star } from "lucide-react";
import Image from "next/image";
import axiosInstance from "../../app/redux/features/axiosInstance";

// Local fallback/testimonial data
import testi1 from "../../app/Images/DowloadImage/Testi1.jpg";
import testi2 from "../../app/Images/DowloadImage/Testi2.jpg";
import testi3 from "../../app/Images/DowloadImage/testi3.jpg";
import testi4 from "../../app/Images/DowloadImage/testi4.jpg";

const staticTestimonials = [
  {
    fullName: "Anjali Sharma",
    rating: 4.5,
    masseg:
      "Amazing collection of academic and reference books. Fast delivery and great packaging!",
    profileImage: testi1,
  },
  {
    fullName: "Priya Verma",
    rating: 4,
    masseg:
      "I found all my engineering textbooks at discounted prices. Highly recommend this bookstore!",
    profileImage: testi2,
  },
  {
    fullName: "Rani Mehra",
    rating: 4.2,
    masseg:
      "Books are genuine and in perfect condition. A great place to shop for competitive exam prep.",
    profileImage: testi3,
  },
  {
    fullName: "Sunita Rani",
    rating: 3.8,
    masseg:
      "Delivery was a bit delayed, but the book quality and variety made up for it.",
    profileImage: testi4,
  },
];

const Testimonial = () => {
  const [reviews, setReviews] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axiosInstance.get("/feedback/get-all-feedback");
        if (res?.data?.success === true) {
          const activeReviews = res.data.feedback.filter(
            (item) => item?.isActive === true
          );
          setReviews(activeReviews || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
        setFetchError(err.message);
      }
    };

    fetchAllReviews();
  }, []);

  // Merge static + dynamic reviews
  const allTestimonials = [...staticTestimonials, ...reviews];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold blue-color">Our Customers</h2>
        <p className="text-sm text-gray-500">
          Honest feedback from our valued customers.
        </p>
        {fetchError && (
          <p className="text-xs text-red-500">
            Couldn’t load live reviews — showing static testimonials instead.
          </p>
        )}
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={10}
        navigation
        slidesPerView={1}
        breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
      >
        {allTestimonials.map((t, idx) => {
          const fullName = t?.fullName || t?.userId?.fullName || "Anonymous";
          const rating = t?.rating || 0;
          const message = t?.masseg || t?.message || "No feedback provided.";
          const count = t?.count || null;
          const profileImage =
            t?.profileImage ||
            t?.userId?.profileImage ||
            "https://via.placeholder.com/80";

          return (
            <SwiperSlide key={idx}>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow hover:shadow-md transition text-sm h-full">
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={48}
                  height={48}
                  className="w-12 h-12 mx-auto rounded-full object-cover mb-2"
                />
                <h4 className="font-semibold text-gray-800">{fullName}</h4>

                {/* Stars */}
                <div className="flex justify-center items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.round(rating) ? "#facc15" : "none"}
                      stroke="#facc15"
                    />
                  ))}
                  {count && (
                    <span className="text-xs text-gray-600 ml-1">{count}</span>
                  )}
                </div>

                <hr className="my-2" />
                <p className="text-gray-600 text-xs line-clamp-3">{message}</p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Testimonial;
