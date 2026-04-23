import Chat from '../components/Chat'
import type { SlideDefinition } from './types'

const BaseAgentSetupSlide: SlideDefinition = {
  title: 'Baseline Agent Setup',
  subtitle: 'Wiring used throughout the presentation',
  content: (
    <div className="slide-chat-wrapper">
      <Chat />
    </div>
  ),
  rightContent: (
    <div className="slide-right-content">
      <ul className="slide-right-list">
        <li><strong>LangChain</strong> for agent orchestration and tool calls</li>
        <li><strong>Anthropic Sonnet 4.6</strong> as the default model via API key auth</li>
        <li><strong>Zod</strong> schemas to validate tool inputs</li>
        <li><strong>In-memory conversation history</strong> on the server</li>
        <li><strong>Markdown formatting</strong> on agent responses</li>
      </ul>
      <br/>
      <div>
        <p className="slide-right-lead"><strong>Try this message</strong></p>
        <br />
        <p className="slide-right-caption">
          Search for "langchain"
        </p>
      </div>
    </div>
  ),
  splitLayout: true
}

export default BaseAgentSetupSlide
