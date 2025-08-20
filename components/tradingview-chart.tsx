"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Volume2 } from "lucide-react"

declare global {
  interface Window {
    TradingView: any
  }
}

export function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          width: "100%",
          height: 500,
          symbol: "NSE:NIFTY",
          interval: "1",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#000000",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerRef.current.id,
          backgroundColor: "#000000",
          gridColor: "#1a1a1a",
          hide_volume: false,
          studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
          overrides: {
            "paneProperties.background": "#000000",
            "paneProperties.vertGridProperties.color": "#1a1a1a",
            "paneProperties.horzGridProperties.color": "#1a1a1a",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor": "#ffffff",
            "mainSeriesProperties.candleStyle.upColor": "#00ff88",
            "mainSeriesProperties.candleStyle.downColor": "#ff4444",
            "mainSeriesProperties.candleStyle.borderUpColor": "#00ff88",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ff4444",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00ff88",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ff4444",
          },
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <Card className="bg-black border-white/20 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-400" />
          <span>NIFTY 50</span>
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            LIVE
          </Badge>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-white border-white/30">
            1m
          </Badge>
          <Volume2 className="w-4 h-4 text-white cursor-pointer hover:text-gray-300" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <div id="tradingview_chart" ref={containerRef} className="w-full h-full min-h-[500px] bg-black" />
      </CardContent>
    </Card>
  )
}
