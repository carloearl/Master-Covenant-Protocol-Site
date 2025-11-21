import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kygisdokikvzgzwonzxk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5Z2lzZG9raWt2emd6d29uenhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDU2MTIsImV4cCI6MjA3OTMyMTYxMn0.W9bN3UvoWWvkUridK71JVGsvB7f8gPhDv5OyGiEiIIs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;