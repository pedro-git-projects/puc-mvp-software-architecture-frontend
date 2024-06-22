import "@/styles/tailwind.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Layout } from "@/components/ui/Layout";
import { Providers } from "@/app/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s Songboxd",
    default: "Songboxd",
  },
  description:
    "O Songboxd é uma rede social para compartilhar seu gosto musical. Use como um diário para registrar sua opinião sobre os músicas conforme você as escuta, ou apenas para registrar os artistas e álbums que você ouviu no passado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="h-full antialiased" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
