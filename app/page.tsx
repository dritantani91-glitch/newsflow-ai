import { supabase, type ProcessedArticle } from '@/lib/supabase'
import HomeClient from '@/components/HomeClient'

export const revalidate = 60

async function getArticles(): Promise<ProcessedArticle[]> {
  const { data, error } = await supabase
    .from('processed_articles')
    .select('*')
    .order('id', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Supabase error:', error)
    return []
  }

  // Filtro duplikatët sipas title_sq
  const seen = new Set<string>()
  const unique = (data || []).filter((article) => {
    const key = article.title_sq?.toLowerCase().trim() || ''
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return unique
}

async function getStats() {
  const { count: total } = await supabase
    .from('processed_articles')
    .select('*', { count: 'exact', head: true })

  const { data: sources } = await supabase
    .from('processed_articles')
    .select('source_name')

  const sourceCounts: Record<string, number> = {}
  sources?.forEach((r) => {
    const s = r.source_name || 'Tjetër'
    sourceCounts[s] = (sourceCounts[s] || 0) + 1
  })

  const topSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return { total: total || 0, topSources }
}

export default async function HomePage() {
  const [articles, stats] = await Promise.all([getArticles(), getStats()])
  return <HomeClient articles={articles} stats={stats} />
}