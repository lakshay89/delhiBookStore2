"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserLocation() {
  // always declare hooks at the top
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch IP-based location once on mount
    const getLocation = async () => {
      try {
        const { data } = await axios.get("https://ipapi.co/json/");
        // you can log it for debugging
        console.log("Location API result:", data);
        setLocation({ city: data.city, region: data.region });
      } catch (err) {
        console.error("Location API error:", err);
        setError("Failed to detect location.");
      }
    };

    getLocation();
  }, []);

  // render conditionally but keep hook order stable
  return (
    <div>
      {location ? (
        <p className="m-0 p-0 location-detact">
          {location.city}, {location.region}
        </p>
      ) : (
        <>
          <p className="m-0 p-0 location-detact">Detecting location…</p>
          {error && (
            <p className="m-0 p-0 location-detact text-danger">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
