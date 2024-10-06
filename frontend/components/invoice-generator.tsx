"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, CheckCircle, X } from "lucide-react"
import { CreateInvoice } from "./create-invoice"
import { EmailTemplate } from "./email-template"
import { UploadAndProcessComponent } from "./upload-and-process"

export function InvoiceGeneratorComponent() {
  const [file, setFile] = useState<File | null>(null)
  const [processingOption, setProcessingOption] = useState("thirdParty")
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const [emailTemplate, setEmailTemplate] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSendEmail = async () => {
    if (!file || !invoiceUrl || !emailTemplate) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('invoiceUrl', invoiceUrl)
      formData.append('emailTemplate', emailTemplate)

      const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST
      const response = await fetch(`${backendHost}/send-email`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      const result = await response.json()
      console.log("Email sent successfully:", result)
      // Handle success (e.g., show a success message to the user)
    } catch (error) {
      console.error('Error sending email:', error)
      setError('An error occurred while sending the email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#caf0f8] p-4 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="w-full shadow-lg bg-white">
            <CardHeader className="bg-[#0077b6] text-white">
              <CardTitle>Upload & Process</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <UploadAndProcessComponent
                processingOption={processingOption}
                setProcessingOption={setProcessingOption}
                setInvoiceUrl={setInvoiceUrl}
                setError={setError}
                setFile={setFile}
                file={file}
              />
            </CardContent>
          </Card>

          <EmailTemplate
            emailTemplate={emailTemplate}
            setEmailTemplate={setEmailTemplate}
          />
        </div>

        <Card className="w-full shadow-lg bg-white">
          <CardHeader className="bg-[#0077b6] text-white">
            <CardTitle>Invoice Generation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={processingOption} onValueChange={setProcessingOption}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="thirdParty">Process with InFakt</TabsTrigger>
                <TabsTrigger value="internal">Generate Invoice Internally</TabsTrigger>
              </TabsList>
              <TabsContent value="thirdParty">
                {invoiceUrl ? (
                  <div className="w-full h-[1200px] border-2 border-[#0077b6] rounded-lg overflow-hidden">
                    <iframe src={invoiceUrl} className="w-full h-full" title="Generated Invoice"></iframe>
                  </div>
                ) : (
                  <div className="w-full h-[1200px] border-2 border-[#0077b6] rounded-lg flex items-center justify-center">
                    <p className="text-lg text-gray-500">Upload a file and process to view the invoice</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="internal">
                <CreateInvoice emailTemplate={emailTemplate} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#0077b6] p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-8">
            <div className="flex items-center border-2 border-[#0077b6] rounded-lg p-2">
              <span className={`mr-3 text-2xl ${file ? 'text-green-500' : 'text-red-500'}`}>
                {file ? <CheckCircle className="h-8 w-8" /> : <X className="h-8 w-8" />}
              </span>
              <span className="text-[#0077b6] text-lg font-semibold">Worklog</span>
            </div>
            <div className="flex items-center border-2 border-[#0077b6] rounded-lg p-2">
              <span className={`mr-3 text-2xl ${invoiceUrl ? 'text-green-500' : 'text-red-500'}`}>
                {invoiceUrl ? <CheckCircle className="h-8 w-8" /> : <X className="h-8 w-8" />}
              </span>
              <span className="text-[#0077b6] text-lg font-semibold">Invoice</span>
            </div>
            <div className="flex items-center border-2 border-[#0077b6] rounded-lg p-2">
              <span className={`mr-3 text-2xl ${emailTemplate ? 'text-green-500' : 'text-red-500'}`}>
                {emailTemplate ? <CheckCircle className="h-8 w-8" /> : <X className="h-8 w-8" />}
              </span>
              <span className="text-[#0077b6] text-lg font-semibold">Email</span>
            </div>
          </div>
          <Button 
            onClick={handleSendEmail} 
            disabled={!file || !invoiceUrl || !emailTemplate}
            className="bg-[#0077b6] text-white hover:bg-[#023e8a] text-lg py-6 px-8 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <Send className="mr-3 h-6 w-6" /> Send Email
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}