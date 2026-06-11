import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SearchAI — Smarter Search',
  description: '3 links. One AI answer. No clutter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}