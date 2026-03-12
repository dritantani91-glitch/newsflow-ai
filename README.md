# NewsFlow AI

Website lajmesh i ndërtuar me Next.js 14, Supabase dhe Groq.

## Setup

### 1. Instalo dependencies

```bash
npm install
```

### 2. Konfiguro .env.local

Hap `.env.local` dhe vendos:

```
NEXT_PUBLIC_SUPABASE_URL=https://xsfzwelnazyhnqzboqxl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Anon key e gjen te: Supabase Dashboard → Settings → API → `anon public`

### 3. Supabase RLS (e rëndësishme!)

Në Supabase Dashboard → Table Editor → `processed_articles`:
- Kliko **"Enable RLS"** ose
- Shko te SQL Editor dhe ekzekuto:

```sql
-- Lejo lexim publik
CREATE POLICY "Allow public read" ON processed_articles
  FOR SELECT USING (true);

-- Po kështu për raw_articles nëse duhet
CREATE POLICY "Allow public read" ON raw_articles
  FOR SELECT USING (true);
```

### 4. Nise lokalisht

```bash
npm run dev
```

Hap: http://localhost:3000

## Deploy në Vercel

```bash
npm install -g vercel
vercel
```

Gjatë deploy, Vercel do të pyes për variablat e mjedisit. Shto:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Ose shko te Vercel Dashboard → Project → Settings → Environment Variables.

## Struktura

```
app/
  page.tsx              # Kryefaqja
  layout.tsx            # Navbar + Footer
  article/[id]/page.tsx # Faqja e artikullit
  globals.css           # Stilet
components/
  HomeClient.tsx        # UI interaktive (filtrim kategorish)
lib/
  supabase.ts           # Klienti i Supabase + tipi i të dhënave
```

## Si funksionon

1. n8n mbledh artikuj → ruan në `raw_articles`
2. Groq i përpunon → ruan titull + summary shqip në `processed_articles`
3. Next.js i lexon nga Supabase dhe i shfaq
4. ISR (revalidate: 60s) — faqja rifresohet automatikisht çdo minutë
