import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'NewsFlow AI — Lajmet shqip të kuratuar nga AI',
  description: 'Lajme të grumbulluara automatikisht nga burime të besueshme, të përpunuar me AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <body>
        <header className="navbar">
          <Link href="/" className="navbar-logo">
            News<span>Flow</span> AI
          </Link>
          <nav>
            <ul className="navbar-nav">
              <li><Link href="/">Kryefaqja</Link></li>
              <li><Link href="/?category=Teknologji">Teknologji</Link></li>
              <li><Link href="/?category=Ekonomi">Ekonomi</Link></li>
              <li><Link href="/?category=Politikë">Politikë</Link></li>
              <li><Link href="/?category=Sport">Sport</Link></li>
              <li><Link href="/?category=Botë">Botë</Link></li>
            </ul>
          </nav>
        </header>

        {children}

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">News<span>Flow</span> AI</div>
            <p className="footer-text">
              Lajme të kuratuar nga AI · Powered by Groq + Supabase
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
