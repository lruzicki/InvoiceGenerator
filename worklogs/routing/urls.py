from django.urls import path
from worklogs.views import LogFileView, DownloadInvoicePDFView

urlpatterns = [
    path('validate/', LogFileView.as_view(), name='validate_log_file'),
    path('download/infakt/', DownloadInvoicePDFView.as_view(), name='download_invoice_pdf'),
]
