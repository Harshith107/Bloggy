'use client'

import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
