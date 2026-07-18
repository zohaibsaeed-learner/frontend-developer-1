'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/auth'
import { useStore } from '@/store/useStore'

export function useAuth({ redirectIfUnauthenticated = true } = {}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { setUser, setProfile, reset, user, profile } = useStore()

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        if (mounted) {
          reset()
          setLoading(false)
          if (redirectIfUnauthenticated) router.replace('/login')
        }
        return
      }

      setUser(session.user)
      try {
        const profileData = await getProfile(session.user.id)
        if (mounted) {
          setProfile(profileData)
          setLoading(false)
        }
      } catch (err) {
        console.error("Error loading profile:", err)
        if (mounted) setLoading(false)
      }
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        reset()
        if (redirectIfUnauthenticated) router.replace('/login')
      } else {
        setUser(session.user)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, profile, loading }
}