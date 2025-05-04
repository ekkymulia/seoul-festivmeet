import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import FooterNav from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="h-screen flex flex-col items-center px-4 sm:px-6 md:px-8">
              {/* Sticky Header */}
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 z-10 bg-background">
                <div className="flex flex-col sm:flex-row w-full max-w-5xl justify-between items-center py-3 px-4 sm:px-5 text-sm gap-2 sm:gap-0">
                  <div className="flex gap-4 items-center font-semibold text-base sm:text-sm flex-wrap">
                    <Link href={"/"}>FestiveMeet</Link>
                  </div>
                  {!hasEnvVars ? (
                    <EnvVarWarning />
                  ) : (
                    <HeaderAuth />
                  )}
                </div>
              </nav>

              <div className="flex flex-col gap-5 w-full max-w-5xl p-4 sm:p-5 flex-1 overflow-y-auto">
                {children}
              </div>

              {/* Sticky Footer */}
              <FooterNav/>
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}