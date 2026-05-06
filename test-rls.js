const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lacvsoqzivufinhspuzh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY3Zzb3F6aXZ1ZmluaHNwdXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDA0MjYsImV4cCI6MjA5Mjg3NjQyNn0.9MT0UF-JPFGP0E7E5NxpgFlaBWTvhc2NU9jkLaPTIqQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log("Testing query on profiles...");
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error("Error on profiles:", error.message);
  } else {
    console.log("Profiles queried successfully:", data);
  }

  console.log("Testing query on applications...");
  const { data: appData, error: appError } = await supabase.from('applications').select('*').limit(1);
  if (appError) {
    console.error("Error on applications:", appError.message);
  } else {
    console.log("Applications queried successfully:", appData);
  }
}

testQuery();
