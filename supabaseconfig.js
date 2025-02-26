// supabaseConfig.js
import { createClient } from '@supabase/supabase-js';

// Your Supabase project URL and anon key
const supabaseUrl = 'https://quxaofzrtrccipvogbcb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eGFvZnpydHJjY2lwdm9nYmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MTA2NjEsImV4cCI6MjA1NTI4NjY2MX0.AqCnvnnfwE5uVK-6eQxOQJkYfIsyEWqHIjyFapGyRuM'

export const supabase = createClient(supabaseUrl, supabaseKey);
  