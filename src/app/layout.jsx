import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Process Automation - SUC",
  description: "Created by Size Up Consulting",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link
  rel="stylesheet"
  href="https://unicons.iconscout.com/release/v4.0.0/css/unicons.css"
/></head>
      <body className={inter.className}>{children} </body>
    </html>
  );
}
