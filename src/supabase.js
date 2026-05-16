import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://okditvmcqkmduvpookao.supabase.co'

const supabaseKey = 'sb_publishable_RZfTe73UUsj63vUK3LFCnA_B7HDwDuS'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)