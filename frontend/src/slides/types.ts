import React from 'react'

export interface SlideDefinition {
  title: string
  subtitle?: string
  content?: React.ReactNode
  rightContent?: React.ReactNode
  splitLayout?: boolean
}
