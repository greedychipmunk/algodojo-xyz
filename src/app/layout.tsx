import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Algo Dojo — AI/ML Consulting & Automation',
    template: '%s | Algo Dojo',
  },
  description:
    'Algo Dojo helps businesses optimize workflows with agentic AI, machine learning, and automation. Free tutorials and expert consulting.',
  metadataBase: new URL('https://algodojo.xyz'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Algo Dojo',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
