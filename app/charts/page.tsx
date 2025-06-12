"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, BarChart3, Maximize2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useEffect, useRef } from "react"

export default function ChartsPage() {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // TradingView Widget Script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NSE:NIFTY",
      interval: "5",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      backgroundColor: "rgba(0, 0, 0, 1)",
      gridColor: "rgba(42, 46, 57, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: "tradingview_chart",
    })

    if (chartContainerRef.current) {
      chartContainerRef.current.appendChild(script)
    }

    return () => {
      if (chartContainerRef.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const marketData = [
    { symbol: "NIFTY", price: "19,875.50", change: "+125.30", changePercent: "+0.63%", trend: "up" },
    { symbol: "BANK NIFTY", price: "44,250.75", change: "-85.25", changePercent: "-0.19%", trend: "down" },
    { symbol: "NIFTY IT", price: "31,450.20", change: "+245.80", changePercent: "+0.79%", trend: "up" },
    { symbol: "NIFTY PHARMA", price: "13,875.40", change: "-45.60", changePercent: "-0.33%", trend: "down" },
  ]

  const positions = [
    { symbol: "NIFTY 19900 CE", qty: "50", entry: "125.50", ltp: "142.30", pnl: "+₹840", pnlPercent: "+13.4%" },
    { symbol: "NIFTY 19800 PE", qty: "25", entry: "89.20", ltp: "76.80", pnl: "-₹310", pnlPercent: "-13.9%" },
  ]

  const orderBook = [
    { symbol: "NIFTY 20000 CE", type: "BUY", qty: "50", price: "95.50", status: "Pending" },
    { symbol: "NIFTY 19700 PE", type: "SELL", qty: "25", price: "110.20", status: "Executed" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">MockStreet Trading Charts</h1>
          <p className="text-muted-foreground">Real-time charts and trading interface powered by MockStreet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Market Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((data, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium mb-1">{data.symbol}</div>
                    <div className="text-lg font-bold">{data.price}</div>
                    <div
                      className={`text-sm flex items-center ${data.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {data.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {data.change} ({data.changePercent})
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* TradingView Chart */}
            <Card className="h-[600px]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    NIFTY Live Chart
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Fullscreen
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[520px]">
                <div ref={chartContainerRef} id="tradingview_chart" className="h-full w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Margin</span>
                  <span className="font-medium">₹1,85,420</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Used Margin</span>
                  <span className="font-medium">₹14,580</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Day P&L</span>
                  <span className="font-medium text-green-600">+₹530</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total P&L</span>
                  <span className="font-medium text-green-600">+₹2,340</span>
                </div>
              </CardContent>
            </Card>

            {/* Trading Tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="positions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="positions">Positions</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="trade">Trade</TabsTrigger>
                  </TabsList>

                  <TabsContent value="positions" className="p-4 space-y-3">
                    <h4 className="font-medium">Open Positions</h4>
                    {positions.map((position, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{position.symbol}</div>
                            <div className="text-xs text-muted-foreground">Qty: {position.qty}</div>
                          </div>
                          <Badge variant={position.pnl.startsWith("+") ? "default" : "destructive"}>
                            {position.pnlPercent}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Entry: {position.entry}</span>
                          <span>LTP: {position.ltp}</span>
                        </div>
                        <div
                          className={`text-sm font-medium ${position.pnl.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                        >
                          {position.pnl}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="orders" className="p-4 space-y-3">
                    <h4 className="font-medium">Order Book</h4>
                    {orderBook.map((order, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{order.symbol}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.type} {order.qty} @ {order.price}
                            </div>
                          </div>
                          <Badge variant={order.status === "Executed" ? "default" : "secondary"}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="trade" className="p-4 space-y-4">
                    <h4 className="font-medium">Place Order</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Symbol</label>
                        <select className="w-full mt-1 p-2 border rounded-md bg-background">
                          <option>NIFTY 19900 CE</option>
                          <option>NIFTY 19900 PE</option>
                          <option>NIFTY 20000 CE</option>
                          <option>NIFTY 20000 PE</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium">Quantity</label>
                          <input
                            type="number"
                            className="w-full mt-1 p-2 border rounded-md bg-background"
                            placeholder="50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Price</label>
                          <input
                            type="number"
                            className="w-full mt-1 p-2 border rounded-md bg-background"
                            placeholder="125.50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button className="w-full bg-green-600 hover:bg-green-700">BUY</Button>
                        <Button variant="destructive" className="w-full">
                          SELL
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
