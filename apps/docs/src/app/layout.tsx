import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { AppProviders } from '@/components/providers';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'M3UI — Material Design 3 Expressive for React',
    template: '%s · M3UI',
  },
  description:
    'Unofficial Material Design 3 Expressive component library for React. Not affiliated with Google.',
  metadataBase: new URL('https://m3ui.dev'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
