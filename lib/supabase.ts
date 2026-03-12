import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ProcessedArticle = {
  id: number
  raw_article_id: number
  title_sq: string
  summary_sq: string
  keywords: string
  source_name: string
  created_at?: string
}

export type RawArticle = {
  id: number
  url?: string
  published_at?: string
  category?: string
}
