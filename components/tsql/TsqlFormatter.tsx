"use client"

import { useMemo, useState } from "react"
import { Check, Copy } from "lucide-react"
import { formatTsql } from "@/lib/tsql"
import type { TsqlFormatOptions } from "@/lib/tsql"
import { highlightCode } from "@/lib/highlight"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import VirtualCode from "@/components/VirtualCode"
import { cn } from "@/lib/utils"

const defaultOptions: TsqlFormatOptions = {
  indentSize: 4,
  keywordCase: "upper",
  advancedAlignment: true,
  compactMode: false,
  alignEquals: true,
}

const MAX_HIGHLIGHT_SIZE = 300_000

const sampleSql = `create procedure dbo.CreateUser
(
@UserName nvarchar(100),@Email nvarchar(255),@PasswordHash nvarchar(500),@IsActive bit=1
)
as
begin
set nocount on;

-- sample declaration block
DECLARE @CreatedDate datetime = getdate(), @UserId int;

insert into dbo.Users(UserName, Email, PasswordHash, CreatedDate, IsActive)
values(@UserName, @Email, @PasswordHash, @CreatedDate, @IsActive);

select u.UserId as UserId,u.UserName as UserName,u.Email as Email
from dbo.Users u
where u.IsActive = @IsActive and (u.Email like '%@%' or u.UserName like 'admin%');
end`

export default function TsqlFormatter() {
  const [input, setInput] = useState(sampleSql)
  const [output, setOutput] = useState("")
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [wrap, setWrap] = useState(false)
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<TsqlFormatOptions>(defaultOptions)

  const isEmpty = useMemo(() => input.trim().length === 0, [input])

  const onFormat = async () => {
    try {
      const formatted = formatTsql(input, options)
      setOutput(formatted)
      setError(null)

      if (formatted.length < MAX_HIGHLIGHT_SIZE) {
        const html = await highlightCode(formatted, "sql")
        setHighlighted(html)
      } else {
        setHighlighted(null)
      }
    } catch (err) {
      setHighlighted(null)
      setError(err instanceof Error ? err.message : "Unable to format SQL")
    }
  }

  const onCopy = async () => {
    if (!output) return

    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tsql-input">Raw T-SQL Input</Label>
        <textarea
          id="tsql-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
            setOutput("")
            setHighlighted(null)
            setError(null)
            setCopied(false)
          }}
          className="min-h-[260px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
          spellCheck={false}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Indentation</Label>
          <Select
            value={String(options.indentSize)}
            onValueChange={(value) =>
              setOptions((prev) => ({ ...prev, indentSize: Number(value) as 2 | 4 }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Spaces</SelectItem>
              <SelectItem value="4">4 Spaces</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Keyword case</Label>
          <Select
            value={options.keywordCase}
            onValueChange={(value) =>
              setOptions((prev) => ({
                ...prev,
                keywordCase: value as "upper" | "lower",
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upper">UPPERCASE</SelectItem>
              <SelectItem value="lower">lowercase</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={onFormat} disabled={isEmpty}>
            Format SQL
          </Button>
          <Button variant="outline" onClick={onCopy} disabled={!output}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Output
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="advanced-alignment"
            checked={options.advancedAlignment}
            onCheckedChange={(value) =>
              setOptions((prev) => ({ ...prev, advancedAlignment: Boolean(value) }))
            }
          />
          <Label htmlFor="advanced-alignment">Advanced alignment</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="compact-mode"
            checked={options.compactMode}
            onCheckedChange={(value) =>
              setOptions((prev) => ({ ...prev, compactMode: Boolean(value) }))
            }
          />
          <Label htmlFor="compact-mode">Compact mode</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="align-equals"
            checked={options.alignEquals}
            onCheckedChange={(value) =>
              setOptions((prev) => ({ ...prev, alignEquals: Boolean(value) }))
            }
          />
          <Label htmlFor="align-equals">Align equals operator</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="wrap-lines"
            checked={wrap}
            onCheckedChange={(value) => setWrap(Boolean(value))}
          />
          <Label htmlFor="wrap-lines">Wrap output lines</Label>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {output && (
        <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
          <div className="text-sm rounded-md">
            {highlighted ? (
              <div className="max-h-[460px] overflow-auto rounded-md border border-zinc-200 dark:border-zinc-800">
                <div
                  className={cn(
                    "shiki-base shiki-lines",
                    wrap ? "shiki-wrap" : "shiki-scroll",
                  )}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              </div>
            ) : (
              <VirtualCode text={output} wrap={wrap} />
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
