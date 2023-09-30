import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmihcimimkunstklrlny.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1taWhjaW1pbWt1bnN0a2xybG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4NzA3NTEsImV4cCI6MjAxMTQ0Njc1MX0.uNcPjnsLI9YDgIMMniFbWc3Lou-fm0bMLOyOdwAkuAc'

const supabase = createClient(supabaseUrl,supabaseKey)

export async function getTokenByMobileId(val){
    const res = await supabase
        .from('tokens')
        .select('*')
        .eq('id', val)
    return res
}