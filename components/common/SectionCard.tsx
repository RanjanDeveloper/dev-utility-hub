import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SectionCard = ({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) => (
  <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
    <CardHeader className="gap-1">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
)

export default SectionCard
