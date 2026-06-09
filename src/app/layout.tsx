import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'SearchAI — Smarter Search', description: 'Search the web and get instant AI answers' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}