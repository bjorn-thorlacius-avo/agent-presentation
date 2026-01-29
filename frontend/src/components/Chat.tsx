import React, { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import './Chat.css'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

interface ToolCall {
  id: string
  name: string
  status: 'started' | 'completed' | 'failed'
  startedAt: string
  endedAt?: string
}

interface ToolCallMessage {
  id: string
  text: string
  status: ToolCall['status']
  timestamp: Date
}

interface ChatProps {
  onSendMessage?: (message: string) => void
  initialMessages?: Message[]
  apiPath?: string
  agentId?: string
  sessionId?: string
  onMessagesChange?: (messages: Message[]) => void
  showToolCalls?: boolean
}

const Chat: React.FC<ChatProps> = ({
  onSendMessage,
  initialMessages = [],
  apiPath = '/api/agent',
  agentId,
  sessionId,
  onMessagesChange,
  showToolCalls = true
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toolCallMessages, setToolCallMessages] = useState<ToolCallMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionIdRef = useRef(
    sessionId
      ?? (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`)
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onMessagesChangeRef = useRef<typeof onMessagesChange>(onMessagesChange)

  useEffect(() => {
    onMessagesChangeRef.current = onMessagesChange
  }, [onMessagesChange])

  useEffect(() => {
    if (onMessagesChangeRef.current) {
      onMessagesChangeRef.current(messages)
    }
  }, [messages])

  useEffect(() => {
    if (!showToolCalls) {
      return
    }

    let isActive = true

    const fetchToolCalls = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
        const response = await fetch(
          `${baseUrl}${apiPath}/tool-calls?sessionId=${sessionIdRef.current}`
        )
        if (!response.ok) {
          return
        }
        const data = (await response.json()) as { toolCalls?: ToolCall[] }
        if (isActive) {
          const calls = data.toolCalls ?? []
          const mapped = calls
            .map((call) => ({
              id: call.id,
              status: call.status,
              timestamp: new Date(call.startedAt),
              text: `Tool call: ${call.name} (${call.status})`
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          setToolCallMessages(mapped)
        }
      } catch (error) {
        // Ignore polling failures to avoid noisy UI.
      }
    }

    fetchToolCalls()
    const intervalId = window.setInterval(fetchToolCalls, 1000)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [apiPath, showToolCalls])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${baseUrl}${apiPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: sessionIdRef.current,
          agentId
        })
      })

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`)
      }

      const data = (await response.json()) as { reply?: string }
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'No response received from agent.',
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentMessage])
      if (onSendMessage) {
        onSendMessage(userMessage.text)
      }
    } catch (error) {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, the agent is unavailable right now.',
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {[...messages, ...toolCallMessages]
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          .length === 0 ? (
          <div className="chat-empty-state">
            <p>Start a conversation with the AI agent...</p>
          </div>
        ) : (
          [...messages, ...toolCallMessages]
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            .map((message) => {
              if ('sender' in message) {
                return (
                  <div
                    key={message.id}
                    className={`chat-message ${message.sender === 'user' ? 'chat-message-user' : 'chat-message-agent'}`}
                  >
                    {message.sender === 'agent' ? (
                      <div
                        className="chat-message-bubble"
                        dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }}
                      />
                    ) : (
                      <div className="chat-message-bubble">
                        <p>{message.text}</p>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div key={message.id} className="chat-message chat-message-tool">
                  <div className="chat-message-bubble">
                    <p>{message.text}</p>
                  </div>
                </div>
              )
            })
        )}
        {isLoading && (
          <div className="chat-message chat-message-agent">
            <div className="chat-message-bubble chat-message-loading">
              <div className="chat-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="chat-send-button"
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Chat