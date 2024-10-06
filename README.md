# Invoice Generator Application

This repository contains a Django backend and a Next.js frontend to process worklog files and generate invoices using the inFakt API.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Docker](#docker)
- [If You Like This Project](#if-you-like-this-project)

## Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for the frontend)
- [Python 3.10](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/) (for the backend)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional, for containerization)

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/invoice-generator.git
   cd invoice-generator

2. **Set Up Environment Variables**
   - **Backend:** Create a `.env` file in the `backend` folder with the required environment variables for the Django app and inFakt API:
     ```env
     INF_AKT_API_KEY=your_infakt_api_key
     RATE_PER_HOUR=your_hourly_rate
     CLIENT_COMPANY_NAME=your_client_company_name
     CLIENT_TAX_CODE=your_client_tax_code
     CLIENT_STREET=your_client_street
     CLIENT_CITY=your_client_city
     CLIENT_POST_CODE=your_client_post_code
     CLIENT_COUNTRY=PL  # Or any other country code
     SELLER_NAME=your_name
     LUMP_SUM=12.0
     VAT_EXEMPTION_REASON=1  # Set the reason for VAT exemption
     ```
   - **Frontend:** Create a `.env.local` file in the `frontend` folder for frontend-specific configurations:
     ```env
     NEXT_PUBLIC_BACKEND_HOST=http://localhost:8000
     ```

## Running the Application

### Backend
1. **Navigate to the Backend Directory**
   ```bash
   cd backend


## Preview of the application

![image](https://github.com/user-attachments/assets/e61808d5-fc9a-47d0-a121-38f8910005a3)


