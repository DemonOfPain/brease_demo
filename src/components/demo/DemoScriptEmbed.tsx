'use client'

import { useState } from 'react'
import { Code, AlertCircle, CheckCircle } from 'lucide-react'

interface DemoScriptEmbedProps {
  onEmbed: (script: any) => void
}

export function DemoScriptEmbed({ onEmbed }: DemoScriptEmbedProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const googleAnalyticsCode = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>`

  const handleEmbed = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      onEmbed({
        name: 'Google Analytics',
        code: googleAnalyticsCode,
        location: 'head',
        description: 'Google Analytics tracking code for visitor analytics',
        enabled: true
      })
    }, 1500)
  }

  return (
    <div className="bg-white border rounded-lg p-4 mt-2 w-full">
      <div className="flex items-center gap-2 mb-3">
        <Code className="w-5 h-5 text-indigo-600" />
        <h3 className="font-medium">Script Embedding</h3>
      </div>

      <div className="space-y-4">
        {!isAnalyzing ? (
          <>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">Google Analytics Tracking</p>
                  <p className="text-sm text-gray-600">
                    I'll add the tracking code to <span className="font-medium text-blue-600">Brease Demo Site</span>.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    The script will be embedded in all pages' head section.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 rounded-lg p-3 overflow-x-auto w-full">
              <pre className="text-xs font-mono whitespace-pre-wrap break-all">{googleAnalyticsCode}</pre>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">Safe to embed</p>
                <p>This is the official Google Analytics tracking code</p>
              </div>
            </div>

            <button
              onClick={handleEmbed}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Embed Tracking Code
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Analyzing and validating script...</p>
          </div>
        )}
      </div>
    </div>
  )
}