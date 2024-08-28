"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SavingsExpensesTracker from '@/components/SavingsExpensesTracker'
import Auth from '@/components/Auth'
import { Session } from '@supabase/supabase-js'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (!session) {
        router.push('/')
      }
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (!session) {
    return <Auth />
  }
  
  return <SavingsExpensesTracker />
}