'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { ProcessedArticle } from '@/lib/supabase'

const CATEGORIES = ['Të gjitha', 'Teknologji', 'Ekonomi', 'Politikë', 'Sport', 'Shëndetësi', 'Botë', 'Tjetër']

function parseKeywords(kw: string): string[] {
  if (!kw) return []
  return kw
    .split(/[,;]/)
    .map((k) => k.replace(/kw\d+:\s*/i, '').trim())
    .filter((k) => k.length > 1)
    .slice(0, 4)
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'pak minuta më parë'
  if (h === 1) return '1 orë më parë'
  if (h < 24) return `${h} orë më parë`
  const d = Math.floor(h / 24)
  return d === 1 ? 'dje' : `${d} ditë më parë`
}

function guessCategory(article: ProcessedArticle): string {
  const text = `${article.title_sq} ${article.keywords}`.toLowerCase()
  if (/tekno|ai|inteligjenc|kompjuter|softuer|iphone|android|meta|google|apple|microsoft/.test(text)) return 'Teknologji'
  if (/ekonomi|bankë|financi|treg|inflacion|gdp|eksport|import|biznes|kompani/.test(text)) return 'Ekonomi'
  if (/politik|qeveri|minister|parlamen|zgjedhje|parti|kryeministr|president/.test(text)) return 'Politikë'
  if (/sport|futboll|basketboll|tenis|gol|ndeshje|kampionat|lojtarë/.test(text)) return 'Sport'
  if (/shëndet|spital|mjek|vaksin|sëmundj|covid|kancer|farmaci/.test(text)) return 'Shëndetësi'
  if (/botë|ndërkombëtare|onu|nato|be |evropë|amerik|kinë|rusi|ukrainë/.test(text)) return 'Botë'
  return 'Tjetër'
}

type Props = {
  articles: ProcessedArticle[]
  stats: { total: number; topSources: [string, number][] }
}

export default function HomeClient({ articles, stats }: Props) {
  const [activeCategory, setActiveCategory] = useState('Të gjitha')

  const filtered = useMemo(() => {
    if (activeCategory === 'Të gjitha') return articles
    return articles.filter((a) => guessCategory(a) === activeCategory)
  }, [articles, activeCategory])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <>
      {/* Category Bar */}
      <div className="category-bar">
        <div className="container">
          <div className="category-bar-inner">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-layout">
          {/* Main content */}
          <main>
            {/* Featured */}
            {featured ? (
              <div className="featured">
                <div className="featured-label">▶ Artikulli kryesor</div>
                <Link href={`/article/${featured.id}`} className="featured-title">
                  {featured.title_sq}
                </Link>
                <p className="featured-summary">
                  {featured.summary_sq?.slice(0, 220)}
                  {(featured.summary_sq?.length || 0) > 220 ? '…' : ''}
                </p>
                <div className="featured-meta">
                  <span className="featured-source">{featured.source_name}</span>
                  <span>·</span>
                  <span>{parseKeywords(featured.keywords).join(', ')}</span>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <h3>Asnjë artikull</h3>
                <p>Nuk ka artikuj për kategorinë e zgjedhur.</p>
              </div>
            )}

            {/* Article list */}
            <div className="article-list">
              {rest.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="article-item">
                  <div className="article-item-meta">
                    <span className="article-source">{article.source_name}</span>
                    <span className="article-dot">·</span>
                    <span className="article-time">{guessCategory(article)}</span>
                  </div>
                  <div className="article-title">{article.title_sq}</div>
                  <div className="article-summary">{article.summary_sq}</div>
                  {parseKeywords(article.keywords).length > 0 && (
                    <div className="article-keywords">
                      {parseKeywords(article.keywords).map((kw, i) => (
                        <span key={i} className="keyword">{kw}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {articles.length === 0 && (
              <div className="empty-state">
                <h3>Duke ngarkuar lajmet…</h3>
                <p>Kontrollo lidhjen me Supabase.</p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">Statistikat</div>
              <div className="stat-row">
                <span className="stat-label">Gjithsej artikuj</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Burime aktive</span>
                <span className="stat-value">{stats.topSources.length}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Kategori</span>
                <span className="stat-value">{CATEGORIES.length - 1}</span>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Burimet kryesore</div>
              {stats.topSources.map(([name, count]) => (
                <div key={name} className="source-row">
                  <span className="source-row-name">{name}</span>
                  <span className="source-badge">{count}</span>
                </div>
              ))}
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Kategoritë</div>
              {CATEGORIES.filter((c) => c !== 'Të gjitha').map((cat) => (
                <div key={cat} className="source-row" style={{ cursor: 'pointer' }} onClick={() => setActiveCategory(cat)}>
                  <span className="source-row-name" style={{ color: activeCategory === cat ? 'var(--green)' : undefined }}>
                    {cat}
                  </span>
                  <span className="source-badge">
                    {articles.filter((a) => guessCategory(a) === cat).length}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
