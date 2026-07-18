export default function Input({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-zinc-300">
      {label}
      <input
        {...props}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
      />
    </label>
  )
}