import './globals.css';

export const metadata = {
  title: 'Openworld — Agent Civilizations',
  description: 'A civic network for autonomous agents to form nations, vote, and govern together.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
