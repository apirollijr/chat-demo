# Chat App

A React Native chat application built with Expo and React Navigation. This app allows users to enter their name, choose a background color, and navigate to a chat screen.

## Features

- **Start Screen**:

  - Text input for user name with validation
  - Color picker with 4 background color options
  - Elegant UI with styled components and shadows
  - Form validation (name required before proceeding)
  - Keyboard handling to prevent UI coverage

- **Chat Screen**:

  - **Full Chat Functionality**: Powered by Gifted Chat library
  - **Real-time Messaging**: Send and receive messages instantly
  - **System Messages**: Automatic "user entered chat" notification
  - **Custom Message Bubbles**: Styled to match app theme
  - **User Avatars**: Profile pictures for each message
  - **Keyboard Handling**: Smart keyboard avoidance for better UX
  - Displays user's name in the navigation header
  - Background color matches user's selection from start screen

- **Navigation**:
  - Stack navigation between Start and Chat screens
  - Passes user data (name and color) between screens
  - Custom navigation header styling

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and toolchain
- **React Navigation**: Navigation library for screen transitions
- **Gifted Chat**: Complete chat UI and functionality library
- **React Hooks**: useState, useEffect, and useCallback for state management
- **KeyboardAvoidingView**: Cross-platform keyboard handling

## Installation

1. Clone this repository:

   ```bash
   git clone [repository-url]
   cd chat-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install required packages:
   ```bash
   npx expo install react-native-screens react-native-safe-area-context
   npm install react-native-gifted-chat --save
   ```

## Running the App

1. Start the Expo development server:

   ```bash
   npx expo start
   ```

2. Use one of the following methods to run the app:
   - **Android**: Press `a` to open in Android emulator
   - **iOS**: Press `i` to open in iOS simulator
   - **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

```
chat-demo/
├── App.js                 # Main app component with navigation setup
├── components/
│   ├── Start.js          # Start screen component
│   └── Chat.js           # Chat screen component
├── assets/               # App assets (icons, images)
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## App Flow

1. **Start Screen**: User enters their name and selects a background color
2. **Navigation**: User taps "Start Chatting" to navigate to chat screen
3. **Chat Screen**: Displays personalized welcome with chosen background color

## Available Background Colors

- **Black** (#090C08) - Default
- **Dark Purple** (#474056)
- **Blue Gray** (#8A95A5)
- **Light Green** (#B9C6AE)

## Future Enhancements

- ✅ ~~Chat messaging functionality~~ (Implemented with Gifted Chat)
- User authentication and login system
- Message persistence with database storage
- Group chat and multiple chat rooms
- Image and file sharing capabilities
- Push notifications for new messages
- Online status indicators
- Message read receipts
- Custom emoji reactions

## Development Notes

- Uses functional components with React Hooks
- Implements proper accessibility labels
- Includes form validation and user feedback
- Responsive design with Flexbox layout
- Clean, modular code structure with comments

## Requirements Met

### Exercise 5.3 - Navigation & UI Setup

✅ Two screens (Start.js and Chat.js) in components folder  
✅ Text input field for user name  
✅ Navigation button to chat screen  
✅ Flexbox layout implementation  
✅ Custom styling and TouchableOpacity buttons  
✅ Color selection with circular color options  
✅ React Navigation setup  
✅ Name display in navigation header  
✅ Background color passing between screens

### Exercise 5.4 - Chat Functionality

✅ Gifted Chat library installation and integration  
✅ Messages state with useState()  
✅ Initial system and user messages in useEffect()  
✅ KeyboardAvoidingView for Android and iOS  
✅ KeyboardAvoidingView added to Start screen  
✅ Comprehensive code comments throughout  
✅ Functional chat interface with message sending

## Testing

The app has been tested with:

- Form validation (empty name handling)
- Navigation between screens with parameter passing
- Chat message sending and receiving
- System message display on chat entry
- Keyboard behavior on both screens
- UI responsiveness across different screen sizes
- Cross-platform compatibility (iOS/Android behavior)
- Accessibility features and labels

---

**Note**: This implementation includes both Exercise 5.3 (navigation setup) and Exercise 5.4 (chat functionality with Gifted Chat).
