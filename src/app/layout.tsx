import type { Metadata } from "next";
import "./globals.css";
import { layoutMetadata, jsonLd } from "@/lib/utils/seo";
import Provider from "@/components/provider";
import { geistSans } from "@/lib/fonts";

export const metadata: Metadata = layoutMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <we are safe>
          dangerouslySetInnerHTML={jsonLd}
        />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
