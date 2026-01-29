import React from 'react'

export interface SlideDefinition {
  title: string
  subtitle?: string
  content?: React.ReactNode
  splitLayout?: boolean
}
