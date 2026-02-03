
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
type Props = {
  value: string
  onChange: (v: string) => void
  onFormat: () => void
  onMinify: () => void
  onValidate: () => void
}

export default function JsonInput({
  value,
  onChange,
  onFormat,
  onMinify,
  onValidate,
}: Props) {
  return (
    <Card className="p-4 bg-zinc-50 dark:bg-zinc-950">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste JSON here..."
        className="w-full h-64 bg-transparent font-mono text-sm resize-none focus:outline-none"
      />

      <div className="mt-4 flex gap-2">
        <Button onClick={onFormat}>Format</Button>
        <Button variant="secondary" onClick={onMinify}>
          Minify
        </Button>
        <Button variant="outline" onClick={onValidate}>
          Validate
        </Button>
      </div>
    </Card>
  )
}
