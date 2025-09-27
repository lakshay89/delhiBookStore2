// "use client";
// import React from "react";

// export default function Loader() {
//   return (
//     <div className="loader-container">
//       <div className="book-loader">
//         <div className="book-cover">
//           <div className="book-spine"></div>
//           <div className="book-front"></div>
//         </div>
//         <div className="pages-container">
//           <div className="page page-1"></div>
//           <div className="page page-2"></div>
//           <div className="page page-3"></div>
//           <div className="page page-4"></div>
//         </div>
//       </div>
//       <p className="loading-text">Loading your library...</p>

//       <style jsx>{`
//         .loader-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 2rem;
//           background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
//           border-radius: 12px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//           max-width: 300px;
//           margin: 50px auto;
//         }

//         .book-loader {
//           position: relative;
//           width: 120px;
//           height: 160px;
//           perspective: 1000px;
//           margin-bottom: 1.5rem;
//         }

//         .book-cover {
//           position: absolute;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(45deg, #8B4513 0%, #A0522D 100%);
//           border-radius: 5px 12px 12px 5px;
//           box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
//           transform-style: preserve-3d;
//           transform: rotateY(0deg);
//           z-index: 10;
//         }

//         .book-spine {
//           position: absolute;
//           left: 0;
//           top: 5%;
//           height: 90%;
//           width: 8px;
//           background: linear-gradient(to right, #654321 0%, #43210A 100%);
//           transform: translateZ(-5px);
//         }

//         .book-front {
//           position: absolute;
//           width: 90%;
//           height: 20px;
//           bottom: 15px;
//           left: 5%;
//           background: rgba(0, 0, 0, 0.1);
//           border-radius: 2px;
//         }

//         .pages-container {
//           position: absolute;
//           width: 95%;
//           height: 95%;
//           top: 2.5%;
//           left: 0;
//           transform-style: preserve-3d;
//         }

//         .page {
//           position: absolute;
//           width: 100%;
//           height: 100%;
//           background: #fafafa;
//           border-radius: 2px 8px 8px 2px;
//           transform-origin: left center;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #888;
//           font-size: 12px;
//         }

//         .page-1 {
//           animation: pageFlip 1.8s infinite ease-in-out;
//           animation-delay: 0.2s;
//         }

//         .page-2 {
//           animation: pageFlip 1.8s infinite ease-in-out;
//           animation-delay: 0.6s;
//         }

//         .page-3 {
//           animation: pageFlip 1.8s infinite ease-in-out;
//           animation-delay: 1.0s;
//         }

//         .page-4 {
//           animation: pageFlip 1.8s infinite ease-in-out;
//           animation-delay: 1.4s;
//         }

//         .loading-text {
//           color: #5D4037;
//           font-family: 'Georgia', serif;
//           font-size: 1.1rem;
//           margin-top: 1rem;
//           text-align: center;
//           animation: pulse 1.5s infinite alternate;
//         }

//         @keyframes pageFlip {
//           0% {
//             transform: rotateY(0deg);
//             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           }
//           30% {
//             transform: rotateY(-150deg);
//             box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.1);
//           }
//           70% {
//             transform: rotateY(-150deg);
//             box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.1);
//           }
//           100% {
//             transform: rotateY(0deg);
//             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           }
//         }

//         @keyframes pulse {
//           0% {
//             opacity: 0.7;
//           }
//           100% {
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";
import React from "react";
import Image from "next/image";
import stylebanner from "../../app/Images/DBS/bookEffect.gif";

export default function Loader() {
  return (
    <div className="">
      <Image src={stylebanner} alt="Loading..." className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-56 lg:h-56 mx-auto" priority />
    </div>
  );
}
