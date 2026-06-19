import './globals.css'

export const metadata = {
  title: 'Matchcard — Marketplace Automation & AI Tools',
  description: 'A suite of intelligent tools to streamline your marketplace operations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg text-tx min-h-screen">{children}</body>
    </html>
  )
}
