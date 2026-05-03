import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SkillBridge — Government Placement Coordination',
  description:
    'Structured placement coordination between government institutions and industry recruiters across India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
