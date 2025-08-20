import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Target, TrendingUp, TrendingDown } from "lucide-react"

interface Order {
  id: string
  symbol: string
  type: "LONG" | "SHORT"
  quantity: number
  price: number
  status: "FILLED" | "PENDING" | "CANCELLED"
  time: string
  pnl?: number
  powerUp?: string
}

const battleOrders: Order[] = [
  {
    id: "BTL001",
    symbol: "NIFTY",
    type: "LONG",
    quantity: 50,
    price: 19500.0,
    status: "FILLED",
    time: "10:02 AM",
    pnl: 1250,
    powerUp: "2x",
  },
  {
    id: "BTL002",
    symbol: "NIFTY",
    type: "SHORT",
    quantity: 25,
    price: 19520.5,
    status: "FILLED",
    time: "10:15 AM",
    pnl: -500,
  },
  {
    id: "BTL003",
    symbol: "NIFTY",
    type: "LONG",
    quantity: 100,
    price: 19490.0,
    status: "PENDING",
    time: "10:30 AM",
    powerUp: "shield",
  },
  { id: "BTL004", symbol: "NIFTY", type: "SHORT", quantity: 75, price: 19550.0, status: "CANCELLED", time: "10:45 AM" },
]

export function BattleOrderHistory() {
  return (
    <Card className="bg-black border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-orange-400" />
          <span>Battle History</span>
          <Badge variant="outline" className="text-orange-400 border-orange-400/30">
            {battleOrders.length} ORDERS
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/20">
              <TableHead className="text-gray-300">Battle ID</TableHead>
              <TableHead className="text-gray-300">Symbol</TableHead>
              <TableHead className="text-gray-300">Action</TableHead>
              <TableHead className="text-gray-300">Size</TableHead>
              <TableHead className="text-gray-300">Strike</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">P&L</TableHead>
              <TableHead className="text-gray-300">Power-Up</TableHead>
              <TableHead className="text-gray-300">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {battleOrders.map((order) => (
              <TableRow key={order.id} className="border-white/10">
                <TableCell className="font-mono text-white">{order.id}</TableCell>
                <TableCell className="text-white font-semibold">{order.symbol}</TableCell>
                <TableCell>
                  <div
                    className={`flex items-center space-x-1 ${
                      order.type === "LONG" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {order.type === "LONG" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="font-bold">{order.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white font-mono">{order.quantity}</TableCell>
                <TableCell className="text-white font-mono">{order.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "FILLED" ? "default" : order.status === "PENDING" ? "secondary" : "destructive"
                    }
                    className={
                      order.status === "FILLED"
                        ? "bg-green-900 text-green-300 border-green-500/30"
                        : order.status === "PENDING"
                          ? "bg-yellow-900 text-yellow-300 border-yellow-500/30"
                          : "bg-red-900 text-red-300 border-red-500/30"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.pnl !== undefined ? (
                    <span className={`font-mono font-bold ${order.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {order.pnl >= 0 ? "+" : ""}
                      {order.pnl.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {order.powerUp ? (
                    <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                      {order.powerUp === "2x" && <Zap className="w-3 h-3 mr-1" />}
                      {order.powerUp === "shield" && <Shield className="w-3 h-3 mr-1" />}
                      {order.powerUp}
                    </Badge>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-300 font-mono">{order.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
