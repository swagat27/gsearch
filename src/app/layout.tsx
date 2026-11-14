import type { Metadata } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'GSearch: Unified CAD Model Search',
  description:
    'GSearch is a unified CAD model search dashboard that deep links one query into 9 platforms: GrabCAD, Thingiverse, Printables, MyMiniFactory, Sketchfab, TraceParts, Cults3D, CGTrader and Free3D. Built by Swagat Baghel, IIT BHILAI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${monoFont.variable}`}>{children}</body>
    </html>
  );
}
