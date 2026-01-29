import { useRef, useState } from 'react'
import Chat, { type Message as ChatMessage } from '../components/Chat'
import type { SlideDefinition } from './types'

type AgentChoice = 'two-tool' | 'one-tool'

const createSessionId = () => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
)

const OneToolChatPanel = () => {
  const [agentChoice, setAgentChoice] = useState<AgentChoice | null>(null)
  const [showChooser, setShowChooser] = useState(true)
  const [messagesByAgent, setMessagesByAgent] = useState<Record<AgentChoice, ChatMessage[]>>({
    'two-tool': [],
    'one-tool': []
  })
  const sessionIdsRef = useRef<Record<AgentChoice, string>>({
    'two-tool': createSessionId(),
    'one-tool': createSessionId()
  })

  const chooseAgent = (choice: AgentChoice) => {
    setAgentChoice(choice)
    setShowChooser(false)
  }

  if (!agentChoice) {
    return (
      <div className="slide-chat-wrapper slide-agent-picker">
        <p className="slide-right-lead">Choose an agent to chat with:</p>
        <div className="slide-agent-buttons">
          <button
            className="slide-agent-button"
            onClick={() => chooseAgent('two-tool')}
            type="button"
          >
            Two-tool agent
          </button>
          <button
            className="slide-agent-button"
            onClick={() => chooseAgent('one-tool')}
            type="button"
          >
            One-tool agent
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="slide-chat-wrapper">
      <div className="slide-agent-switch">
        <button
          className="slide-agent-switch-button"
          onClick={() => setShowChooser((prev) => !prev)}
          type="button"
        >
          Agent: {agentChoice === 'two-tool' ? 'Two-tool' : 'One-tool'}
        </button>
        {showChooser && (
          <div className="slide-agent-switch-panel">
            <p className="slide-right-lead">Switch to:</p>
            <div className="slide-agent-buttons">
              <button
                className="slide-agent-button"
                onClick={() => chooseAgent('two-tool')}
                type="button"
              >
                Two-tool agent
              </button>
              <button
                className="slide-agent-button"
                onClick={() => chooseAgent('one-tool')}
                type="button"
              >
                One-tool agent
              </button>
            </div>
          </div>
        )}
      </div>
      <Chat
        key={agentChoice}
        apiPath="/api/slide-agents"
        agentId={agentChoice}
        sessionId={sessionIdsRef.current[agentChoice]}
        initialMessages={messagesByAgent[agentChoice]}
        onMessagesChange={(messages) =>
          setMessagesByAgent((prev) => ({
            ...prev,
            [agentChoice]: messages
          }))
        }
      />
    </div>
  )
}

const OneToolToRuleThemAllSlide: SlideDefinition = {
  title: '1 tool to rule them all',
  subtitle: 'Reduce agent responsibility',
  content: <OneToolChatPanel />,
  rightContent: (
    <div className="slide-right-content">
      <p className="slide-right-lead">
        Move orchestration into code so the agent focuses on intent.
      </p>
      <div>
        <p className="slide-right-lead"><strong>Instead of 2 tools</strong></p>
        <ol className="slide-right-list">
          <li>Update data</li>
          <li>Validate data, returns validation result (with errors)</li>
        </ol>
      </div>
      <div>
        <p className="slide-right-lead"><strong>One tool</strong></p>
        <ol className="slide-right-list">
          <li>Update data</li>
          <li>Validate it</li>
          <li>Report an error if invalid</li>
        </ol>
      </div>
    </div>
  ),
  splitLayout: true
}

export default OneToolToRuleThemAllSlide
