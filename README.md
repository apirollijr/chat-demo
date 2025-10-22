# Chat App

A React Native chat application built with Expo and React Navigation. This app allows users to enter their name, choose a background color, and navigate to a chat screen.

## Features

- **Start Screen**:

  - Text input for user name
  - Color picker with 4 background color options
  - Elegant UI with styled components
  - Form validation (name required)

- **Chat Screen**:

  - Displays user's name in the navigation header
  - Background color matches user's selection from start screen
  - Placeholder for future chat functionality

- **Navigation**:
  - Stack navigation between Start and Chat screens
  - Passes user data (name and color) between screens
  - Custom navigation header styling

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and toolchain
- **React Navigation**: Navigation library for screen transitions
- **React Hooks**: useState and useEffect for state management

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

3. Install required navigation packages:
   ```bash
   npx expo install react-native-screens react-native-safe-area-context
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

- Chat messaging functionality
- User authentication
- Message persistence
- Group chat features
- Image sharing
- Push notifications

## Development Notes

- Uses functional components with React Hooks
- Implements proper accessibility labels
- Includes form validation and user feedback
- Responsive design with Flexbox layout
- Clean, modular code structure with comments

## Requirements Met

✅ Two screens (Start.js and Chat.js) in components folder  
✅ Text input field for user name  
✅ Navigation button to chat screen  
✅ Flexbox layout implementation  
✅ Custom styling and TouchableOpacity buttons  
✅ Color selection with circular color options  
✅ React Navigation setup  
✅ Name display in navigation header  
✅ Background color passing between screens  
✅ Code comments for clarity

## Testing

The app has been tested with:

- Form validation (empty name handling)
- Navigation between screens
- Data passing (name and color)
- UI responsiveness
- Accessibility features

---

**Note**: This is Exercise 5.3 implementation focusing on navigation and UI setup. Chat functionality will be implemented in subsequent exercises.
