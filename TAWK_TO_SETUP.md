# Tawk.to Live Chat Setup

This project includes Tawk.to live chat integration for customer support.

## Setup Instructions

1. **Create a Tawk.to Account**
   - Go to [https://www.tawk.to/](https://www.tawk.to/)
   - Sign up for a free account
   - Create a new property for your website

2. **Get Your Property ID**
   - In your Tawk.to dashboard, go to Administration > Chat Widget
   - Copy your Property ID (it looks like: `5f8b4c4d1234567890abcdef`)

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Tawk.to Property ID:
     ```
     VITE_TAWK_TO_PROPERTY_ID=your_actual_property_id_here
     ```

4. **Customize Chat Widget (Optional)**
   - In your Tawk.to dashboard, you can customize:
     - Widget appearance and colors
     - Chat bubble position
     - Offline messages
     - Automated messages
     - Operating hours

## Features Included

- **Automatic User Integration**: When users are logged in, their email and user ID are automatically passed to Tawk.to
- **Conditional Loading**: Chat widget only loads when a valid Property ID is provided
- **Clean Integration**: The chat widget integrates seamlessly with your existing UI
- **TypeScript Support**: Full type definitions for Tawk.to API

## Usage

The chat widget will automatically appear on all pages once configured. Users can:
- Click the chat bubble to start a conversation
- Send messages even when agents are offline
- Receive real-time responses from your support team

## Customization

You can customize the chat widget behavior by modifying `src/components/TawkToChat.tsx`:

- Add custom visitor attributes
- Set up event tracking
- Customize widget visibility rules
- Add custom styling

## Support

For Tawk.to specific issues, visit their [help center](https://help.tawk.to/).