import Link from 'next/link'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <aside className="w-64 border-r border-zinc-900 bg-zinc-900/20 p-6 flex flex-col gap-4">
        <div className="text-xl font-bold tracking-tight text-white">IntruX Panel</div>
        <nav className="flex flex-col gap-2 mt-4 text-sm text-zinc-400">
          <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-zinc-900/50 cursor-pointer">
            Dashboard
          </Link>
          <Link href="/dashboard/cameras" className="px-3 py-2 rounded-lg hover:bg-zinc-900/50 cursor-pointer">
            Cameras
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}