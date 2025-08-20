"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, TrendingDown } from "lucide-react"

const API_URL = "https://api.mockstreet.com/"

interface Order {
  symbol: string
  quantity: number
  price: number
  timestamp: string
}

interface SimpleOrderHistoryProps {
  roomId: string | null
  username: string
}

export function SimpleOrderHistory({ roomId, username }: SimpleOrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (roomId && username) {
      const fetchOrders = () => {
        fetch(`${API_URL}/user/${username}/orders/${roomId}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setOrders(data)
            }
          })
      }

      fetchOrders()
      const interval = setInterval(fetchOrders, 5000)

      return () => clearInterval(interval)
    }
  }, [roomId, username])

  return (
    <Card className="bg-black border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-orange-400" />
          <span>Order History</span>
          <Badge variant="outline" className="text-orange-400 border-orange-400/30">
            {orders.length} ORDERS
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/20">
              <TableHead className="text-gray-300">Symbol</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Quantity</TableHead>
              <TableHead className="text-gray-300">Price</TableHead>
              <TableHead className="text-gray-300">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index} className="border-white/10">
                <TableCell className="text-white font-semibold">{order.symbol}</TableCell>
                <TableCell>
                  <div
                    className={`flex items-center space-x-1 ${
                      order.quantity > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {order.quantity > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="font-bold">{order.quantity > 0 ? "BUY" : "SELL"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white font-mono">{Math.abs(order.quantity)}</TableCell>
                <TableCell className="text-white font-mono">{order.price.toFixed(2)}</TableCell>
                <TableCell className="text-gray-300 font-mono">{new Date(order.timestamp).toLocaleTimeString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
