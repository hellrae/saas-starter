import { Metadata } from "next";

export const appSeo = {
  name: "Your App Name",
  title: "Your App Name – Your Tagline or Event Title",
  description:
    "A short, clear description of what your project or event is about. Keep it under 160 characters for best SEO performance.",
  url: "https://yourdomain.com",
  keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Team or Name",
  themeColor: "#ffffff",
  twitter: {
    card: "summary_large_image",
    site: "@yourhandle",
    creator: "@yourhandle",
    title: "Your App or Event Title",
    description:
      "A short summary of what users can expect from your project or event.",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        alt: "Your App or Event – Open Graph Image Alt Text",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Your App Name",
    title: "Your App Name – Your Tagline or Event Title",
    description:
      "A global project, event, or product celebrating creativity, community, or innovation.",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Your App or Event Open Graph Image",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const layoutMetadata: Metadata = {
  metadataBase: new URL(appSeo.url),
  title: {
    default: appSeo.title,
    template: `%s | ${appSeo.name}`,
  },
  description: appSeo.description,
  applicationName: appSeo.name,
  authors: appSeo.authors,
  keywords: appSeo.keywords,
  creator: appSeo.creator,
  publisher: appSeo.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: appSeo.icons,
  manifest: appSeo.manifest,
  openGraph: {
    ...appSeo.openGraph,
    locale: "en_US",
    type: "website",
  },
  twitter: appSeo.twitter,
  alternates: {
    canonical: appSeo.url,
  },
};

export const jsonLd = {
  __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: appSeo.name,
    url: appSeo.url,
    description: appSeo.description,
    publisher: {
      "@type": "Organization",
      name: appSeo.name,
      logo: {
        "@type": "ImageObject",
        url: `${appSeo.url}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${appSeo.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }),
};
