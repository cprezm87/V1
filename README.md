# OpacoVault - Collection Management App

OpacoVault is a personal collection management system designed for collectors of action figures, props, and accessories.

## Google Sheets Integration

OpacoVault includes integration with Google Sheets to store your collection data in the cloud. This allows you to:

- Back up your collection data
- Access your collection from any device
- Share your collection with others
- Analyze your collection data using Google Sheets features

### Setting Up Google Sheets Integration

To set up the Google Sheets integration, follow these steps:

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google Sheets API for your project

2. **Create a Service Account**:
   - In your Google Cloud project, go to "IAM & Admin" > "Service Accounts"
   - Create a new service account
   - Give it a name and description
   - Grant it the "Editor" role for Google Sheets
   - Create a JSON key for the service account and download it

3. **Create a Google Sheet**:
   - Create a new Google Sheet
   - Share the sheet with the email address of your service account (it should be in the JSON key file)
   - Make sure to give the service account "Editor" access

4. **Set Environment Variables**:
   - Add the following environment variables to your Vercel project:
     \`\`\`
     GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
     GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n
     GOOGLE_SHEETS_DOCUMENT_ID=your-google-sheet-id
     \`\`\`
   - The document ID is the long string in the URL of your Google Sheet:
     `https://docs.google.com/spreadsheets/d/YOUR_DOCUMENT_ID_HERE/edit`

5. **Deploy Your App**:
   - Deploy your app to Vercel
   - The Google Sheets integration should now be working

### Using Google Sheets Integration

Once set up, you can use the Google Sheets integration in the following ways:

1. **Sync Your Collection**:
   - Go to Settings > Sync
   - Click "Google Sheets Sync"
   - Choose whether to upload your local collection to Google Sheets or download from Google Sheets

2. **Automatic Sync**:
   - When you add a new item to your collection, it will automatically be added to Google Sheets
   - When you delete an item from your collection, it will automatically be deleted from Google Sheets

3. **View Your Data in Google Sheets**:
   - Open your Google Sheet to view your collection data
   - The data is organized into three sheets: Figures, Wishlist, and Customs
   - You can use Google Sheets features to analyze your collection data

## Local Development

To run the app locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env.local` file
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser
