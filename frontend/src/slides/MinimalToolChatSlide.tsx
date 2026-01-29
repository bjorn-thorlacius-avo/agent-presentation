import Chat from '../components/Chat'
import type { SlideDefinition } from './types'

const MinimalToolChatSlide: SlideDefinition = {
  title: 'Minimal Tool #1: Chat Interface',
  subtitle: 'A simple, reusable chat component for agent interactions',
  content: (
    <div className="slide-chat-wrapper">
      <Chat />
    </div>
  ),
  splitLayout: true
}

export default MinimalToolChatSlide
