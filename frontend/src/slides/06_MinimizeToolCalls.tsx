import { useRef, useState } from 'react'
import Chat, { type ChatHandle } from '../components/Chat'
import type { SlideDefinition } from './types'

type Topic = {
  title: string
  info: string
}

const TOPICS: Topic[] = [
  {
    title: 'Release cadence',
    info: 'The product ships monthly, on the first Tuesday. Security fixes are released within 48 hours.'
  },
  {
    title: 'Pricing tiers',
    info: 'Starter is $29/month, Pro is $99/month, Enterprise is custom with annual contracts.'
  },
  {
    title: 'Support hours',
    info: 'Support is available 24/7 for enterprise and 9am-5pm local time for other tiers.'
  }
]

const createSessionId = () => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
)

const MinimizeToolCallsPanel = () => {
  const [showTopics, setShowTopics] = useState(false)
  const chatRef = useRef<ChatHandle>(null)
  const sessionIdRef = useRef(createSessionId())

  const handleSummarize = (topic: Topic) => {
    chatRef.current?.sendMessage(
      `Summarize "${topic.title}" in bullet points.`,
      { context: { topic } }
    )
  }

  return (
    <div className="slide-chat-wrapper slide-topic-chat">
      <div className="slide-topic-switch">
        <button
          className="slide-topic-switch-button"
          type="button"
          onClick={() => setShowTopics((prev) => !prev)}
        >
          Topics: {showTopics ? 'Hide' : 'Show'}
        </button>
        {showTopics && (
          <div className="slide-topic-library">
            <p className="slide-topic-title">Preloaded topics</p>
            <div className="slide-topic-grid">
              {TOPICS.map((topic) => (
                <div key={topic.title} className="slide-topic-card">
                  <p className="slide-topic-item-title">{topic.title}</p>
                  <p className="slide-topic-item-summary">{topic.info}</p>
                  <button
                    className="slide-topic-action"
                    type="button"
                    onClick={() => handleSummarize(topic)}
                  >
                    Summarize without tool call
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Chat
        ref={chatRef}
        apiPath="/api/slide-agents"
        agentId="slide-6"
        sessionId={sessionIdRef.current}
      />
    </div>
  )
}

const MinimizeToolCallsSlide: SlideDefinition = {
  title: 'Minimize tool calls',
  subtitle: 'Technique 4: preload context',
  content: <MinimizeToolCallsPanel />,
  rightContent: (
    <div className="slide-right-content">
      <p className="slide-right-lead">
        Only call tools when the agent truly lacks context.
      </p>
      <div>
        <p className="slide-right-lead"><strong>Approach</strong></p>
        <ol className="slide-right-list">
          <li>Determine fixed facts upfront</li>
          <li>Inject them into the system prompt</li>
          <li>Reserve tools for unknowns</li>
        </ol>
      </div>
      <div>
        <p className="slide-right-lead"><strong>Why this matters</strong></p>
        <ol className="slide-right-list">
          <li>Lower latency and cost</li>
          <li>Less tool noise in logs</li>
          <li>More consistent agent output</li>
        </ol>
      </div>
      <br />
      <div>
        <p className="slide-right-lead"><strong>Try this</strong></p>
        <br />
        <p className="slide-right-caption">
          Click a topic to preload context and summarize without a tool call.
        </p>
        <p className="slide-right-caption">
          Or type a topic question manually to trigger `search_topics` only when prompt context is missing.
        </p>
      </div>
    </div>
  ),
  splitLayout: true
}

export default MinimizeToolCallsSlide
