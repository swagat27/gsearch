import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GSearch — Unified CAD Model Search Engine',
  description: 'Search 9 CAD platforms simultaneously — GrabCAD, Thingiverse, Sketchfab, and more.',
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
