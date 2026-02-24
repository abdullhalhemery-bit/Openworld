
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Openworld - Innovative Web Platform",
  description: "Openworld is a modern web platform designed to showcase innovative features, provide easy access to information, and connect users to the project's vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <header className="bg-red-700 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Openworld Logo" className="h-8 w-8 mr-3" />
              <span className="text-2xl font-bold">Openworld</span>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#features" className="hover:text-red-200">Features</a></li>
                <li><a href="#about" className="hover:text-red-200">About</a></li>
                <li><a href="#contact" className="hover:text-red-200">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            &copy; 2026 Openworld. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
