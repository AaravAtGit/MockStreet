"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export function ChatBox() {
  const { messages, sendMessage, player } = useGame()
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-1.5 mb-2 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <p className="text-[10px]">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.playerId === player.id
            return (
              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded px-2 py-1.5 ${
                    isOwn ? "bg-foreground text-background" : "bg-muted text-foreground"
                  }`}
                >
                  {!isOwn && <p className="text-[9px] font-medium mb-0.5 opacity-60">{msg.playerName}</p>}
                  <p className="text-xs break-words">{msg.message}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-1.5 mt-auto">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Message..."
          className="flex-1 bg-muted border-0 h-8 text-xs"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          size="icon"
          className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background"
        >
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
