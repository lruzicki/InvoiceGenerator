import json

from django.http import JsonResponse
from django.views import View
from worklogs.services.file_service import process_file
from worklogs.services.infakt_service import download_invoice_pdf
from worklogs.validators.file_validator import validate_log_file
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

@method_decorator(csrf_exempt, name='dispatch')
class LogFileView(View):
    def post(self, request, *args, **kwargs):
        # Get the uploaded file from the request
        uploaded_file = request.FILES['file']

        # Process the file to generate the invoice and get the PDF URL and ID
        pdf_url, invoice_id = process_file(uploaded_file)

        # Optionally, return the URL to the frontend to handle the download separately
        return JsonResponse({'pdf_url': pdf_url, 'invoice_id': invoice_id})


@method_decorator(csrf_exempt, name='dispatch')
class DownloadInvoicePDFView(View):
    def post(self, request, *args, **kwargs):
        try:
            # Parse JSON body to get the invoice_id
            data = json.loads(request.body.decode('utf-8'))
            invoice_id = data.get('invoice_id')

            if not invoice_id:
                return JsonResponse({"error": "Missing invoice_id"}, status=400)

            # Download the invoice PDF content (GET request to inFakt)
            pdf_content = download_invoice_pdf(invoice_id)

            # Return the PDF content as an HTTP response
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="invoice_{invoice_id}.pdf"'
            return response

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

