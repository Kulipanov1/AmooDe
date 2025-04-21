# Amoo Dating App with Telegram Integration

This project is a React Native dating app with Telegram integration. It includes:

1. A React Native mobile app (with web support)
2. Telegram Mini App integration
3. Sharing functionality via Telegram
4. A Node.js server for Telegram Bot API integration

## Project Structure

- `/app` - React Native app using Expo Router
- `/components` - Reusable React components
- `/store` - State management with Zustand
- `/utils` - Utility functions
- `/server` - Node.js server for Telegram Bot API
- `/public` - Static files for web deployment

## Setup Instructions

### Mobile App

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

### Telegram Bot Server

1. Navigate to the server directory:
```
cd server
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file based on `.env.example` and add your Telegram Bot token.

4. Start the server:
```
npm start
```

## Telegram Integration Features

### 1. Telegram Mini App

The app can be embedded directly in Telegram as a Mini App. The integration is handled by:
- `TelegramWebAppProvider.tsx` - Context provider for Telegram WebApp
- `utils/telegramWebApp.ts` - Utility functions for Telegram WebApp API
- `telegram-auth.tsx` - Authentication screen for Telegram users

### 2. Share via Telegram

Users can share profiles with their Telegram contacts using:
- `TelegramShare.tsx` - Component for sharing content via Telegram

### 3. Telegram Bot

The Node.js server implements a Telegram bot that allows users to:
- View and edit their profile
- Search for matches
- Receive notifications
- Chat with matches

## Deployment

### Mobile App

To build the app for production:

```
expo build:android
expo build:ios
```

### Web Version for Telegram Mini App

To build the web version:

```
expo build:web
```

### Telegram Bot Server

Deploy the server to a hosting service like Heroku, Vercel, or AWS.

Make sure to set the webhook URL for your bot:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_SERVER_URL>/webhook
```

## Notes

- For the Telegram Mini App to work, you need to register your bot with @BotFather and enable the Web App feature.
- The server requires HTTPS for production use with Telegram webhooks.
- Make sure to replace placeholder values with your actual API keys and endpoints.