import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-zinc-950 text-white px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6 rounded-2xl border border-zinc-900 bg-zinc-900/40 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold tracking-tight text-center">Create your IntruX account</h1>
        <SignupForm />
        <p className="text-sm text-zinc-400">
          Already have an account? <a href="/login" className="underline text-white font-medium hover:text-zinc-200">Log in</a>
        </p>
      </div>
    </div>
  )
}