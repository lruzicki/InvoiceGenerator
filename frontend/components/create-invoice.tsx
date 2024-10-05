"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, PlusCircle, Trash2, Download, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, lastDayOfMonth } from "date-fns"

// Mock data for demonstration
const mockContractors = [
  { id: 1, name: "ABC Corp", address: "123 Main St, City", tin: "123-45-6789" },
  { id: 2, name: "XYZ Ltd", address: "456 Oak Ave, Town", tin: "987-65-4321" },
]

const mockLogData = {
  current_month: 5, // May
  items: [
    { description: "Web Development", quantity: 40, unitPrice: 100, vatRate: "23" },
    { description: "UI/UX Design", quantity: 20, unitPrice: 150, vatRate: "23" },
  ]
}

interface CreateInvoiceProps {
  emailTemplate: string
}

export function CreateInvoice({ emailTemplate }: CreateInvoiceProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001")
  const [issueDate, setIssueDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()
  const [items, setItems] = useState([{ description: "", quantity: 1, unitPrice: 0, vatRate: "23", total: 0 }])
  const [selectedContractor, setSelectedContractor] = useState<string>("")
  const [buyerDetails, setBuyerDetails] = useState({ name: "", address: "", tin: "" })

  useEffect(() => {
    // Set the issue date to the last day of the current month from logs
    if (mockLogData.current_month) {
      const lastDay = lastDayOfMonth(new Date(new Date().getFullYear(), mockLogData.current_month - 1))
      setIssueDate(lastDay)
    }
  }, [])

  const calculateTotal = (item: typeof items[0]) => {
    return item.quantity * item.unitPrice
  }

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, vatRate: "23", total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = calculateTotal(newItems[index])
    }
    setItems(newItems)
  }

  const autoFillData = () => {
    setItems(mockLogData.items.map(item => ({
      ...item,
      total: calculateTotal(item)
    })))
  }

  const handleContractorChange = (contractorId: string) => {
    setSelectedContractor(contractorId)
    const contractor = mockContractors.find(c => c.id.toString() === contractorId)
    if (contractor) {
      setBuyerDetails({
        name: contractor.name,
        address: contractor.address,
        tin: contractor.tin
      })
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const vatTotal = items.reduce((sum, item) => sum + (item.total * Number(item.vatRate) / 100), 0)
  const total = subtotal + vatTotal

  const downloadInvoice = () => {
    // In a real application, this would generate and download a PDF
    console.log("Downloading invoice...")
  }

  const sendEmail = () => {
    // In a real application, this would send an email with the invoice
    console.log("Sending email with template:", emailTemplate)
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Header</CardTitle>
          <CardDescription>Enter the basic invoice details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div className="flex-1">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !issueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seller Details</CardTitle>
          <CardDescription>Your business information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input value="Your Company Name" readOnly />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea value="Your Company Address" readOnly />
          </div>
          <div>
            <Label>Tax Identification Number (TIN/NIP)</Label>
            <Input value="Your TIN/NIP" readOnly />
          </div>
          <div>
            <Label>Bank Account</Label>
            <Select defaultValue="account1">
              <SelectTrigger>
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account1">Account 1</SelectItem>
                <SelectItem value="account2">Account 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buyer Details</CardTitle>
          <CardDescription>Select a contractor or enter customer information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Contractor</Label>
            <Select value={selectedContractor} onValueChange={handleContractorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contractor" />
              </SelectTrigger>
              <SelectContent>
                {mockContractors.map(contractor => (
                  <SelectItem key={contractor.id} value={contractor.id.toString()}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Customer Name</Label>
            <Input 
              value={buyerDetails.name} 
              onChange={(e) => setBuyerDetails({...buyerDetails, name: e.target.value})}
              placeholder="Enter customer name" 
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea 
              value={buyerDetails.address}
              onChange={(e) => setBuyerDetails({...buyerDetails, address: e.target.value})}
              placeholder="Enter customer address" 
            />
          </div>
          <div>
            <Label>Tax Identification Number (Optional)</Label>
            <Input 
              value={buyerDetails.tin}
              onChange={(e) => setBuyerDetails({...buyerDetails, tin: e.target.value})}
              placeholder="Enter customer TIN/NIP if applicable" 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
          <CardDescription>Add products or services to your invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex space-x-4 items-end">
                <div className="flex-1">
                  <Label>Description</Label>
                  <Input 
                    value={item.description} 
                    onChange={(e) => updateItem(index, "description", e.target.value)} 
                    placeholder="Item description"
                  />
                </div>
                <div className="w-20">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} 
                    min="1"
                  />
                </div>
                <div className="w-32">
                  <Label>Unit Price</Label>
                  <Input 
                    type="number" 
                    value={item.unitPrice} 
                    onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))} 
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="w-24">
                  <Label>VAT Rate</Label>
                  <Select 
                    value={item.vatRate} 
                    onValueChange={(value) => updateItem(index, "vatRate", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="23">23%</SelectItem>
                      <SelectItem value="8">8%</SelectItem>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="zw">Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label>Total</Label>
                  <Input value={item.total.toFixed(2)} readOnly />
                </div>
                <Button variant="destructive" size="icon" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addItem} variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between">
            <span>VAT Total:</span>
            <span>{vatTotal.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{total.toFixed(2)} PLN</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Payment Method</Label>
            <Select defaultValue="bankTransfer">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="creditCard">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Select defaultValue="14days">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="14days">14 days</SelectItem>
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="dueOnReceipt">Due on receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Enter any additional comments or special terms" rows={4} />
        </CardContent>
      </Card>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={autoFillData}>Auto Fill Data</Button>
        <div className="space-x-4">
          <Button variant="outline">Save Draft</Button>
          <Button variant="outline">Preview</Button>
          <Button onClick={downloadInvoice}>
            <Download className="mr-2 h-4 w-4" /> Download Invoice
          </Button>
          <Button onClick={sendEmail}>
            <Mail className="mr-2 h-4 w-4" /> Send Email
          </Button>
          <Button>Issue Invoice</Button>
        </div>
      </div>
    </div>
  )
}