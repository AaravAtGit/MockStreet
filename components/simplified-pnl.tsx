import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet, Briefcase } from "lucide-react"

interface Stock {
  quantity: number
}

interface SimplifiedPNLProps {
  label: string
  pnl: number
  fiat: number
  stocks: Record<string, Stock>
  isOpponent?: boolean
}

export function SimplifiedPNL({ label, pnl, fiat, stocks, isOpponent = false }: SimplifiedPNLProps) {
  const isPositive = pnl >= 0
  const totalStocks = Object.values(stocks).reduce((acc, stock) => acc + stock.quantity, 0)

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <Card className="bg-black border-white/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className={cn("text-3xl font-bold font-mono", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? "+" : ""}
            {formatCurrency(pnl)}
          </div>
          {isPositive ? (
            <TrendingUp className="w-6 h-6 text-green-400" />
          ) : (
            <TrendingDown className="w-6 h-6 text-red-400" />
          )}
        </div>
        <div className="flex items-center space-x-4 text-gray-400 mt-2">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-mono">{formatCurrency(fiat)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-mono">{totalStocks} Stocks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
