import { useRef, useState } from 'react'
import Chat from '../components/Chat'
import type { SlideDefinition } from './types'

const createSessionId = () => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
)

type Topic = {
  title: string
  summary: string
}

const ToolGatingTopicsPanel = () => {
  const [topics, setTopics] = useState<Topic[]>([])
  const sessionIdRef = useRef(createSessionId())

  return (
    <div className="slide-chat-wrapper slide-topic-chat">
      <div className="slide-topic-panel">
        <p className="slide-topic-title">Created topics</p>
        {topics.length === 0 ? (
          <p className="slide-topic-empty">No topics yet. Try creating one.</p>
        ) : (
          <ul className="slide-topic-list">
            {topics.map((topic, index) => (
              <li key={`${topic.title}-${index}`}>
                <p className="slide-topic-item-title">{topic.title}</p>
                <p className="slide-topic-item-summary">{topic.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Chat
        apiPath="/api/slide-agents"
        agentId="slide-5"
        sessionId={sessionIdRef.current}
        onTopicsChange={setTopics}
      />
    </div>
  )
}

const ToolGatingTopicsSlide: SlideDefinition = {
  title: 'Tool ordering',
  subtitle: 'Technique 3: gate tools by prerequisites',
  content: <ToolGatingTopicsPanel />,
  rightContent: (
    <div className="slide-right-content">
      <p className="slide-right-lead">
        Some tools should fail unless prior context has been gathered.
      </p>
      <div>
        <p className="slide-right-lead"><strong>Flow</strong></p>
        <ol className="slide-right-list">
          <li>Search documentation first</li>
          <li>Create a topic based on results</li>
        </ol>
      </div>
      <div>
        <p className="slide-right-lead"><strong>Why this matters</strong></p>
        <ol className="slide-right-list">
          <li>Protects downstream tools from missing context</li>
          <li>Makes failure modes explicit and teachable</li>
        </ol>
      </div>
      <br />
      <div>
        <p className="slide-right-lead"><strong>Try this</strong></p>
        <br />
        <p className="slide-right-caption">
          Create a topic called Agent Tool Patterns
        </p>
      </div>
      <br />
      <p className="slide-right-caption">
        Note: Uses the tool-driven response technique from the previous slide.
      </p>
    </div>
  ),
  splitLayout: true
}

export default ToolGatingTopicsSlide
