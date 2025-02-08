// Importing necessary modules and hooks
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useUser } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function UserInfo() {
  // Getting the current user context
  const { user, setUser } = useUser();

  // Setting initial states for nickname and location
  const [nickname, setNickname] = useState(user.nickname);
  const [location, setLocation] = useState(user.location);

  // Function to save updated user info
  const saveUserInfo = () => {
    const updatedUser = {
      nickname,
      location,
    };
    
    // Update the user context
    setUser(updatedUser);

    // Save the updated user data to AsyncStorage for persistence
    AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Return UI components to render
  return (
    <View style={{ padding: 20 }}>
      {/* Text input for nickname */}
      <TextInput
        value={nickname}
        placeholder="Your Nickname"
        onChangeText={setNickname}
        style={{ borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      {/* Text input for location */}
      <TextInput
        value={location}
        placeholder="Your Location"
        onChangeText={setLocation}
        style={{ borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      {/* Button to trigger saving user info */}
      <Button title="Save User Info" onPress={saveUserInfo} />
      {/* Displaying current user's nickname and location */}
      <Text style={{ marginTop: 20 }}>Nickname: {user.nickname}</Text>
      <Text>Location: {user.location}</Text>
    </View>
  );
}

// Exporting the UserInfo component
export default UserInfo;
