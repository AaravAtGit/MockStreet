import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PNLDisplayProps {
  label: string
  value: number
}

export function PNLDisplay({ label, value }: PNLDisplayProps) {
  const isPositive = value >= 0
  const valueColorClass = isPositive ? "text-green-500" : "text-red-500"

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <span className="sr-only">{isPositive ? "Profit" : "Loss"}</span>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueColorClass)}>
          {value.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
        </div>
      </CardContent>
    </Card>
  )
}
