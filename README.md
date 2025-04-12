# AI Avatar Project

A monorepo containing both frontend and backend components for the AI Avatar project.

## Repository Structure
```
ai-avatar/
├── ai-avatar-frontend/
└── ai-avatar-backend/
```

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ai-avatar-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd ai-avatar-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   PORT=your_desired_port_number
   AZURE_SPEECH_KEY=your_azure_speech_key
   AZURE_REGION=your_azure_region
   ```

4. Start the backend server:
   ```
   npm start
   ```

## Environment Variables

The backend requires the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: The port on which the backend server will run
- `AZURE_SPEECH_KEY`: Your Azure Speech Services API key
- `AZURE_REGION`: The Azure region for Speech Services (e.g., eastus, westus2)

## Getting Started

After setting up both the frontend and backend, you can access the application through your browser at the address shown in the frontend terminal output (typically http://localhost:5173 or similar).

## Features

- AI-powered avatar interaction
- Speech synthesis using Azure Speech Services
- Natural language processing with Google's Gemini AI

## Requirements

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Google Gemini API key
- Azure Speech Services account

## Development

To contribute to this project, please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
