import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import { DM_Sans, Londrina_Solid } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

const londrinaSolid = Londrina_Solid({
  weight: ['100', '300', '400', '900'],
  subsets: ['latin'],
  variable: '--font-londrina-solid',
  display: 'swap',
});

const jainiPurva = localFont({
  src: '../../public/fonts/JainiPurva-Regular.ttf',
  variable: '--font-jaini-purva',
  display: 'swap',
});

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
      <body className={`${londrinaSolid.className} ${londrinaSolid.variable} ${dmSans.variable} ${jainiPurva.variable}`}>
        {/* <Navbar /> */}
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
