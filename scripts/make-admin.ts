import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ntwfotaplbaegbxyfikb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50d2ZvdGFwbGJhZWdieHlmaWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM0ODk5MiwiZXhwIjoyMDkyOTI0OTkyfQ.GHGC6QzQOp02WxamIQ4gMCyVaYYeoYnUEAInSgLiWNk'
)

const email = process.argv[2]
if (!email) { console.error('Usage: npx tsx scripts/make-admin.ts your@email.com'); process.exit(1) }

async function run() {
  // Find user by email
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) { console.error(error); process.exit(1) }

  const user = users.find(u => u.email === email)
  if (!user) {
    console.error(`No user found with email: ${email}`)
    console.log('Make sure you have registered first at /konto/registrera')
    process.exit(1)
  }

  // Upsert into customers as admin
  const { error: upsertErr } = await supabase.from('customers').upsert({
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name ?? null,
    is_admin: true,
  })

  if (upsertErr) { console.error(upsertErr); process.exit(1) }
  console.log(`✓ ${email} is now an admin`)
}

run()
