import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://gongca.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GongCa 💳 (직장인 점메추)",
  description: "공무원/국회의원 법카 데이터 기반 식당 아카이브",
  openGraph: {
    title: "GongCa 💳 (직장인 점메추)",
    description: "공무원/국회의원 법카 데이터 기반 식당 아카이브",
    url: SITE_URL,
    siteName: "공무원 법카 맛집",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GongCa 💳 (직장인 점메추)",
    description: "공무원/국회의원 법카 데이터 기반 식당 아카이브",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="min-h-full overflow-hidden">{children}</body>
    </html>
  );
}
