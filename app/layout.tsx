import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <div className="w-full h-12 bg-gray-300 flex justify-start items-center p-1 gap-5">
      <a className="text-2xl font-bold" href="/">
        Quizar
      </a>
      <h2 className="text-xl">New</h2>
      <form action={"/search"}>
        <input type="text" name="query" placeholder="Search..." />
      </form>
    </div>
  );
}
