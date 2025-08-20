import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Order {
  id: string
  symbol: string
  type: "Buy" | "Sell"
  quantity: number
  price: number
  status: "Filled" | "Pending" | "Cancelled"
  time: string
}

const dummyOrders: Order[] = [
  { id: "ORD001", symbol: "NIFTY", type: "Buy", quantity: 50, price: 19500.0, status: "Filled", time: "10:02 AM" },
  { id: "ORD002", symbol: "NIFTY", type: "Sell", quantity: 25, price: 19520.5, status: "Filled", time: "10:15 AM" },
  { id: "ORD003", symbol: "NIFTY", type: "Buy", quantity: 100, price: 19490.0, status: "Pending", time: "10:30 AM" },
  { id: "ORD004", symbol: "NIFTY", type: "Sell", quantity: 75, price: 19550.0, status: "Cancelled", time: "10:45 AM" },
]

export function OrderHistory() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.symbol}</TableCell>
                <TableCell className={order.type === "Buy" ? "text-green-500" : "text-red-500"}>{order.type}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.price.toFixed(2)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
