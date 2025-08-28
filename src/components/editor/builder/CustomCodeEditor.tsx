'use client'
import React, { useEffect } from 'react'
import Editor from '@monaco-editor/react'

interface CustomCodeEditorProps {
  initialValue: string
  height?: string | number
  width?: string | number
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void
}

export const CustomCodeEditor = ({
  initialValue,
  height = '200px',
  width = '100%',
  onChange
}: CustomCodeEditorProps) => {
  const [code, setCode] = React.useState(initialValue)

  useEffect(() => {
    setCode(initialValue)
  }, [initialValue])

  const options = {
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'monospace',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    roundedSelection: true,
    padding: { top: 16 }
  }

  // Handle code changes
  const handleChange = (value: string | undefined) => {
    const newValue = value || ''
    setCode(newValue)
    onChange(newValue)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height={height}
        width={width}
        language="json"
        theme="light"
        value={code}
        onChange={handleChange}
        options={options}
      />
    </div>
  )
}
