import { Card } from "@/components/ui/card"

export default function HashSkeleton() {
  return (
    <Card className="p-5 bg-white border w-full border-zinc-200 shadow-md space-y-3 animate-pulse h-50">
      <div className="flex justify-between">
        <div className="h-6 w-24 bg-zinc-200 rounded-full" />
        <div className="h-8 w-8 bg-zinc-200 rounded" />
      </div>
      <div className="h-24 bg-zinc-100 rounded" />
    </Card>
  )
}
