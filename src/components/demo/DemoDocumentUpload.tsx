'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react'

interface Props {
  onComplete: () => void
}

export function DemoDocumentUpload({ onComplete }: Props) {
  const [stage, setStage] = useState<'upload' | 'processing' | 'complete'>('upload')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (stage === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setStage('complete')
            setTimeout(() => onComplete(), 500)
            return 100
          }
          return prev + 20
        })
      }, 400)
      return () => clearInterval(interval)
    }
  }, [stage, onComplete])

  const handleUpload = () => {
    setStage('processing')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
      {stage === 'upload' && (
        <div>
          <div 
            onClick={handleUpload}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">Supports: DOCX, PDF, TXT, MD</p>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Demo file: company-profile.docx</p>
                <p className="text-sm text-gray-600">Click the upload area to simulate processing</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === 'processing' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="font-medium">Processing document...</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing structure</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            {progress >= 20 && <div>✓ Document uploaded</div>}
            {progress >= 40 && <div>✓ Extracting text content</div>}
            {progress >= 60 && <div>✓ Identifying sections</div>}
            {progress >= 80 && <div>✓ Mapping to CMS blocks</div>}
            {progress >= 100 && <div>✓ Generating page structure</div>}
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-green-600">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium text-lg">Document processed successfully!</span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Site: <span className="text-blue-600">Brease Demo Site</span></h4>
            <h4 className="font-medium text-gray-900 mb-3">Creating ONE page with these sections:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-sm">🏆 Hero Section</span>
                <span className="text-xs text-gray-500">"Welcome to Our Company"</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-sm">📝 Text Block</span>
                <span className="text-xs text-gray-500">"About Us"</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-sm">📝 Text Block</span>
                <span className="text-xs text-gray-500">"Our Services"</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-sm">👥 Team Section</span>
                <span className="text-xs text-gray-500">"Meet the Team"</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-sm">📧 Contact Form</span>
                <span className="text-xs text-gray-500">"Get in Touch"</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              💡 <strong>Smart Parsing:</strong> Your document will become ONE new page called "Company Profile" with 5 content sections in your current site. 
              Each section can be edited individually after creation.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}