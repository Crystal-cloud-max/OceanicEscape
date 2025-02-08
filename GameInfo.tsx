// Importing required libraries and components
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  ActionSheetIOS,
} from 'react-native';
import Sound from 'react-native-sound';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

// Helper function to check camera permissions
const checkCameraPermission = async () => {
  const status = await check(PERMISSIONS.IOS.CAMERA);

  // If camera permission denied, request permission
  if (status === RESULTS.DENIED) {
    const newStatus = await request(PERMISSIONS.IOS.CAMERA);
    if (newStatus === RESULTS.GRANTED) {
      // Permission granted code can go here
    }
  }
};

// Type definitions for our navigation tabs
interface GameInfoProps {}

// Main GameInfo component
const GameInfo: React.FC<GameInfoProps> = () => {
  // State management for sound and background music settings
  const [sound, setSound] = useState<Sound | null>(null);
  const [isBGSoundMuted, setBGSoundMuted] = useState(false);
  // State for selected images
  const [selectedImage, setSelectedImage] = useState<{ [key: string]: string }>({});

  // UseEffect to initialize sound on component mount
  useEffect(() => {
    const s = new Sound('bg.m4a', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      // Set the sound and start playing
      setSound(s);
      s.setNumberOfLoops(-1);
      s.play();
    });

    // Cleanup to stop and release the sound
    return () => {
      s.stop();
      s.release();
    };
  }, []);

  // UseEffect to handle pausing and playing background music based on mute state
  useEffect(() => {
    if (sound) {
      if (isBGSoundMuted) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  }, [isBGSoundMuted]);

  // UseEffect to fetch previously selected images from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('selectedImages').then(data => {
      if (data) {
        setSelectedImage(JSON.parse(data));
      }
    });
  }, []);

  // Function to handle the action sheet for image selection
  const handleImageSelection = (color: string) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Select from Library', 'Take Photo'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          launchPicker(color, 'library');
        } else if (buttonIndex === 2) {
          launchPicker(color, 'camera');
        }
      }
    );
  };

  // Helper function to launch the image picker
  const launchPicker = (color: string, mode: 'library' | 'camera') => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    const callback = (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets && response.assets[0].uri;
        if (uri) {
          setSelectedImage((prevState) => {
            const newState = { ...prevState, [color]: uri };
            // Storing the selected images in AsyncStorage
            AsyncStorage.setItem('selectedImages', JSON.stringify(newState));
            return newState;
          });
        }
      }
    };

    // Different modes for selecting from library or taking a photo
    if (mode === 'library') {
      ImagePicker.launchImageLibrary(options, callback);
    } else if (mode === 'camera') {
      ImagePicker.launchCamera(options, callback);
    }
  };

  // Helper function to render colored boxes and descriptions
  const renderBox = (color: string, description: string) => (
    <View style={{ marginBottom: 15 }}>
      <TouchableOpacity
        onPress={() => handleImageSelection(color)}
        style={[styles.box, { backgroundColor: selectedImage[color] ? undefined : color }]}
      >
        {selectedImage[color] ? (
          <Image source={{ uri: selectedImage[color] }} style={styles.image} />
        ) : null}
      </TouchableOpacity>
      <Text style={{ marginTop: 5 }}>{description}</Text>
    </View>
  );

  // Rendering the main component UI
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Game Settings </Text>
      <Button title={isBGSoundMuted ? 'Unmute BG Music' : 'Mute BG Music'} onPress={() => setBGSoundMuted(!isBGSoundMuted)} />
      {renderBox('red', 'The Rainbow Fish. The hero and the most beautiful and wise fish in the ocean.')}
      {renderBox('pink', 'The collider the bad character.')}
      {renderBox('yellow', 'The Jelly Gem. A jellyfish that collects treasures and helps the player by providing hints and power ups.')}
      {renderBox('black', 'The Dark Shark. The villain who steals the Magic Pearls and sets up traps and minions to guard them.')}
          
      <Text style={styles.title}>Game Description</Text>
      <Text>In the deep blue ocean, there exists a world of magnificent and colorful fishes. The Oceanic Kingdom is ruled by the Rainbow Fish, the most beautiful and wise fish in the ocean. The kingdom is known for its Jelly Gems which are the source of energy and life for the ocean. However, one day, the Dark Shark, a notorious villain, steals the Jelly Gems and hides them in various secret locations. The Dark Shark also unleashes dangerous creatures and sets up traps to guard the pearls. The mission is to retrieve all the Jelly Gems, defeat the Dark Shark, and restore peace and harmony in the ocean. Players will control a hero fish, which they can choose from a list of characters, each with unique abilities and skills. Players will navigate through different levels, avoid or overcome obstacles, collect treasures, and face the Dark Sharks minions. The game will have a leaderboard to show the top players who have collected the most gems and completed the levels in the least amount of time.</Text>
    </ScrollView>
  );
};

// Styling for the components
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  box: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

// Exporting the main GameInfo component
export default GameInfo;

