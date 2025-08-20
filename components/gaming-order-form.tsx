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
import { Sword, Shield, Zap, Target, TrendingUp, TrendingDown } from "lucide-react"

export function GamingOrderForm() {
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [orderType, setOrderType] = useState("market")
  const [action, setAction] = useState("buy")
  const [powerUp, setPowerUp] = useState("none")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quantity || !price) {
      toast({
        title: "⚠️ Invalid Order",
        description: "Please fill in all battle parameters.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "🎯 Order Deployed!",
      description: `${action.toUpperCase()} order launched with ${powerUp !== "none" ? powerUp + " boost" : "standard power"}!`,
    })
    setQuantity("")
    setPrice("")
  }

  return (
    <Card className="bg-black border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Sword className="w-5 h-5 text-blue-400" />
          <span>Battle Station</span>
          <Badge variant="outline" className="text-green-400 border-green-400/30 animate-pulse">
            READY
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity" className="text-white flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>Quantity</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter battle size..."
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-900 border-white/20 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price" className="text-white flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Strike Price</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Set your target..."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-900 border-white/20 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="order-type" className="text-white text-xs">
                Order Type
              </Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="bg-gray-900 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="market">⚡ Market</SelectItem>
                  <SelectItem value="limit">🎯 Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="action" className="text-white text-xs">
                Battle Mode
              </Label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="bg-gray-900 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="buy" className="text-green-400">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>LONG</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sell" className="text-red-400">
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>SHORT</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="powerup" className="text-white flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Power-Up</span>
            </Label>
            <Select value={powerUp} onValueChange={setPowerUp}>
              <SelectTrigger className="bg-gray-900 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="2x">🔥 2x Multiplier</SelectItem>
                <SelectItem value="shield">🛡️ Loss Protection</SelectItem>
                <SelectItem value="speed">⚡ Speed Boost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className={`w-full font-bold ${
              action === "buy" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {action === "buy" ? "🚀 LAUNCH LONG" : "💥 LAUNCH SHORT"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
