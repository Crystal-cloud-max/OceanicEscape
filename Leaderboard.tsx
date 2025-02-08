// Importing required libraries and hooks.
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';
import { useIsFocused } from '@react-navigation/native';

// Type definition for our leaderboard users
interface UserScore {
  name: string;
  score: number;
}

// Leaderboard component definition
function Leaderboard() {
  // Using the user context to get the current user's details
  const { user } = useUser();
  const [score, setScore] = useState<number | null>(null);

  // Sample leaderboard data, can be replaced with actual backend data later
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([
      { name: 'Crystal 🇺🇸', score: 150 },
        { name: 'Peter 🇨🇦', score: 120},
        { name: 'Jose 🇲🇽', score: 119 },
        { name: 'Gerhard 🇩🇪', score: 116 },
        { name: 'Christa 🇬🇧', score: 103 },
        { name: 'James 🇦🇺', score: 92 },
        { name: 'Laurand 🇺🇸', score: 85 },
  ]);

  // Check if screen is currently in focus
  const isFocused = useIsFocused();

  useEffect(() => {
    // Async function to fetch the score from AsyncStorage
    const fetchScore = async () => {
      try {
        const savedScore = await AsyncStorage.getItem('@score');
        if (savedScore !== null) {
          setScore(Number(savedScore));

          // Updating the leaderboard with the user's score
          const updatedLeaderboard = [...leaderboard];
          const userIndex = updatedLeaderboard.findIndex(u => u.name === user.nickname);
          if (userIndex !== -1) {
            updatedLeaderboard[userIndex].score = Number(savedScore);
          } else {
            updatedLeaderboard.push({ name: user.nickname, score: Number(savedScore) });
          }

          // Sorting the leaderboard based on scores
          updatedLeaderboard.sort((a, b) => b.score - a.score);
          setLeaderboard(updatedLeaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch the score.", error);
      }
    };

    fetchScore();
  }, [score, isFocused]); // Re-run when score or screen focus changes

  // The main render of the component
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User Information ℹ️</Text>
        <View style={styles.userInfoContainer}>
          <Text>Nickname: {user.nickname}</Text>
          <Text>Location: {user.location}</Text>
          <Text>Your latest score: {score !== null ? score : "Not available"}</Text>
        </View>
       <Text style={styles.title}>Worldwide Leaderboards 🌎</Text>
  <FlatList
    data={leaderboard}
    renderItem={({ item }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.score}>{item.score} 🏆 | {item.stars} 🪼</Text>
      </View>
    )}
    keyExtractor={(item) => item.name}
  />
      </View>
    );
  }

// Styling definitions for the components in this file
const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 20,
},
title: {
  fontSize: 24,
  marginBottom: 20,
},
itemContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 10,
  borderBottomWidth: 1,
  borderColor: '#eee',
},
name: {
  fontSize: 18,
},
score: {
  fontSize: 18,
  fontWeight: 'bold',
},
userInfoContainer: {
  padding: 10,
  marginBottom: 20,
  backgroundColor: '#f7f7f7',
  borderRadius: 10,
},
});

// Exporting the Leaderboard component for use in other parts of our app
export default Leaderboard;
