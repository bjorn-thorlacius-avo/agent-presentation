import { useState } from 'react'
import Slide from './components/Slide'
import slidesAfterIntro from './slides'
import type { SlideDefinition } from './slides/types'
import './App.css'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides: SlideDefinition[] = [
    {
      title: "Mastering AI Agents",
      subtitle: "4 Minimal Tool Techniques for Powerful Autonomous Systems",
      content: null
    },
    ...slidesAfterIntro
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="presentation-container">
      <Slide 
        title={currentSlideData.title}
        subtitle={currentSlideData.subtitle}
        splitLayout={currentSlideData.splitLayout}
      >
        {currentSlideData.content}
      </Slide>
      <div className="slide-navigation">
        <button 
          className="nav-button nav-button-prev"
          onClick={handlePrevious}
          disabled={currentSlide === 0}
        >
          ← Previous
        </button>
        <span className="slide-indicator">
          {currentSlide + 1} / {slides.length}
        </span>
        <button 
          className="nav-button nav-button-next"
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default App