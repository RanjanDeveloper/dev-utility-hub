"use client"

import { useMemo, useState } from "react"
import { formatTsql } from "@/lib/tsql"
import type { TsqlFormatOptions } from "@/lib/tsql"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const defaultOptions: TsqlFormatOptions = {
  indentSize: 4,
  keywordCase: "upper",
  advancedAlignment: true,
  compactMode: false,
  alignEquals: true,
}

const sampleSql = `create procedure dbo.usp_sync_orders(@companyId int=1,@updatedAfter datetime2=null,@isDryRun bit=0)
as
begin
-- cache settings
DECLARE @Now datetime2 = getdate(), @Rows int=0;
insert into dbo.audit_log(company_id, run_at, is_dry_run) values (@companyId, @Now, @isDryRun);
select o.order_id as id,o.total_amount as amount,c.customer_name as customer
from dbo.orders o inner join dbo.customers c on o.customer_id=c.customer_id
where o.company_id=@companyId and (@updatedAfter is null or o.updated_at>=@updatedAfter);
end`

export default function TsqlFormatter() {
  const [input, setInput] = useState(sampleSql)
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<TsqlFormatOptions>(defaultOptions)

  const isEmpty = useMemo(() => input.trim().length === 0, [input])

  const onFormat = () => {
    try {
      const formatted = formatTsql(input, options)
      setOutput(formatted)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to format SQL")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tsql-input">Raw T-SQL</Label>
          <textarea
            id="tsql-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-[260px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tsql-output">Formatted Output</Label>
          <textarea
            id="tsql-output"
            value={output}
            readOnly
            className="min-h-[260px] w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Indentation</Label>
          <Select
            value={String(options.indentSize)}
            onValueChange={(value) => setOptions((prev) => ({ ...prev, indentSize: Number(value) as 2 | 4 }))}
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
            onValueChange={(value) => setOptions((prev) => ({ ...prev, keywordCase: value as "upper" | "lower" }))}
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
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(output)
            }}
            disabled={!output}
          >
            Copy Output
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="advanced-alignment"
            checked={options.advancedAlignment}
            onCheckedChange={(value) => setOptions((prev) => ({ ...prev, advancedAlignment: Boolean(value) }))}
          />
          <Label htmlFor="advanced-alignment">Advanced alignment</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="compact-mode"
            checked={options.compactMode}
            onCheckedChange={(value) => setOptions((prev) => ({ ...prev, compactMode: Boolean(value) }))}
          />
          <Label htmlFor="compact-mode">Compact mode</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="align-equals"
            checked={options.alignEquals}
            onCheckedChange={(value) => setOptions((prev) => ({ ...prev, alignEquals: Boolean(value) }))}
          />
          <Label htmlFor="align-equals">Align equals operator</Label>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
