"use client"

import { createClient } from "@/lib/supabase/client"
import { useCallback, useEffect, useState } from "react"

interface UseRealtimeChatProps {
  roomName: string
  username: string
}

export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
  }
  createdAt: string
}

const EVENT_MESSAGE_TYPE = "message"

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [supabase, setSupabase] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize Supabase client
  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err)
      setError("Failed to connect to chat service. Please check your configuration.")
    }
  }, [])

  // Set up channel subscription when Supabase client is ready
  useEffect(() => {
    if (!supabase) return

    try {
      const newChannel = supabase.channel(roomName)

      newChannel
        .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload: any) => {
          setMessages((current) => [...current, payload.payload as ChatMessage])
        })
        .subscribe(async (status: string) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true)
          }
        })

      setChannel(newChannel)

      return () => {
        if (supabase) {
          supabase.removeChannel(newChannel)
        }
      }
    } catch (err) {
      console.error("Error setting up Supabase channel:", err)
      setError("Failed to connect to chat room. Please try again later.")
    }
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected || !supabase) return

      try {
        const message: ChatMessage = {
          id: crypto.randomUUID(),
          content,
          user: {
            name: username,
          },
          createdAt: new Date().toISOString(),
        }

        // Update local state immediately for the sender
        setMessages((current) => [...current, message])

        await channel.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        })
      } catch (err) {
        console.error("Error sending message:", err)
      }
    },
    [channel, isConnected, username, supabase],
  )

  return { messages, sendMessage, isConnected, error }
}

