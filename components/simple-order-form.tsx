"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Target, TrendingUp, TrendingDown } from "lucide-react"

const API_URL = "https://api.mockstreet.com/"

interface SimpleOrderFormProps {
  roomId: string | null
  username: string
}

export function SimpleOrderForm({ roomId, username }: SimpleOrderFormProps) {
  const [quantity, setQuantity] = useState("")
  const [action, setAction] = useState("buy")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quantity || !roomId) {
      toast({
        title: "⚠️ Invalid Order",
        description: "Please enter quantity and ensure you are in a room.",
        variant: "destructive",
      })
      return
    }

    const orderQuantity = action === "buy" ? Number(quantity) : -Number(quantity)

    try {
      const response = await fetch(`${API_URL}/room/${roomId}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          quantity: orderQuantity,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "🎯 Order Placed!",
          description: `Market ${action.toUpperCase()} order for ${quantity} units executed!`,
        })
        setQuantity("")
      } else {
        throw new Error(data.error || "Failed to place order")
      }
    } catch (error: any) {
      toast({
        title: "❌ Error Placing Order",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-black border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span>Place Order</span>
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            MARKET
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity" className="text-white">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity..."
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-900 border-white/20 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="action" className="text-white">
              Action
            </Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="bg-gray-900 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="buy" className="text-green-400">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>BUY</span>
                  </div>
                </SelectItem>
                <SelectItem value="sell" className="text-red-400">
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>SELL</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className={`w-full font-bold ${
              action === "buy" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {action === "buy" ? "🚀 BUY" : "💥 SELL"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
