// app/pages/signup/page.js
export const metadata = {
  title: "Create Your Account | DelhiBookStore",
  description:
    "Sign up for a DelhiBookStore account to personalize your experience, track orders, and manage your luxury book collection.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Create Your Account | DelhiBookStore",
    description: "Sign up for DelhiBookStore.",
    url: "https://www.delhibookstore.com/pages/signup",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Create Your Account | DelhiBookStore",
    description: "Sign up for DelhiBookStore.",
  },
};

export default function SignUpPage() {
  return <div>{/* Your signup form JSX here */}</div>;
}
