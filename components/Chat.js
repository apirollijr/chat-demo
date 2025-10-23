/**
 * Chat Screen Component
 * 
 * This component implements a fully functional chat interface using the Gifted Chat library.
 * Features include:
 * - Real-time messaging with GiftedChat
 * - Custom message bubbles with theme colors
 * - System messages for user join notifications
 * - Keyboard handling for better UX across platforms
 * - Custom navigation header with user's name and selected background color
 * 
 * Props received from navigation:
 * - name: User's name entered on the start screen
 * - backgroundColor: Selected background color from the start screen
 */

import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  // Extract the name and backgroundColor from route parameters
  const { name, backgroundColor } = route.params;
  
  // State to store chat messages
  const [messages, setMessages] = useState([]);

  // Set the navigation header title to display the user's name
  useEffect(() => {
    navigation.setOptions({ 
      title: name,
      headerStyle: {
        backgroundColor: backgroundColor,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, name, backgroundColor]);

  // Initialize messages when component mounts
  useEffect(() => {
    setMessages([
      // User message (appears first due to reverse chronological order)
      {
        _id: 2,
        text: `Hello! My name is ${name}. I'm excited to start chatting!`,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: name,
          avatar: 'https://placeimg.com/140/140/any', // Placeholder avatar
        },
      },
      // System message (appears second due to reverse chronological order)
      {
        _id: 1,
        text: `${name} has entered the chat`,
        createdAt: new Date(),
        system: true, // This makes it a system message
      },
    ]);
  }, [name]);

  // Callback function to handle sending new messages
  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => 
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {/* KeyboardAvoidingView ensures the keyboard doesn't cover the input field */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* GiftedChat component handles all chat functionality */}
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
            name: name,
            avatar: 'https://placeimg.com/140/140/any', // Placeholder avatar
          }}
          // Custom styling for the input toolbar
          textInputStyle={styles.textInput}
          // Placeholder text for the input
          placeholder="Type a message..."
          // Show user avatars
          showUserAvatar={true}
          // Show timestamp for each message
          showAvatarForEveryMessage={true}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container that fills the entire screen
  container: {
    flex: 1,
  },
  
  // KeyboardAvoidingView to handle keyboard behavior
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Custom styling for the text input field
  textInput: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default Chat;
