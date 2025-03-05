import { createClient } from '@supabase/supabase-js';

// استبدل القيم التالية بـ Supabase URL و Public Key الخاصين بمشروعك
const supabaseUrl = 'https://fpityklwjuuqfyklvhpu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaXR5a2x3anV1cWZ5a2x2aHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMjEwOTYsImV4cCI6MjA1NjY5NzA5Nn0.OzVDaTc_xGBxg3yI0-C68QX3IGSjfDdxYtJaXcGYyMs';

export const supabase = createClient(supabaseUrl, supabaseKey);