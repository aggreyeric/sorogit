import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { WalletProvider } from "@/app/_fns/walletcontext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sorogit",
  description: "Sorogit is a platform for developers to earn crypto. by contributing to open source projects.",
};

export default function RootLayout({ children }) {
  return (
    <WalletProvider>
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        
        {children}
      

        </body>
    </html>
    </WalletProvider>
  );
}
