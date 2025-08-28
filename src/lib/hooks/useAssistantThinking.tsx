import { useState, useEffect } from 'react'

interface UseAssistantThinkingProps {
  isLoading: boolean
  intervalRange?: { min: number; max: number }
}

export const useAssistantThinking = ({
  isLoading,
  intervalRange = { min: 3000, max: 5000 }
}: UseAssistantThinkingProps) => {
  const [thinkingText, setThinkingText] = useState('')

  // Array of thinking messages that rotate randomly
  const thinkingMessages = [
    'Analyzing your request...',
    'Processing information...',
    'Gathering insights...',
    'Working on a response...',
    'Thinking through this...',
    'Researching the topic...',
    'Formulating an answer...',
    'Considering the best approach...',
    'Compiling relevant information...',
    'Putting together a comprehensive response...',
    'Double-checking the details...',
    'Making sure I understand correctly...',
    'Exploring different perspectives...',
    'Synthesizing the information...',
    'Crafting a helpful response...'
  ]

  useEffect(() => {
    if (!isLoading) {
      setThinkingText('')
      return
    }
    const updateThinkingText = () => {
      const randomIndex = Math.floor(Math.random() * thinkingMessages.length)
      setThinkingText(thinkingMessages[randomIndex])
    }
    updateThinkingText()
    const interval = setInterval(
      () => {
        updateThinkingText()
      },
      Math.random() * (intervalRange.max - intervalRange.min) + intervalRange.min
    )
    return () => clearInterval(interval)
  }, [isLoading, intervalRange.min, intervalRange.max])

  return {
    thinkingText,
    isThinking: isLoading && thinkingText !== ''
  }
}
