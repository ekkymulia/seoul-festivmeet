import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist, Gowun_Batang, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import FooterNav from "@/components/footer";
import Image from "next/image";

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

const gowunBatang = Gowun_Batang({
  weight: ['400', '700'], // Specify the weights you need
  subsets: ['latin'], // Or other subsets if required
  variable: '--font-gowun-batang', // Optional: CSS variable name
  display: 'swap', // Recommended for performance
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Optional: CSS variable name
  display: 'swap',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gowunBatang.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="h-screen flex flex-col items-center">
              {/* Sticky Header */}
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 z-10 bg-[#23532A]">
                <div className="flex flex-col sm:flex-row w-full max-w-5xl justify-between items-center py-3 px-4 sm:px-5 text-sm gap-2 sm:gap-0">
                  <div className="flex gap-4 items-center font-semibold text-base sm:text-sm flex-wrap">
                    <Link href={"/"}>
                    <Image
                      src="/images/eatseason_white_horizontal_logo.png" // Path should be relative to the public directory
                      alt="EatSeason Logo" // Always add descriptive alt text for accessibility
                      width={100} // Specify the width of the image
                      height={50} // Specify the height of the image
                      // You might also consider adding 'priority' if this is an important LCP image
                      // priority
                    />
                    </Link>
                  </div>
             
                    <HeaderAuth />
                </div>
              </nav>

              <div className="w-full flex-1 overflow-none">
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