import React from "react";
import banner from "../Images/DBS/BANNER10.jpg";
import aboutimage1 from "../Images/DBS/BANNER9.jpg";
import aboutimage2 from "../Images/DBS/BANNER14.png";
import aboutimage3 from "../Images/DBS/BANNER8.jpg";
import Image from "next/image";
// import Breadcrumbs from "../app/components/Breadcrumbs/Breadcrumbs";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

export const metadata = {
  title: 'About DelhiBookStore | Our Story of Luxury & Rare Books, India',
  description: 'Discover the passion behind DelhiBookStore. Learn about our mission to curate the finest luxury premium books and rare editions for discerning collectors worldwide, proudly based in Delhi, India.',
  keywords: [
    'about DelhiBookStore',
    'DelhiBookStore story',
    'luxury book store mission',
    'premium books online about us',
    'rare book dealer profile',
    'Delhi luxury book shop',
    'international book seller',
    'finest literary collections',
    'our vision books',
    'boutique bookstore philosophy',
    'collectible books journey',
    'heritage of books Delhi',
    'art of curation books',
    'Delhi based luxury bookstore',
    'worldwide shipping rare books',
    'exclusive book collections',
    'high-end literary art',
    'first edition books philosophy',
    'signed books mission',
    'our commitment to quality books',
    'discerning readers bookstore',
    'global luxury book market',
    'book collecting passion',
    'delhi online book store about',
    'premium literary service',
    'unique book sourcing Delhi',
    'luxury reading experience',
    'book enthusiasts destination',
  ], // Now 28 keywords
  openGraph: {
    title: 'About DelhiBookStore | Our Story of Luxury & Rare Books, India',
    description: 'Discover the passion behind DelhiBookStore. Learn about our mission to curate the finest luxury premium books and rare editions for discerning collectors worldwide, proudly based in Delhi, India.',
    url: 'https://www.delhibookstore.com/about', // **IMPORTANT: Your actual About Us page URL**
    siteName: 'DelhiBookStore',
    images: [
      {
        url: 'https://www.delhibookstore.com/og-image-about-us.jpg', // **Custom OG image for About Us**
        width: 1200,
        height: 630,
        alt: 'The Story of DelhiBookStore - Luxury Books, India',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About DelhiBookStore | Our Story of Luxury & Rare Books, India',
    description: 'Discover the passion behind DelhiBookStore. Learn about our mission to curate the finest luxury premium books and rare editions for discerning collectors worldwide, proudly based in Delhi, India.',
    creator: '@delhibookstore_official', // Your Twitter handle
    images: ['https://www.delhibookstore.com/twitter-image-about-us.jpg'], // Custom Twitter image for About Us
  },
  alternates: {
    canonical: 'https://www.delhibookstore.com/about',
  },
};

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-700 font-sans">
      
      {/* Banner Section */}
      <div className="relative overflow-hidden rounded-xl shadow-2xl group mb-3">
        <Image
          src={banner}
          alt="Supermarket banner"
          width={1200}
          height={400}
          className="w-full h-[300px] md:h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
          <div className="text-white space-y-4 max-w-3xl">
            <h3 className="text-xl md:text-2xl font-medium tracking-wide">
              About DBS Imprints
            </h3>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Do You Want To Know Us?
            </h1>
            <p className="text-md md:text-lg font-light text-gray-200">
              Let us introduce the furnob to you briefly&#34; so you will have a
              better understanding of our quality.
            </p>
          </div>
        </div>
      </div>
      <Breadcrumbs />

      {/* Intro Section */}
      <section className="mt-16 space-y-2 text-lg leading-relaxed md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-6">
          About DBS Imprints
        </h2>
        <hr />
        <p>
         Delhi Book Store is one of the leading book store of medical and non - medical books in India. It has a wealth of books with considerable strengths in the Medical, Science & Technology, Humunities, Social Sciences, General. You name a subject we have a books... any subject. It aims to be the book store of choice for Doctors, Engineers, Technocrafts, Corporates, Scientists, Academics, Students, Scholars.
        </p>
        <p>
          The saga of DBS started in 1947, when Jeewan Kumar Ahuja, a young boy then, decided to move his family from Dera Ghazi Khan to Delhi. To support himself and his family, Jeewan starts a small business selling medical books, on foot or on a bicycle, to young medicos. Soon, the growing sales figure prompts him to think of expanding his business and he opens a small shop in the busiest by-lane in Old Delhi, in Nai Sarak.

        </p>
        <p>
         Soon, the shop becomes the Mecca for medical students, doctors, teachers and libraries of medical colleges and hospitals in India as well as neighboring countries. And, Delhi Book Store become the household name in the world of medical and non-medical books.
        </p>
        <p>
        
  The vision which was foreseen in 1947 by Jeewan Kumar Ahuja has succeeded, today the Delhi Book Store is Asia&apos;s largest showroom of medical books, with a record 99,000 titles on display. Spread over 20,000-sq ft., the five-floor showroom in Daryaganj retails books on all branches of medical science, including Nursing, Dentistry, Veterinary Science and Pharmacy. From subjects like Anaesthesia Medicine, Cardiology, Ultrasound, Surgery, obstgynae, Radiology, Orthopaedics, Oncology, Haematology, Ophthalmology, Laboratory, E.N.T, any subject into the field of medical science, the bookstore is a veritable storehouse of medical information.


        </p>
        <p>
         DBS&apos;s commitment to quality has always been core to its culture and the company is today counted as a leading name in bookstores. It has been quick to embrace modern methods of distribution, while building on its heritage and outstanding history.


        </p>
    
      </section>

      {/* Vision Section */}
      <section className="mt-6 text-center px-4 md:px-6">
        {/* <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          A Vision for a Comprehensive Publishing Experience
        </h2> */}
        <p className="text-lg text-gray-600 max-w-5xl mx-auto">
         DBS&apos;s commitment to quality has always been at the core of its culture. Today, the company is recognized as a leading name in bookstores. It has swiftly adopted modern methods of distribution while continuing to build on its rich heritage and distinguished history.


        </p>
      </section>

      {/* Image Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {[aboutimage1, aboutimage2].map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={img}
              alt={`About image ${idx + 1}`}
              width={600}
              height={400}
              className="w-full h-[250px] md:h-[300px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      {/* <section className="mt-15 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <hr />
        <p className="text-lg text-gray-600 max-w-5xl mx-auto">
          Proudly embarked on a journey of publishing that brings an increasing
          number of outstanding titles to the world every year.
        </p>
      </section> */}

      {/* Mission Details */}
      {/* <section className="mt-2 text-lg text-gray-700 leading-relaxed md:px-6">
        <p>
          We publish high-quality handbooks on all academic subjects at
          reasonable prices. Our initiative &quot;Make in India&quot; is
          reflected through our imprint &quot;DBS Imprints&quot;.
        </p>
        <p>
          Our mission envisions a new&#34; enlightened world dedicated to
          reshaping education — with a core message: &quot;Read&#34; Lead&#34;
          Succeed.&quot;
        </p>
        <p>
          Handbooks are priced affordably with a goal to bring 500 new handbooks
          to market soon.
        </p>
      </section> */}

      {/* Topics Covered */}
      {/* <section className="mt-16 flex flex-col md:flex-row gap-10 px-4 md:px-0">
        <div className="w-full md:w-1/2">
          <Image
            src={aboutimage3}
            alt="Academic Books"
            width={700}
            height={700}
            className="rounded-xl shadow-md"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-5 text-lg leading-relaxed">
          <p className="font-medium">
            Topics we cover include but are not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Agriculture</li>
            <li>Science</li>
            <li>Higher Education</li>
            <li>Hotel Management</li>
            <li>Journalism</li>
            <li>Global Warming</li>
            <li>Climate Change</li>
            <li>Agriculture Technology</li>
            <li>Chemistry&#34; Covid-19</li>
            <li>Science & Information Technology</li>
          </ul>
        </div>
      </section> */}
    </div>
  );
};

export default AboutPage;
