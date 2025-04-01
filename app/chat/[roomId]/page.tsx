"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { RealtimeChat } from "@/components/realtime-chat"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ChatRoom() {
  const params = useParams<{ roomId: string }>()
  const roomId = params.roomId

  const [username, setUsername] = useState("")
  const [isJoined, setIsJoined] = useState(false)

  // Try to get username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("chat-username")
    if (storedUsername) {
      setUsername(storedUsername)
      setIsJoined(true)
    }
  }, [])

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      localStorage.setItem("chat-username", username)
      setIsJoined(true)
    }
  }

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join Room: {roomId}</CardTitle>
          </CardHeader>
          <form onSubmit={handleJoinChat}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Choose a username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between">
                <Link href="/">
                  <Button variant="outline" type="button">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button type="submit">Join Chat</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Room: {roomId}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Logged in as: {username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("chat-username")
                setIsJoined(false)
              }}
            >
              Change User
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 overflow-hidden">
        <div className="border rounded-lg h-full overflow-hidden">
          <RealtimeChat roomName={roomId} username={username} />
        </div>
      </main>
    </div>
  )
}

