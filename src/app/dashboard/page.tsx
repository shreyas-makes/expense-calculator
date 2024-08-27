"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import SavingsExpensesTracker from '@/components/SavingsExpensesTracker'
import { Session } from '@supabase/supabase-js'

const supabase = createClientComponentClient()

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (!session) {
        redirect('/')
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        redirect('/')
      }
    })

    checkSession()

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return null // or a loading indicator
  }

  return <SavingsExpensesTracker />
}