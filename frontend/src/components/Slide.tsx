import React from 'react'

interface SlideProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  rightContent?: React.ReactNode
  splitLayout?: boolean
}

const Slide: React.FC<SlideProps> = ({ title, subtitle, children, rightContent, splitLayout = false }) => {
  if (splitLayout) {
    return (
      <div className="slide slide-split">
        <div className="slide-gradient-accent" />
        <div className="slide-left">
          {children}
        </div>
        <div className="slide-right">
          <h1 className="slide-title">{title}</h1>
          {subtitle && <p className="slide-subtitle">{subtitle}</p>}
          {rightContent}
        </div>
      </div>
    )
  }

  return (
    <div className="slide">
      <div className="slide-gradient-accent" />
      <div className="slide-content">
        <h1 className="slide-title">{title}</h1>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

export default Slide