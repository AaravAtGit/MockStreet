"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

interface Message {
  id: number
  sender: string
  text: string
  timestamp: string
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "Opponent", text: "Good luck!", timestamp: "10:00 AM" },
    { id: 2, sender: "You", text: "You too!", timestamp: "10:01 AM" },
    { id: 3, sender: "Opponent", text: "Nifty looks strong today.", timestamp: "10:05 AM" },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "You", text: newMessage.trim(), timestamp: timeString },
      ])
      setNewMessage("")
    }
  }

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader>
        <CardTitle>Battle Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow p-4 h-[200px]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.sender === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="font-semibold text-sm">{msg.sender === "You" ? "You" : msg.sender}</div>
                  <p className="text-sm">{msg.text}</p>
                  <div className="text-xs text-right opacity-75 mt-1">{msg.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
