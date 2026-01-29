import Chat from '../components/Chat'
import type { SlideDefinition } from './types'

const OneToolToRuleThemAllSlide: SlideDefinition = {
  title: '1 tool to rule them all',
  subtitle: 'Reduce agent responsibility',
  content: (
    <div className="slide-chat-wrapper">
      <Chat />
    </div>
  ),
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
