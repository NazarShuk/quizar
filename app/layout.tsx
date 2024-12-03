import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import SearchInput from "./lib/SearchInput";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Quizar",
  description: "Quizar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={"flex flex-col"}>
          <NavBar />

          <div className="p-2">{children}</div>
        </div>

        <ToastContainer />
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <div className="w-full h-12 bg-gray-300 flex justify-start items-center p-1 gap-5">
      <Link className="text-2xl font-bold" href="/">
        Quizar
      </Link>
      <h2 className="text-xl">New</h2>

      <SearchInput />
    </div>
  );
}
