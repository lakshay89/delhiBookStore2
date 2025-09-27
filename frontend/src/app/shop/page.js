import Shop from "@/components/Shop/Shop";
import React, { Suspense } from "react";


export const metadata = {
  title: 'Shop All Luxury & Rare Books | Complete Collection - DelhiBookStore', // Comprehensive and high-level
  description: 'Explore DelhiBookStore\'s complete collection of luxury, premium, and rare books. Discover thousands of unique editions, from timeless classics to modern masterpieces, available for collectors worldwide.',
  keywords: [
    'shop luxury books',
    'buy rare books online',
    'premium books for sale',
    'DelhiBookStore all books',
    'online bookstore luxury editions',
    'collectible books shop',
    'fine binding books online',
    'international book collection',
    'best luxury books',
    'rare literary finds',
    'unique books online',
    'curated book shop',
    'exclusive book titles',
    'signed books shop',
    'first edition books online',
    'vintage books for sale',
    'delhi online book store',
    'boutique books international',
    'high-end books online',
    'art books for collectors',
    'photography books shop',
    'design books buy',
    'fashion books online',
    'limited edition books online',
    'ancient books for sale',
    'modern literary classics',
    'bibliophile\'s paradise',
    'masterpiece books',
    'global rare books',
    'premium hardcover books',
    'curated selection of books',
    'books for discerning readers',
    'exclusive book market',
    'investment books online',
    'heritage books online',
    'historical books buy',
    'travel books luxury',
    'cookbooks premium',
    'children\'s luxury books',
  ], // 30+ keywords
  openGraph: {
    title: 'Shop All Luxury & Rare Books | Complete Collection - DelhiBookStore',
    description: 'Explore DelhiBookStore\'s complete collection of luxury, premium, and rare books. Discover thousands of unique editions, from timeless classics to modern masterpieces, available for collectors worldwide.',
    url: 'https://www.delhibookstore.com/pages/shop', // **IMPORTANT: Your actual Main Shop page URL**
    siteName: 'DelhiBookStore',
    images: [
      {
        url: 'https://www.delhibookstore.com/og-image-shop-all.jpg', // **Custom OG image for Shop All**
        width: 1200,
        height: 630,
        alt: 'DelhiBookStore Complete Luxury & Rare Book Collection',
      },
    ],
    locale: 'en_US',
    type: 'website', // or 'CollectionPage'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Luxury & Rare Books | Complete Collection - DelhiBookStore',
    description: 'Explore DelhiBookStore\'s complete collection of luxury, premium, and rare books. Discover thousands of unique editions, from timeless classics to modern masterpieces, available for collectors worldwide.',
    creator: '@delhibookstore_official', // Your Twitter handle
    images: ['https://www.delhibookstore.com/twitter-image-shop-all.jpg'], // Custom Twitter image
  },
  alternates: {
    canonical: 'https://www.delhibookstore.com/pages/shop', // Crucial for filtering/sorting
  },
};
const page = () => {
  return (
    <>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Shop />
        </Suspense>
      </div>
    </>
  );
};

export default page;
