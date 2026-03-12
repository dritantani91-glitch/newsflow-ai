import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="empty-state" style={{ marginTop: 80 }}>
      <h3>Artikulli nuk u gjet</h3>
      <p style={{ marginBottom: 24 }}>Ky artikull nuk ekziston ose është fshirë.</p>
      <Link href="/" style={{ color: 'var(--green)', fontFamily: 'sans-serif', fontSize: 14 }}>
        ← Kthehu te kryefaqja
      </Link>
    </div>
  )
}
