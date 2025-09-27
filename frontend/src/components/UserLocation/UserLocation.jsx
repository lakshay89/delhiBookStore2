"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { data } = await axios.get("https://ipapi.co/json/");
        console.log("DDDDDD:==>", data)
        setLocation({ city: data.city, region: data.region });
      } catch (err) {
        setError("Failed to detect location.");
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      {location ? (
        <p className="m-0 p-0 location-detact">
          {location.city}
        </p>
      ) : (
        <>
          <p className="m-0 p-0 location-detact">Detecting location...</p>
          {error && (
            <p className="m-0 p-0 location-detact text-danger">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
