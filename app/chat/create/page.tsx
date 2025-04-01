"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateChatRoom() {
  const router = useRouter()
  const [roomName, setRoomName] = useState("")

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomName.trim()) {
      // Navigate to the new room
      router.push(`/chat/${encodeURIComponent(roomName.trim())}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a Chat Room</CardTitle>
          <CardDescription>Enter a name for your new chat room</CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateRoom}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roomName" className="text-sm font-medium">
                Room Name
              </label>
              <Input
                id="roomName"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button type="submit">Create Room</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

