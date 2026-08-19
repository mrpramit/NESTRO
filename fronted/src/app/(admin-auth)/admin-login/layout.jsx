import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Login — NESTRO",
  description: "Secure admin portal login for NESTRO",
};

export default function AdminAuthLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
