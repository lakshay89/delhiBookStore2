"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PMMODIFY from "../../app/Images/DBS/DBSModiJi2.png";

export default function AddImageShowHomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [scale, setScale] = useState(1); // zoom level
  const [position, setPosition] = useState({ x: 0, y: 0 }); // drag position
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Show popup after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // -------- Mouse Events --------
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // -------- Touch Events (Mobile/Tablet) --------
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return; // ignore multi-touch
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // -------- Zoom Controls --------
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3)); // max 3x
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5)); // min 0.5x
  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className={showPopup ? "relative  flex items-center justify-center bg-gray-100" : ''}>
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white/70 z-50 animate-fadeIn"
        // onClick={() => setShowPopup(false)} // close on overlay click
        >
          <div
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden
                       w-[90%] sm:w-[85%] md:w-[55%] lg:w-[45%] xl:w-[30%] 
                       h-[75%] sm:h-[80%] md:h-[85%] lg:h-[90%]
                       flex flex-col"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside popup
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 z-10 text-gray-600 hover:text-gray-800 text-2xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Zoom Controls */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              <button
                onClick={zoomOut}
                className="px-3 py-1 rounded-lg bg-gray-800 text-white hover:bg-gray-600 text-lg"
              >
                ➖
              </button>
              <button
                onClick={reset}
                className="px-3 py-1 rounded-lg bg-gray-800 text-white hover:bg-gray-600 text-lg"
              >
                Reset
              </button>
              <button
                onClick={zoomIn}
                className="px-3 py-1 rounded-lg bg-gray-800 text-white hover:bg-gray-600 text-lg"
              >
                ➕
              </button>
            </div>

            {/* Image Container */}
            <div
              className="flex-1 relative bg-gray-200 overflow-hidden 
                         cursor-grab active:cursor-grabbing touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                }}
              >
                <Image
                  src={PMMODIFY}
                  alt="Supermarket banner"
                  width={1200}
                  height={1200}
                  className="object-contain max-h-full max-w-full rounded-lg select-none p-4"
                  priority
                  draggable={false} // prevent ghost dragging
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
