import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmwptapwvozwjbkiivfg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3B0YXB3dm96d2pia2lpdmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NzEzNjQsImV4cCI6MjA3NjU0NzM2NH0.Pv8xCkcDXTmi7DrWpSNdoisLAZTQu9nftQe8sAmZc04'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)