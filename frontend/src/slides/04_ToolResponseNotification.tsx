import { useEffect, useRef, useState } from 'react'
import Chat from '../components/Chat'
import type { SlideDefinition } from './types'

type NotificationPayload = {
  title?: string
  message: string
}

const createSessionId = () => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
)

const ToolResponseNotificationChat = () => {
  const [notification, setNotification] = useState<NotificationPayload | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const sessionIdRef = useRef(createSessionId())

  useEffect(() => {
    if (!notification) {
      return
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setNotification(null)
      timeoutRef.current = null
    }, 5000)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [notification])

  return (
    <div className="slide-chat-wrapper slide-toast-chat">
      {notification && (
        <div className="slide-toast" role="status">
          {notification.title && (
            <p className="slide-toast-title">{notification.title}</p>
          )}
          <p className="slide-toast-message">{notification.message}</p>
        </div>
      )}
      <Chat
        apiPath="/api/slide-agents"
        agentId="slide-4"
        sessionId={sessionIdRef.current}
        onNotification={setNotification}
      />
    </div>
  )
}

const ToolResponseNotificationSlide: SlideDefinition = {
  title: 'Tool-driven responses',
  subtitle: 'Technique 2: Respond + abort inside the tool',
  content: <ToolResponseNotificationChat />,
  rightContent: (
    <div className="slide-right-content">
      <div>
        <p className="slide-right-lead">
          Pass the HTTP response to a tool, let it finish the request, then abort the remaining agent run.
        </p>
      </div>
      <br />
      <div>
        <p className="slide-right-lead"><strong>Why this matters</strong></p>
        <ol className="slide-right-list">
          <li>Input can be validated and returned immediately from the tool</li>
          <li>No post-processing or fallback agent message required</li>
          <li>Abort skips the final model turn, reducing latency and token usage</li>
        </ol>
      </div>
      <br />
      <div>
        <p className="slide-right-lead"><strong>Try this message</strong></p>
        <br />
        <p className="slide-right-caption">
          Send a notification titled Hello with message Welcome!, no reply text.
        </p>
      </div>
    </div>
  ),
  splitLayout: true
}

export default ToolResponseNotificationSlide
