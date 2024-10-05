"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { UploadAndProcessComponent } from "./upload-and-process"
import { EmailTemplate } from "./email-template"
import { CreateInvoice } from "./create-invoice"

export function InvoiceGeneratorComponent() {
  const [processingOption, setProcessingOption] = useState("thirdParty")
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const [emailTemplate, setEmailTemplate] = useState("")

  return (
    <div className="min-h-screen bg-[#caf0f8] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          <UploadAndProcessComponent
            processingOption={processingOption}
            setProcessingOption={setProcessingOption}
            setInvoiceUrl={setInvoiceUrl}
          />
          <EmailTemplate
            emailTemplate={emailTemplate}
            setEmailTemplate={setEmailTemplate}
          />
        </div>

        {processingOption === 'internal' ? (
          <CreateInvoice emailTemplate={emailTemplate} />
        ) : (
          invoiceUrl && (
            <Card className="w-full shadow-lg mt-6 bg-white">
              <CardContent className="p-6">
                <div className="w-full h-[600px] border-2 border-[#0077b6] rounded-lg overflow-hidden">
                  <iframe src={invoiceUrl} className="w-full h-full" title="Generated Invoice"></iframe>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}