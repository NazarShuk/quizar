import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import SearchInput from "@/lib/SearchInput";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className={"flex flex-col items-center"}>
            <NavBar />

            <div className="p-2 lg:w-1/2">{children}</div>
          </div>

          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
}

export function NavBar() {
  return (
    <div className="w-full h-12 bg-gray-100 flex justify-between items-center p-2.5">
      <div className="h-full flex justify-start items-center gap-5">
        <Link className="text-2xl font-bold" href="/">
          Quizar
        </Link>
        <Link className="text-xl" href={"/new"}>
          New
        </Link>

        <SearchInput />
      </div>

      <div className="flex items-center">
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
}
