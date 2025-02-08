// Import necessary libraries and components
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Bringing in our user context
import UserProvider from './UserContext';

// Import the screens for each tab
import GameInfo from './GameInfo';
import Gameplay from './Gameplay';
import Leaderboard from './Leaderboard';
import UserInfo from './UserInfo';

// Define the tab navigation types. These help us manage which screens can be shown in our tab navigation.
type RootTabParamList = {
  GameInfo: undefined;
  Gameplay: undefined;
  Leaderboard: undefined;
  UserInfo: undefined;
};

// Initialize our bottom tab navigator
const Tab = createBottomTabNavigator<RootTabParamList>();

// Define the tab navigator component
function TabNavigator() {
  return (
    <Tab.Navigator
      // Screen options to customize tab icons and colors
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Deciding the icon based on the route name
          switch (route.name) {
            case 'Settings':
              iconName = 'settings';
              break;
            case 'UserInfo':
              iconName = 'person-outline';
              break;
            case 'Leaderboard':
              iconName = 'trophy-outline';
              break;
            case 'Play Game':
              iconName = 'game-controller-outline';
              break;
            default:
              iconName = 'ellipse-outline';  // Use a default icon if none of the route names match
          }

          // Return the chosen icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* Setting up individual screens for our tab navigation */}
      <Tab.Screen name="Settings" component={GameInfo} />
      <Tab.Screen name="Play Game" component={Gameplay} />
      <Tab.Screen name="Leaderboard" component={Leaderboard} />
      <Tab.Screen name="UserInfo" component={UserInfo} />
    </Tab.Navigator>
  );
}

// Main App component that wraps everything
function App(): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Providing user context to all children */}
      <UserProvider>
        <NavigationContainer>
          {/* Rendering our tab navigation */}
          <TabNavigator />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaView>
  );
}

// Export the main App component
export default App;

