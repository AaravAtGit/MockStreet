import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TradingChart() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Nifty Trading Chart (Placeholder)</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          <p>Live TradingView Chart Integration would go here.</p>
          <p>For demonstration, this is a static placeholder.</p>
        </div>
      </CardContent>
    </Card>
  )
}
