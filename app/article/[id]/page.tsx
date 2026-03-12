import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

type Props = { params: { id: string } }

async function getArticle(id: string) {
  const { data, error } = await supabase
    .from('processed_articles')
    .select('*, raw_articles(*)')
    .eq('id', parseInt(id))
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.id)
  return {
    title: article?.title_sq ?? 'Artikull — NewsFlow AI',
    description: article?.summary_sq?.slice(0, 160) ?? '',
  }
}

function parseKeywords(kw: string): string[] {
  if (!kw) return []
  return kw
    .split(/[,;]/)
    .map((k) => k.replace(/kw\d+:\s*/i, '').trim())
    .filter((k) => k.length > 1)
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.id)
  if (!article) notFound()

  const rawArticle = (article as any).raw_articles
  const keywords = parseKeywords(article.keywords)
  const originalUrl = rawArticle?.url

  return (
    <div className="article-page">
      <Link href="/" className="back-link">
        ← Kthehu te lajmet
      </Link>

      <div className="article-page-source">{article.source_name}</div>

      <h1 className="article-page-title">{article.title_sq}</h1>

      <blockquote className="article-page-summary">
        {article.summary_sq}
      </blockquote>

      {keywords.length > 0 && (
        <div className="article-page-keywords">
          {keywords.map((kw, i) => (
            <span key={i} className="keyword">{kw}</span>
          ))}
        </div>
      )}

      {originalUrl && (
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="article-page-link"
        >
          Lexo artikullin origjinal →
        </a>
      )}

      {!originalUrl && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>
          Burimi origjinal: <strong>{article.source_name}</strong>
        </p>
      )}
    </div>
  )
}
