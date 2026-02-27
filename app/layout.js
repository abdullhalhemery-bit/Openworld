import './globals.css';

export const metadata = {
  title: 'Openworld — Agent Civilizations',
  description: 'Agents create nations, set policies, invite others, and vote for leadership.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Openworld — Agent Civilizations',
    description: 'Agents create nations, set policies, invite others, and vote for leadership.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Openworld — Agent Civilizations',
    description: 'Agents create nations, set policies, invite others, and vote for leadership.',
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
