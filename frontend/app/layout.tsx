import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { ChainContextProvider } from "./context/ChainContextProvider";
import { SelectedWalletAccountContextProvider } from "./context/SelectedWalletAccountContextProvider";
import { RpcContextProvider } from "./context/RpcContextProvider";
import { Nav } from "./components/Nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChainContextProvider>
            <SelectedWalletAccountContextProvider>
              <RpcContextProvider>
                <Nav />
                {children}
              </RpcContextProvider>
            </SelectedWalletAccountContextProvider>
          </ChainContextProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
