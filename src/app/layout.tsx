import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import { Londrina_Solid, Akshar, Inter } from 'next/font/google';
//import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';

const londrinaSolid = Londrina_Solid({
  subsets: ['latin'],
  weight: ["100", "300", "400", "900"],
});

const akshar = Akshar({
  subsets: ['latin'],
  variable: '--font-akshar',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// const jainiPurva = localFont({
//   src: '../../public/fonts/JainiPurva-Regular.ttf',
//   variable: '--font-jaini-purva',
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: 'DiamondHacks 2026',
  description: "ACM at UCSD's annual hackathon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#151625" />
      </head>
      <body className={`${londrinaSolid.className} ${akshar.variable} ${inter.variable}`}>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
