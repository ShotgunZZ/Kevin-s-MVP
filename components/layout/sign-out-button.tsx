'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-accent transition-colors disabled:opacity-50"
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
