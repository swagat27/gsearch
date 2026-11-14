import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
