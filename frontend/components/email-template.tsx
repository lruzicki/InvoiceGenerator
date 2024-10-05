"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Copy, CheckCircle } from "lucide-react"

const emailStyles = ["gen-z", "normal", "formal", "generated", "boomer"]

interface EmailTemplateProps {
  emailTemplate: string
  setEmailTemplate: (template: string) => void
}

export function EmailTemplate({ emailTemplate, setEmailTemplate }: EmailTemplateProps) {
  const [emailStyleIndex, setEmailStyleIndex] = useState(1) // Default to "normal"
  const [isCopied, setIsCopied] = useState(false)

  const generateEmailTemplate = (styleIndex: number) => {
    const invoiceNumber = "INV-001"
    const amount = "1,000.00"
    let template = `Hi,

I am sending an invoice ${invoiceNumber} for ${amount}PLN.

Best regards,
XYZ`

    switch (emailStyles[styleIndex]) {
      case "gen-z":
        template = `Yo! 👋

Just dropped invoice ${invoiceNumber} for ${amount}PLN. It's lit! 🔥

Stay cool,
XYZ`
        break
      case "formal":
        template = `Dear Sir/Madam,

Please find attached invoice ${invoiceNumber} for the amount of ${amount}PLN.

Yours sincerely,
XYZ`
        break
      case "generated":
        template = `Greetings,

This is an automated message to inform you that invoice ${invoiceNumber} for ${amount}PLN has been generated and is ready for your review.

Best regards,
Automated Billing System`
        break
      case "boomer":
        template = `Hello there! 🙂

I hope this email finds you well. 🙂 I am sending you invoice ${invoiceNumber} for ${amount}PLN. 🙂

Have a great day! 🙂

Best wishes,
XYZ`
        break
    }

    setEmailTemplate(template)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  useEffect(() => {
    generateEmailTemplate(emailStyleIndex)
  }, [emailStyleIndex])

  return (
    <Card className="w-full shadow-lg bg-white">
      <CardHeader className="bg-[#0077b6] text-white">
        <CardTitle>Email Template</CardTitle>
        <CardDescription className="text-[#caf0f8]">Customize and copy your email template</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-medium">Email Style</Label>
          <Slider
            min={0}
            max={4}
            step={1}
            value={[emailStyleIndex]}
            onValueChange={(value) => setEmailStyleIndex(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            {emailStyles.map((style, index) => (
              <span key={style} className={index === emailStyleIndex ? "font-bold text-[#0077b6]" : ""}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailTemplate" className="text-lg font-medium">Email Template</Label>
          <Textarea 
            id="emailTemplate" 
            value={emailTemplate} 
            onChange={(e) => setEmailTemplate(e.target.value)}
            rows={10}
            className="bg-white border-[#0077b6]"
          />
        </div>
        <div className="pt-4">
          <Button 
            onClick={copyToClipboard} 
            className="w-full bg-[#0077b6] hover:bg-[#023e8a] text-white py-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:bg-[#03045e]"
          >
            {isCopied ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" /> Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" /> Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}