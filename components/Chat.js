import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

const Chat = ({ route, navigation }) => {
  // Extract the name and backgroundColor from route parameters
  const { name, backgroundColor } = route.params;

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

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {/* Welcome message */}
      <View style={styles.messageContainer}>
        <Text style={styles.welcomeText}>
          Welcome to the chat, {name}!
        </Text>
        <Text style={styles.infoText}>
          This is where your chat messages will appear.
        </Text>
      </View>

      {/* Placeholder for future chat functionality */}
      <View style={styles.chatArea}>
        <Text style={styles.placeholderText}>
          Chat functionality will be implemented in the next exercise.
        </Text>
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessible={true}
        accessibilityLabel="Go back to start screen"
        accessibilityRole="button"
      >
        <Text style={styles.backButtonText}>Back to Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  chatArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Chat;
