import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
import calendar

load_dotenv()

RATE_PER_HOUR = float(os.getenv('RATE_PER_HOUR', 100))

CLIENT_COMPANY_NAME = os.getenv('CLIENT_COMPANY_NAME')
CLIENT_TAX_CODE = os.getenv('CLIENT_TAX_CODE')
CLIENT_STREET = os.getenv('CLIENT_STREET')
CLIENT_CITY = os.getenv('CLIENT_CITY')
CLIENT_POST_CODE = os.getenv('CLIENT_POST_CODE')
CLIENT_COUNTRY = os.getenv('CLIENT_COUNTRY', 'PL')

SELLER_NAME = os.getenv('SELLER_NAME')

LUMP_SUM = float(os.getenv('LUMP_SUM', 12.0))

VAT_EXEMPTION_REASON = os.getenv('VAT_EXEMPTION_REASON', 1)


def transform_to_infakt_format(data):
    current_month = int(data['current_month'])
    current_year = datetime.now().year
    last_day_of_month = calendar.monthrange(current_year, current_month)[1]
    issue_date = datetime(current_year, current_month, last_day_of_month).strftime('%Y-%m-%d')
    payment_to = (datetime.now() + timedelta(weeks=2)).strftime('%Y-%m-%d')
    project_hours = data['project_hours']
    services = [
        {
            "name": f"Usługi informatyczne za {current_month}/{current_year} - {project}",
            "quantity": 1.0,
            "unit": "szt.",
            "unit_net_price": int(hours * RATE_PER_HOUR * 100),
            "net_price": int(hours * RATE_PER_HOUR * 100),
            "gross_price": int(hours * RATE_PER_HOUR * 100),
            "tax_price": 0,
            "tax_symbol": "zw",
            "flat_rate_tax_symbol": "12",
            "discount": "0.0",
            "unit_net_price_before_discount": int(hours * RATE_PER_HOUR * 100),
            "symbol": "",
            "pkwiu": None,
            "cn": None,
            "pkob": None,
            "gtu_id": None,
            "related_id": None
        }
        for project, hours in project_hours.items()
    ]

    invoice_data = {
        "invoice": {
            "client_company_name": CLIENT_COMPANY_NAME,
            "client_tax_code": CLIENT_TAX_CODE,
            "client_street": CLIENT_STREET,
            "client_city": CLIENT_CITY,
            "client_post_code": CLIENT_POST_CODE,
            "client_country": CLIENT_COUNTRY,
            "services": services,
            "issue_date": issue_date,
            "sale_date": issue_date,
            "payment_to": payment_to,
            "seller_name": SELLER_NAME,
            "status": "draft",
            "vat_exemption_reason": 1,
        }
    }

    return invoice_data

import json

def send_to_infakt(invoice_data):
    INF_AKT_API_KEY = os.getenv('INF_AKT_API_KEY')
    INF_AKT_API_URL = os.getenv('INF_AKT_API_URL')

    headers = {
        "Content-Type": "application/json",
        "X-inFakt-ApiKey": INF_AKT_API_KEY
    }

    # Use json.dumps to ensure correct serialization
    response = requests.post(INF_AKT_API_URL, data=json.dumps(invoice_data), headers=headers)

    if response.status_code == 201:
        return response.json()  # Returns the invoice details if successful
    else:
        # Print response content for debugging
        print("Response Content:", response.content)
        response.raise_for_status()


def download_invoice_pdf(invoice_id):
    INF_AKT_API_KEY = os.getenv('INF_AKT_API_KEY')
    INF_AKT_API_URL = f"https://api.sandbox-infakt.pl/api/v3/invoices/{invoice_id}/pdf.json"

    headers = {
        "Content-Type": "application/json",
        "X-inFakt-ApiKey": INF_AKT_API_KEY
    }

    params = {
        "document_type": "original"
    }

    response = requests.get(INF_AKT_API_URL, headers=headers, params=params)

    # Debugging output
    print("Status Code:", response.status_code)
    print("Headers:", response.headers)
    print("Content:", response.content)

    if response.status_code == 200:
        return response.content
    else:
        response.raise_for_status()





