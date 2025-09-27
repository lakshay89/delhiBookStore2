import React from "react";

const page = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold text-center  mb-6 uppercase">
        Shipping Policy
      </h1>

      <div className="space-y-4 text-gray-800 text-base leading-relaxed">
        <p>📦 <strong>Free Shipping Within India</strong></p>

        <p>
          To avail the free shipping option for deliveries within India, the following conditions must be met:
        </p>

        <ul className="list-disc list-inside pl-4">
          <li>The order value must be at least <strong>₹1000</strong></li>
          <li>The total weight of the books should be less than <strong>2 Kg</strong></li>
        </ul>

        <p>
          ⏱️ <strong>Delivery Timeline:</strong><br />
          All eligible orders will be delivered within <strong>3–5 business days</strong> from the date of dispatch.
        </p>

        <p>
          🚚 If the weight of the books exceeds <strong>2 Kg</strong>, a representative from our team will contact you with the applicable shipping charges before the order is processed.
        </p>
      </div>
    </div>
  );
};

export default page;
