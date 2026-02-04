  import { Card } from "@/components/ui/card"

  type Props = {
    types: string
    html: string | null
  }

  export default function JsonTypes({ types, html }: Props) {
    return (
      <Card className="p-4 bg-zinc-50 dark:bg-zinc-950">
        {html ? (
          <div
            className="shiki-base shiki-scroll"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="shiki p-3 text-sm">{types}</pre>
        )}
      </Card>
    )
  }
