'use client'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm animate-pulse">Verifying Session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-zinc-400">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          <Button onClick={signOut} className="max-w-[120px] bg-red-600 hover:bg-red-550 text-white">
            Log Out
          </Button>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-8 text-center text-zinc-500">
          Camera Management Panel coming up next!
        </div>
      </div>
    </div>
  )
}