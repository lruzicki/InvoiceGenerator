from .infakt_service import transform_to_infakt_format, send_to_infakt, download_invoice_pdf
from .log_templates.soldevelo_template import SolDeveloTemplate

def select_template(content):
    return SolDeveloTemplate(content)


def process_file(file):
    content = file.read().decode('utf-8')
    template = select_template(content)
    parsed_data = template.parse()

    # Create the invoice
    invoice_data = transform_to_infakt_format(parsed_data)
    infakt_response = send_to_infakt(invoice_data)

    # Get the invoice ID and build the PDF URL
    invoice_id = infakt_response['id']
    pdf_url = f"https://api.sandbox-infakt.pl/api/v3/invoices/{invoice_id}.pdf"

    # Return the invoice ID and PDF URL for further use
    return pdf_url, invoice_id
