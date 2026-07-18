import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-zinc-950 text-white px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6 rounded-2xl border border-zinc-900 bg-zinc-900/40 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold tracking-tight">Log in to IntruX</h1>
        <LoginForm />
        <p className="text-sm text-zinc-400">
          No account? <a href="/signup" className="underline text-white font-medium hover:text-zinc-200">Sign up</a>
        </p>
      </div>
    </div>
  )
}