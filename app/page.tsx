"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { MessageSquare, Plus } from "lucide-react"

export default function HomePage() {
  const [recentRooms, setRecentRooms] = useState<string[]>([])
  const [roomInput, setRoomInput] = useState("")

  useEffect(() => {
    // Load recent rooms from localStorage
    const storedRooms = localStorage.getItem("recent-chat-rooms")
    if (storedRooms) {
      try {
        setRecentRooms(JSON.parse(storedRooms))
      } catch (e) {
        console.error("Failed to parse recent rooms", e)
      }
    }
  }, [])

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomInput.trim()) {
      joinRoom(roomInput.trim())
    }
  }

  const joinRoom = (roomName: string) => {
    // Add to recent rooms
    const updatedRooms = [roomName, ...recentRooms.filter((room) => room !== roomName)].slice(0, 5)
    setRecentRooms(updatedRooms)
    localStorage.setItem("recent-chat-rooms", JSON.stringify(updatedRooms))

    // Clear input
    setRoomInput("")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Real-time Chat</CardTitle>
          <CardDescription>Join a room or create a new one</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleJoinRoom} className="space-y-2">
            <label htmlFor="roomInput" className="text-sm font-medium">
              Join a Room
            </label>
            <div className="flex gap-2">
              <Input
                id="roomInput"
                placeholder="Enter room name"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
              />
              <Button type="submit">Join</Button>
            </div>
          </form>

          <div>
            <Link href="/chat/create">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Room
              </Button>
            </Link>
          </div>

          {recentRooms.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recent Rooms</h3>
              <div className="space-y-2">
                {recentRooms.map((room) => (
                  <Link key={room} href={`/chat/${encodeURIComponent(room)}`}>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {room}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">Powered by Next.js and Supabase</CardFooter>
      </Card>
    </div>
  )
}

