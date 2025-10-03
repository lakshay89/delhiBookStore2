"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserLocation() {
  const [location, setLocation] = useState({ city: "Unknown", region: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { data } = await axios.get("https://ipapi.co/json/");
        console.log("Location API result:", data);
        setLocation({ city: data.city || "Unknown", region: data.region || "" });
      } catch (err) {
        console.error("Location API error:", err.message);
        // fallback location already set
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="m-0 p-0 location-detact">Detecting location…</p>
      ) : (
        <p className="m-0 p-0 location-detact">
          {location.city} {location.region && `, ${location.region}`}
        </p>
      )}
    </div>
  );
}
