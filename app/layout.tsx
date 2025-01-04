import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AppSidebar } from '../components/app-sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Todoist Clone',
  description: 'A web-based clone of the Todoist application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

