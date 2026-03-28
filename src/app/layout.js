import { Geist_Mono, Google_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: "PlatedAI — Professional Menu Photography",
  description:
    "Generate stunning, professional menu photographs for your restaurant using AI. Upload your dishes, customize the style, and download ready-to-print images.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${googleSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#215E61",
              colorBackground: "#ffffff",
              colorInputBackground: "#f5f5f4",
              colorInputText: "#233D4D",
              colorText: "#233D4D",
              colorTextOnPrimaryBackground: "#ffffff",
              colorTextSecondary: "#5a6d72",
              colorNeutral: "#233D4D",
              colorDanger: "#D24545",
            },
            elements: {
              formButtonPrimary:
                "bg-[#215E61] hover:bg-[#233D4D] text-white border-none",
              card: "bg-white border border-stone-200 shadow-xl",
              headerTitle: "text-stone-900",
              headerSubtitle: "text-stone-600",
              socialButtonsBlockButton:
                "bg-stone-100 border border-stone-200 text-stone-900 hover:bg-stone-200",
              socialButtonsBlockButtonText: "text-stone-900",
              formFieldLabel: "text-stone-700",
              formFieldInput:
                "bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-500",
              footerActionLink: "text-[#215E61] hover:text-[#233D4D]",
              footerActionText: "text-stone-600",
              identityPreviewText: "text-stone-800",
              identityPreviewEditButton: "text-[#215E61]",
              modalBackdrop: "bg-stone-900/40 backdrop-blur-sm",
              dividerLine: "bg-stone-200",
              dividerText: "text-stone-500",
              formFieldAction: "text-[#215E61]",
              alertText: "text-stone-800",
              modalCloseButton: "text-stone-500 hover:text-stone-900",
              userButtonPopoverCard: "bg-white border border-stone-200",
              userButtonPopoverActionButton: "hover:bg-stone-100",
              userButtonPopoverActionButtonText: "text-stone-700",
              userButtonPopoverFooter: "border-t border-stone-200",
            },
          }}
        >
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
        </ClerkProvider>
      </body>
    </html>
  );
}
