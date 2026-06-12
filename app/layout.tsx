import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ProofAura - Proof-Based Internship Platform",
  description: "Build. Prove. Get Certified. Stop sending resumes. Start sharing proof.",
  icons: [{ rel: "icon", url: "/icon.svg" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
          <Toaster position="top-right" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
