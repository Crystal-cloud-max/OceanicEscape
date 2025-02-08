// Importing necessary libraries and hooks for our UserContext.
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type (shape) for our user.
interface User {
  nickname: string;
  location: string;
  score?: number;
}

// Default user object we'll use as a starting point.
const defaultUser = {
  nickname: "",
  location: "",
  score: 0
};

// Create a context for user state. This allows child components to easily access and set the user.
const UserContext = createContext<{ user: User; setUser: React.Dispatch<React.SetStateAction<User>> }>({ user: defaultUser, setUser: () => {} });

// This is the provider component. It's wrapping other components to provide them the user state.
const UserProvider: React.FC = ({ children }) => {
  // The user's state is managed here.
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    // When this component is first rendered, we want to retrieve the user data from AsyncStorage.
    AsyncStorage.getItem('user').then(data => {
      if (data) {
        const userData = JSON.parse(data);
        // If there's no score in the stored user data, we set it to 0 by default.
        if (!userData.score) {
          userData.score = 0;
        }
        // Update our user state with the retrieved user data.
        setUser(userData);
      }
    });
  }, []);

  // We provide the user state and the setUser function to the child components.
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to make it easier to use our UserContext in any component.
export const useUser = () => {
  return useContext(UserContext);
};

// Exporting our UserProvider so it can wrap other components in our app.
export default UserProvider;

