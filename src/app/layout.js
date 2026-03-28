import { Geist_Mono, Google_Sans } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Toaster } from "sonner";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PlatedAI - Professional Menu Photography",
  description:
    "Generate stunning, professional menu photographs for your restaurant using AI. Upload your dishes, customize the style, and download ready-to-print images.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${googleSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ConvexClientProvider>
          {children}
          <Toaster
            theme="light"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#ffffff",
                border: "1px solid #e7e5e4",
                color: "#1c1917",
              },
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
