export function ValidationError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 p-4 bg-destructive/8 border border-destructive/25 rounded-xl text-sm text-destructive">
      <span className="mt-0.5 flex-shrink-0">⚠</span>
      <span>{message}</span>
    </div>
  )
}
