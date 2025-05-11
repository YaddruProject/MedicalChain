# Client - Medical Blockchain

This directory contains the main frontend for the Medical Blockchain project.

## Setup Instructions

Follow these steps to configure and run the frontend client locally:

### 1. Navigate to the `client` directory

```bash
cd client
```

### 2. Configure Environment Variables

Rename `sample_config.env` to `.env`, then fill in the required values:

```bash
mv sample_config.env .env
```

Open `.env` and fill in the following:

- `VITE_CONTRACT_ADDRESS` - Address of the deployed MedicalChain contract
- `VITE_CONTRACT_ABI` - ABI of the deployed MedicalChain contract.  
  Before adding it here, convert the ABI to a **single-line JSON string** using [this tool](https://www.text-utils.com/json-formatter/).
- `VITE_PINATA_JWT` - Pinata JWT to upload files to IPFS
- `VITE_PINATA_GATEWAY` - Pinata gateway URL to upload and access the uploaded IPFS files
- `VITE_MEDICAL_CHAIN_API_URL` - URL of the Python analytics serve

### 4. Run the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` by default.
