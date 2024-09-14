import localFont from "next/font/local";
import "./globals.css";
import { Lato } from "next/font/google";

// Load Lato font in the module scope
const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "FoodSense",
  description: "Your food place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lato.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
