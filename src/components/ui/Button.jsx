export default function Button({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`w-full rounded-lg bg-white py-2.5 font-semibold text-black hover:bg-zinc-200 transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}