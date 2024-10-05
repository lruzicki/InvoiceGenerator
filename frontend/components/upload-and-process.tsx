"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader } from "lucide-react"

interface UploadAndProcessProps {
  processingOption: string
  setProcessingOption: (option: string) => void
  setInvoiceUrl: (url: string | null) => void
}

export function UploadAndProcessComponent({
  processingOption,
  setProcessingOption,
  setInvoiceUrl
}: UploadAndProcessProps) {
  const [file, setFile] = useState<File | null>(null)
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

    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setInvoiceUrl("/placeholder.pdf")
    setIsProcessing(false)
  }

  return (
    <Card className="w-full shadow-lg bg-white">
      <CardHeader className="bg-[#0077b6] text-white">
        <CardTitle>Upload & Process</CardTitle>
        <CardDescription className="text-[#caf0f8]">Upload your worklog and generate an invoice</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="worklog" className="text-lg font-medium">Upload Worklog</Label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="worklog" className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#0077b6] border-dashed rounded-lg cursor-pointer bg-[#caf0f8] hover:bg-[#90e0ef]">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <Loader className="w-10 h-10 mb-3 text-[#0077b6] animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 mb-3 text-[#0077b6]" />
                )}
                <p className="mb-2 text-sm text-[#03045e]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-[#03045e]">CSV, XLS, or XLSX (MAX. 10MB)</p>
              </div>
              <Input id="worklog" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.xls,.xlsx" />
            </label>
          </div>
          {file && <p className="text-sm text-[#03045e]">Selected file: {file.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label className="text-lg font-medium">Processing Option</Label>
          <RadioGroup value={processingOption} onValueChange={setProcessingOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="thirdParty" id="thirdParty" />
              <Label htmlFor="thirdParty">Process with 3rd Party App</Label>
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
      </CardContent>
    </Card>
  )
}