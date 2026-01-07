"use client"

import { useEffect, useRef, useCallback } from "react"
import { createChart, ColorType, CandlestickSeries, type IChartApi, type ISeriesApi } from "lightweight-charts"
import { useGame } from "@/lib/game-context"
import { type CandleData } from "@/lib/api"

interface ChartCandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const { phase, currentRoom, lastCandle, preloadCandles } = useGame()
  const candlesRef = useRef<ChartCandleData[]>([])
  const currentCandleTimeRef = useRef<number | null>(null)

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#131313" },
        textColor: "#666666",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1f1f1f" },
        horzLines: { color: "#1f1f1f" },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "#444444", labelBackgroundColor: "#2a2a2a" },
        horzLine: { color: "#444444", labelBackgroundColor: "#2a2a2a" },
      },
      rightPriceScale: {
        borderColor: "#1f1f1f",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "#1f1f1f",
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 12,  // Fixed bar width in pixels
        minBarSpacing: 6,  // Minimum bar width when zoomed out
        rightOffset: 5,  // Leave some space on the right
      },
      handleScale: true,  // Enable zoom with mouse wheel
      handleScroll: true, // Enable pan with click & drag
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderDownColor: "#ef5350",
      borderUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      wickUpColor: "#26a69a",
    })

    // Start with empty chart - data will come from WebSocket
    candlesRef.current = []
    currentCandleTimeRef.current = null

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [])

  // Helper to process candle data
  const processCandle = useCallback((candle: CandleData) => {
    if (!candlestickSeriesRef.current) return

    const candles = candlesRef.current
    
    // Use client-side time for candle creation (floored to minute)
    // This ensures a new candle every 60 real-time seconds
    const now = Math.floor(Date.now() / 1000)
    const currentMinute = Math.floor(now / 60) * 60

    // Check if this is a new minute (different from current candle's minute)
    if (currentCandleTimeRef.current === null || currentMinute !== currentCandleTimeRef.current) {
      // New minute - create a new candle
      const newCandle: ChartCandleData = {
        time: currentMinute,
        open: candle.close,  // Use current price as open for new candle
        high: candle.close,
        low: candle.close,
        close: candle.close,
      }
      
      candles.push(newCandle)
      currentCandleTimeRef.current = currentMinute
      
      // Keep only last 150 candles
      if (candles.length > 150) {
        candles.shift()
        // Re-set all data to avoid time ordering issues
        candlestickSeriesRef.current.setData(candles as any)
      } else {
        candlestickSeriesRef.current.update(newCandle as any)
      }
      
      // Fit content when we have first few candles
      if (candles.length <= 3) {
        chartRef.current?.timeScale().fitContent()
      }
    } else {
      // Same minute - update the current candle with new tick data
      // This animates the candle going up and down
      const currentCandle = candles[candles.length - 1]
      if (currentCandle) {
        // Aggregate tick data: track high/low extremes, update close
        currentCandle.high = Math.max(currentCandle.high, candle.close)
        currentCandle.low = Math.min(currentCandle.low, candle.close)
        currentCandle.close = candle.close
        
        candlestickSeriesRef.current.update(currentCandle as any)
      }
    }
  }, [])

  // Reset and load preload candles
  useEffect(() => {
    if (phase !== "trading" || !candlestickSeriesRef.current || preloadCandles.length === 0) return

    // Don't reload if we already have data (unless phase changed back to trading which implies reset)
    if (candlesRef.current.length > 0) return

    const chartData: ChartCandleData[] = preloadCandles.map((c) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))
    
    candlesRef.current = chartData
    if (chartData.length > 0) {
      currentCandleTimeRef.current = chartData[chartData.length - 1].time
    }
    
    candlestickSeriesRef.current.setData(chartData as any)
    chartRef.current?.timeScale().fitContent()
    
  }, [phase, preloadCandles])

  // Update with lastCandle
  useEffect(() => {
    if (phase === "trading" && lastCandle) {
      processCandle(lastCandle)
    }
  }, [phase, lastCandle, processCandle])

  return <div ref={chartContainerRef} className="w-full h-full" />
}
