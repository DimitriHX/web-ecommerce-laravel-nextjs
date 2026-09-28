import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { CartProvider } from "@/lib/cart-context";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tienda E-Commerce",
  description: "Plataforma de E-commerce moderna construida con Next.js y Laravel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar user={user} />
          <main style={{ minHeight: "calc(100vh - 75px)", paddingBottom: "3rem" }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
