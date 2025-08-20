"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, Trophy } from "lucide-react"
import type { Socket } from "socket.io-client"

interface Message {
  id: number
  sender: string
  text: string
  timestamp: string
  type: "message" | "system" | "achievement"
}

interface BattleChatProps {
  roomId: string | null
  username: string
  socket: Socket | null
}

export function BattleChat({ roomId, username, socket }: BattleChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "System", text: "⚔️ Battle commenced! Good luck traders!", timestamp: "10:00 AM", type: "system" },
  ])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (socket) {
      socket.on('message', (data: { sender: string; msg: string }) => {
        const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        const incomingMessage: Message = {
          id: Date.now(),
          sender: data.sender,
          text: data.msg,
          timestamp: timeString,
          type: data.sender === 'System' ? 'system' : 'message'
        }
        setMessages((prev: Message[]) => [...prev, incomingMessage])
      })
    }

    return () => {
      socket?.off('message')
    }
  }, [socket])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && socket && roomId) {
      const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const message: Message = {
        id: Date.now(),
        sender: username,
        text: newMessage.trim(),
        timestamp: timeString,
        type: "message",
      }
      socket.emit('message', { room: roomId, sender: username, msg: newMessage.trim() })
      setMessages((prev: Message[]) => [...prev, message])
      setNewMessage("")
    }
  }

  const getMessageStyle = (msg: Message) => {
    if (msg.type === "system") {
      return "bg-blue-900/30 border-blue-500/30 text-blue-300"
    }
    if (msg.type === "achievement") {
      return "bg-yellow-900/30 border-yellow-500/30 text-yellow-300"
    }
    if (msg.sender === username) {
      return "bg-green-900/30 border-green-500/30 text-green-300"
    }
    return "bg-gray-800 border-gray-600 text-gray-200"
  }

  return (
    <Card className="bg-black border-white/20 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          <span>Battle Chat</span>
          <Badge variant="outline" className="text-purple-400 border-purple-400/30">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow p-4 h-[250px]">
          <div className="space-y-3">
            {messages.map((msg: Message) => (
              <div key={msg.id} className={`p-2 rounded-lg border ${getMessageStyle(msg)}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs">
                      {msg.sender === username ? "⚡ YOU" : msg.sender === "System" ? "🤖 SYSTEM" : `🎯 ${msg.sender}`}
                    </span>
                    {msg.type === "achievement" && <Trophy className="w-3 h-3 text-yellow-400" />}
                  </div>
                  <span className="text-xs opacity-75">{msg.timestamp}</span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-white/20">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            placeholder="Type your battle message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-gray-900 border-white/20 text-white placeholder:text-gray-500"
          />
          <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
