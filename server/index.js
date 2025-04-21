// Simple Node.js server for Telegram Bot API integration
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual Telegram Bot token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Store user data (in a real app, use a database)
const users = {};
const matches = {};

// Webhook endpoint for Telegram updates
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Handle different types of updates
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
});

// Handle incoming messages
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;
  
  // Store user if not already stored
  if (!users[chatId]) {
    users[chatId] = {
      id: chatId,
      name: message.from.first_name,
      username: message.from.username,
      lastActivity: new Date()
    };
  }
  
  // Handle commands
  if (text.startsWith('/')) {
    await handleCommand(chatId, text);
    return;
  }
  
  // Default response
  await sendMessage(chatId, "I'm your Amoo Dating assistant. Type /help to see available commands.");
}

// Handle commands
async function handleCommand(chatId, command) {
  switch (command) {
    case '/start':
      await sendMessage(
        chatId, 
        "Welcome to Amoo Dating Bot! 💕\n\nI can help you find matches and manage your dating profile. Type /help to see all commands."
      );
      break;
      
    case '/help':
      await sendMessage(
        chatId,
        "Available commands:\n" +
        "/start - Start the bot\n" +
        "/profile - View your profile\n" +
        "/matches - View your matches\n" +
        "/search - Find new matches\n" +
        "/settings - Change your preferences"
      );
      break;
      
    case '/profile':
      const user = users[chatId];
      if (user) {
        await sendMessage(
          chatId,
          `Your Profile:\n\nName: ${user.name}\nUsername: @${user.username || 'Not set'}`
        );
      } else {
        await sendMessage(chatId, "You don't have a profile yet. Use /start to create one.");
      }
      break;
      
    case '/matches':
      const userMatches = matches[chatId] || [];
      if (userMatches.length > 0) {
        let matchText = "Your Matches:\n\n";
        userMatches.forEach((match, index) => {
          matchText += `${index + 1}. ${match.name}, ${match.age} - ${match.distance} miles away\n`;
        });
        await sendMessage(chatId, matchText);
      } else {
        await sendMessage(chatId, "You don't have any matches yet. Use /search to find new people!");
      }
      break;
      
    case '/search':
      // Simulate finding a match
      const potentialMatch = {
        id: Math.floor(Math.random() * 1000),
        name: ['Sophia', 'Alex', 'Emma', 'James', 'Olivia'][Math.floor(Math.random() * 5)],
        age: Math.floor(Math.random() * 10) + 25,
        distance: Math.floor(Math.random() * 20) + 1,
        bio: "I love hiking and photography. Looking for someone to share adventures with!"
      };
      
      await sendMessage(
        chatId,
        `Found a potential match!\n\nName: ${potentialMatch.name}\nAge: ${potentialMatch.age}\nDistance: ${potentialMatch.distance} miles\nBio: ${potentialMatch.bio}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "❤️ Like", callback_data: `like_${potentialMatch.id}` },
                { text: "👎 Pass", callback_data: `pass_${potentialMatch.id}` }
              ]
            ]
          }
        }
      );
      break;
      
    case '/settings':
      await sendMessage(
        chatId,
        "Settings:\n\nChange your preferences by selecting options below:",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Age Range", callback_data: "settings_age" }],
              [{ text: "Distance", callback_data: "settings_distance" }],
              [{ text: "Gender Preference", callback_data: "settings_gender" }]
            ]
          }
        }
      );
      break;
      
    default:
      await sendMessage(chatId, "Unknown command. Type /help to see available commands.");
  }
}

// Handle callback queries (button clicks)
async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  
  // Acknowledge the callback query
  await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackQuery.id
  });
  
  if (data.startsWith('like_')) {
    const matchId = data.split('_')[1];
    // Add to matches
    if (!matches[chatId]) {
      matches[chatId] = [];
    }
    
    // Create a match
    const newMatch = {
      id: matchId,
      name: ['Sophia', 'Alex', 'Emma', 'James', 'Olivia'][Math.floor(Math.random() * 5)],
      age: Math.floor(Math.random() * 10) + 25,
      distance: Math.floor(Math.random() * 20) + 1
    };
    
    matches[chatId].push(newMatch);
    
    await sendMessage(chatId, `You liked this person! They've been added to your matches.`);
    
    // 30% chance of mutual match
    if (Math.random() < 0.3) {
      await sendMessage(
        chatId, 
        `🎉 It's a match! ${newMatch.name} liked you back!\n\nSend them a message to start chatting.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Send Message", callback_data: `message_${matchId}` }]
            ]
          }
        }
      );
    }
  } else if (data.startsWith('pass_')) {
    await sendMessage(chatId, "You passed on this person. Use /search to find more matches.");
  } else if (data.startsWith('message_')) {
    await sendMessage(chatId, "Send your message below:");
  } else if (data.startsWith('settings_')) {
    const setting = data.split('_')[1];
    switch (setting) {
      case 'age':
        await sendMessage(chatId, "Select your preferred age range:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "18-25", callback_data: "age_18_25" }],
              [{ text: "25-35", callback_data: "age_25_35" }],
              [{ text: "35-50", callback_data: "age_35_50" }],
              [{ text: "50+", callback_data: "age_50_plus" }]
            ]
          }
        });
        break;
        
      case 'distance':
        await sendMessage(chatId, "Select your preferred maximum distance:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "5 miles", callback_data: "distance_5" }],
              [{ text: "10 miles", callback_data: "distance_10" }],
              [{ text: "25 miles", callback_data: "distance_25" }],
              [{ text: "50+ miles", callback_data: "distance_50_plus" }]
            ]
          }
        });
        break;
        
      case 'gender':
        await sendMessage(chatId, "Select who you want to see:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Women", callback_data: "gender_women" }],
              [{ text: "Men", callback_data: "gender_men" }],
              [{ text: "Everyone", callback_data: "gender_everyone" }]
            ]
          }
        });
        break;
    }
  }
}

// Helper function to send messages
async function sendMessage(chatId, text, extra = {}) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...extra
    });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

// API endpoint to get user data
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = users[userId];
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// API endpoint to get matches
app.get('/api/matches/:userId', (req, res) => {
  const userId = req.params.userId;
  const userMatches = matches[userId] || [];
  
  res.json(userMatches);
});

// API endpoint to send a notification to a user
app.post('/api/notify', async (req, res) => {
  const { userId, message } = req.body;
  
  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }
  
  try {
    await sendMessage(userId, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Set webhook (in production, use a proper HTTPS URL)
  // axios.post(`${TELEGRAM_API}/setWebhook`, {
  //   url: 'https://your-domain.com/webhook'
  // }).then(() => {
  //   console.log('Webhook set successfully');
  // }).catch(error => {
  //   console.error('Error setting webhook:', error);
  // });
});