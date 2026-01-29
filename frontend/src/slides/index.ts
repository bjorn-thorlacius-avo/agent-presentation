import type { SlideDefinition } from './types'
import Intro from './01_Intro'
import BaseAgentSetup from './02_BaseAgentSetup'
import OneToolToRuleThemAll from './03_OneToolToRuleThemAll'
import ToolResponseNotification from './04_ToolResponseNotification'
import ToolGatingTopics from './05_ToolGatingTopics'
import MinimizeToolCalls from './06_MinimizeToolCalls'

const slides: SlideDefinition[] = [
  Intro,
  BaseAgentSetup,
  OneToolToRuleThemAll,
  ToolResponseNotification,
  ToolGatingTopics,
  MinimizeToolCalls
]

export default slides
