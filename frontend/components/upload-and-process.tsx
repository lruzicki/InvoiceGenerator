"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Loader } from "lucide-react"

interface UploadAndProcessProps {
  processingOption: string
  setProcessingOption: (option: string) => void
  setInvoiceUrl: (url: string | null) => void
  setError: (error: string | null) => void
  setFile: (file: File | null) => void
  file: File | null
}

export function UploadAndProcessComponent({
  processingOption,
  setProcessingOption,
  setInvoiceUrl,
  setError,
  setFile,
  file
}: UploadAndProcessProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsUploading(true)
      setFile(event.target.files[0])
      // Simulating file upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsUploading(false)
    }
  }

  const handleProcessing = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST
      
      // First API call to validate worklog
      const validateResponse = await fetch(`${backendHost}/worklogs/validate/`, {
        method: 'POST',
        body: formData,
      })

      if (!validateResponse.ok) {
        throw new Error('Worklog validation failed')
      }

      const validateData = await validateResponse.json()
      const { invoice_id } = validateData

      // Second API call to download the invoice PDF
      const downloadResponse = await fetch(`${backendHost}/worklogs/download/infakt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoice_id: invoice_id.toString() }),
      })

      if (!downloadResponse.ok) {
        throw new Error('Invoice download failed')
      }

      const blob = await downloadResponse.blob()
      const pdfUrl = URL.createObjectURL(blob)
      setInvoiceUrl(pdfUrl)
    } catch (error) {
      console.error('Error processing invoice:', error)
      setError('An error occurred while processing the invoice. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="worklog" className="text-lg font-medium">Upload Worklog</Label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="worklog" className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#0077b6] border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader className="w-10 h-10 mb-3 text-[#0077b6] animate-spin" />
              ) : (
                <Upload className="w-10 h-10 mb-3 text-[#0077b6]" />
              )}
              <p className="mb-2 text-sm text-[#03045e]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-[#03045e]">TXT, CSV, XLS, or XLSX (MAX. 10MB)</p>
            </div>
            <Input id="worklog" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.xls,.xlsx,.txt" />
          </label>
        </div>
        {file && (
          <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md">
            <p className="text-sm text-green-700">File loaded: {file.name}</p>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="text-lg font-medium">Processing Option</Label>
        <RadioGroup value={processingOption} onValueChange={setProcessingOption}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="thirdParty" id="thirdParty" />
            <Label htmlFor="thirdParty">Process with InFakt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="internal" id="internal" />
            <Label htmlFor="internal">Generate Invoice Internally</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleProcessing} 
          disabled={!file || isProcessing}
          className="w-full bg-[#0077b6] hover:bg-[#023e8a] text-white text-lg py-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:bg-[#03045e]"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Processing...
            </div>
          ) : (
            <>Process and Generate Invoice</>
          )}
        </Button>
      </div>
    </div>
  )
}