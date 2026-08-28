import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'M3UI — Material Design 3 Expressive for React',
  description:
    'Unofficial Material Design 3 Expressive component library for React. Not affiliated with Google.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
