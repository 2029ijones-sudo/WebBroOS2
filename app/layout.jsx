import './globals.css'
import { Inter } from 'next/font/google'
import { QuantumSecurityProvider } from '@/app/kernel/security'
import { SystemMonitor } from '@/app/kernel/core'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WebBroOS2 - Most Advanced Browser OS',
  description: 'Quantum-resistant browser operating system with Supabase integration',
  generator: 'WebBroOS2 Kernel v2.0',
  keywords: ['operating-system', 'browser-os', 'quantum', 'security', 'supabase'],
  authors: [{ name: 'WebBroOS2 Team' }],
  creator: 'WebBroOS2 Development',
  publisher: 'WebBroOS2',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://webbroos2.vercel.app'),
  openGraph: {
    title: 'WebBroOS2',
    description: 'The most advanced browser OS emulation system',
    url: 'https://webbroos2.vercel.app',
    siteName: 'WebBroOS2',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'WebBroOS2',
    card: 'summary_large_image',
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-gray-100 antialiased`} suppressHydrationWarning>
        <QuantumSecurityProvider>
          <SystemMonitor>
            <div id="os-root" className="relative min-h-screen overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
              <div className="relative z-10">
                {children}
              </div>
            </div>
            <div id="system-alerts" className="fixed bottom-4 right-4 z-50" />
            <div id="kernel-terminal" className="hidden" />
          </SystemMonitor>
        </QuantumSecurityProvider>
      </body>
    </html>
  )
}
