import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import StoreProvider from "@/store/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard - NESTRO",
  description: "Next.js Tailwind Admin Dashboard Layout",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <StoreProvider>
          <AdminLayoutWrapper>
            {children}
          </AdminLayoutWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}

