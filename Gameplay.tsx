// Importing the necessary libraries and components for our Gameplay.
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, Animated, TouchableOpacity, Alert, Dimensions, PanResponder,
    Image,
    Button, Platform, SafeAreaView, StatusBar, StyleSheet
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

// Grabbing the device dimensions
const { width, height } = Dimensions.get('window');

// Function to check screen orientation
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};


// Initializing sound for the good and bad events
const goodSound = new Sound('good_sound.m4a', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the good sound', error);
    return;
  }
});

const badSound = new Sound('bad_sound.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the bad sound', error);
    return;
  }
});

// Utility functions to play our sounds
const playGoodSound = () => {
  goodSound.play();
};

const playBadSound = () => {
  badSound.play();
};

// Setting up some constants to be used in animations and calculations
const SCREEN_WIDTH = Dimensions.get('window').width;
const BOX_SIZE = 50;
const GROUND_HEIGHT = 120;
const RED_BOX_INITIAL_BOTTOM_POSITION = 130;
const BOX_GENERATION_INTERVAL = 2000; // To adjust this for more/less frequency

// The main component: Gameplay
const Gameplay = () => {
    // I'm using various useState hooks to manage game state
    const [gameStarted, setGameStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [stars, setstars] = useState(0);
    const [lives, setLives] = useState(5);
    
    // useRef hooks to manage game state without causing re-renders
    const isJumping = useRef(false).current;
    const collidedWithBlack = useRef(false);
    const collidedWithPink = useRef(false);

    // Animated values to handle all our game animations
    const GROUND_WIDTH = SCREEN_WIDTH / 2;
    const moveGround1 = useRef(new Animated.Value(0)).current;
    const moveGround2 = useRef(new Animated.Value(GROUND_WIDTH)).current;
    const moveRedForward = useRef(new Animated.Value((SCREEN_WIDTH - BOX_SIZE) / 2)).current;
    const jumpRed = useRef(new Animated.Value(RED_BOX_INITIAL_BOTTOM_POSITION)).current;
    
    // Animations for the game obstacles
    const moveBlack = useRef(new Animated.Value(-BOX_SIZE)).current;
    const movePink = useRef(new Animated.Value(SCREEN_WIDTH)).current;
    const moveYellow = useRef(new Animated.Value(SCREEN_WIDTH + BOX_SIZE * 2)).current;

const startBlackBoxAnimation = () => {
    moveBlack.setValue(-BOX_SIZE);
    Animated.timing(moveBlack, {
        toValue: SCREEN_WIDTH + BOX_SIZE,
        duration: 7000,
        useNativeDriver: false,
    }).start();
};


const startPinkBoxAnimation = () => {
    movePink.setValue(SCREEN_WIDTH); // Reset position
    Animated.sequence([
        Animated.delay(3000),
        Animated.timing(movePink, {
            toValue: -BOX_SIZE,
            duration: 6000,
            useNativeDriver: false,
        }),
    ]).start();
};

const startYellowBoxAnimation = () => {
    moveYellow.setValue(SCREEN_WIDTH + BOX_SIZE * 2); // Reset position
    Animated.sequence([
        Animated.delay(5000),
        Animated.timing(moveYellow, {
            toValue: -BOX_SIZE,
            duration: 6000,
            useNativeDriver: false,
        }),
    ]).start();
};

    // Helper function to reward the player with stars
    const rewardstars = (amount) => {
        setstars(prevstars => prevstars + amount);
    };

    // Reset all animated values to their original positions
    const resetAnimatedValues = () => {
        moveRedForward.setValue((SCREEN_WIDTH - BOX_SIZE) / 2);
        jumpRed.setValue(RED_BOX_INITIAL_BOTTOM_POSITION);
        moveBlack.setValue(-BOX_SIZE);
        movePink.setValue(SCREEN_WIDTH);
        moveYellow.setValue(SCREEN_WIDTH + BOX_SIZE * 2);
    };

    // Pan responder for the player's drag and touch interactions
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            // Not jumping here
        },
        onPanResponderMove: (evt, gestureState) => {
            if (gestureState.dy < -20 && !isJumping.current) {
                // Jump Logic
                isJumping.current = true;

                Animated.sequence([
                    Animated.timing(jumpRed, {
                        toValue: RED_BOX_INITIAL_BOTTOM_POSITION + 150,
                        duration: 1500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(jumpRed, {
                        toValue: RED_BOX_INITIAL_BOTTOM_POSITION,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                ]).start(() => {
                    isJumping.current = false;
                });
            }

            if (Math.abs(gestureState.dx) > 20) {
                let newPosition = moveRedForward.__getValue() + gestureState.dx;
                newPosition = Math.min(Math.max(newPosition, 0), SCREEN_WIDTH - BOX_SIZE);
                moveRedForward.setValue(newPosition);
            }
        },
    });
    

// useEffect hook to detect collisions, update the score, etc.
useEffect(() => {
    if (movePink.__getValue() < -BOX_SIZE) {
        movePink.setValue(SCREEN_WIDTH);
    }
    if (moveYellow.__getValue() < -BOX_SIZE) {
        moveYellow.setValue(SCREEN_WIDTH + Math.random() * SCREEN_WIDTH);
    }
    if (moveBlack.__getValue() > SCREEN_WIDTH) {
        moveBlack.setValue(-BOX_SIZE);
    }
}, [movePink, moveYellow, moveBlack]);

useEffect(() => {
    const interval = setInterval(() => {
        if (!gameStarted || isPaused) return;

// Inside the collision detection logic for black box
if (Math.abs(moveRedForward.__getValue() - moveBlack.__getValue()) < BOX_SIZE && Math.abs(jumpRed.__getValue() - RED_BOX_INITIAL_BOTTOM_POSITION) < BOX_SIZE) {
    if (!collidedWithBlack.current) {
        collidedWithBlack.current = true;
        playBadSound(); // Play the sound here
        setLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
                gameOver('No more lives left!');
            }
            return newLives;
        });
        // Restart the black box animation
        moveBlack.setValue(-BOX_SIZE);
    }
} else {
    collidedWithBlack.current = false;
}


// Check for collision with the pink box
if (Math.abs(moveRedForward.__getValue() - movePink.__getValue()) < BOX_SIZE && Math.abs(jumpRed.__getValue() - RED_BOX_INITIAL_BOTTOM_POSITION) < BOX_SIZE) {
    if (!collidedWithPink.current) {
        collidedWithPink.current = true;
        playBadSound();
        setLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
                gameOver('No more lives left!');
            }
            return newLives;
        });
    }
} else {
    collidedWithPink.current = false;
}

// Check if redBox collided with yellowBox to collect stars
if (Math.abs(moveRedForward.__getValue() - moveYellow.__getValue()) < BOX_SIZE && Math.abs(jumpRed.__getValue() - RED_BOX_INITIAL_BOTTOM_POSITION) < BOX_SIZE) {
    playGoodSound();
    rewardstars(1);
    startYellowBoxAnimation(); // Restart yellow box animation
}


        // Check if redBox jumped and landed on top of blackBox to "destroy" them and earn stars
        if (Math.abs(moveRedForward.__getValue() - moveBlack.__getValue()) < BOX_SIZE && jumpRed.__getValue() - RED_BOX_INITIAL_BOTTOM_POSITION > BOX_SIZE && jumpRed.__getValue() - RED_BOX_INITIAL_BOTTOM_POSITION < 2 * BOX_SIZE) {
            rewardstars(1);
            startBlackBoxAnimation(); // Restart black box animation
        }

        // Check if redBox jumped and landed on top of pinkBox to "destroy" them and earn stars
        if (Math.abs(moveRedForward.__getValue() - movePink.__getValue()) < BOX_SIZE && jumpRed.__getValue() - RED_BOX_INITIAL_BOTTOM_POSITION > BOX_SIZE && jumpRed.__getValue() - RED_BOX_INITIAL_BOTTOM_POSITION < 2 * BOX_SIZE) {
            rewardstars(1);
            startPinkBoxAnimation(); // Restart pink box animation
        }

    }, 50);

    return () => clearInterval(interval);
}, [gameStarted, isPaused, moveRedForward, moveBlack, movePink, moveYellow, jumpRed, lives]);

    // Start the animations when the component mounts
    useEffect(() => {
    return () => {
        goodSound.release();
        badSound.release();
    };
}, []);

    // Start the animations when the game starts or resumes
    useEffect(() => {
    startBlackBoxAnimation();
    startPinkBoxAnimation();
    startYellowBoxAnimation();
        if (gameStarted && !isPaused) {
            Animated.loop(
                Animated.timing(moveBlack, {
                    toValue: SCREEN_WIDTH + BOX_SIZE,
                    duration: 7000,
                    useNativeDriver: false,
                })
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.delay(3000),
                    Animated.timing(movePink, {
                        toValue: -BOX_SIZE,
                        duration: 4000,
                        useNativeDriver: false,
                    }),
                    Animated.delay(3000),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(moveYellow, {
                        toValue: -BOX_SIZE,
                        duration: 6000,
                        useNativeDriver: false,
                    }),
                    Animated.delay(4000),
                ])
            ).start();
        }
    }, [gameStarted, isPaused]);


    const startGame = () => {
        setGameStarted(true);
        setIsPaused(false);
        resetAnimatedValues();
    };
Animated.timing(moveBlack, {
    toValue: SCREEN_WIDTH + BOX_SIZE,
    duration: 7000,
    useNativeDriver: false,
}).start();

    // Alert user for game over.
    const gameOver = (message) => {
        setGameStarted(false);
        resetAnimatedValues();
        setLives(5);
        Alert.alert('Game Over', message, [
            {
                text: 'Retry',
                onPress: () => {
                    setstars(0);
                    startGame();
                },
            },
            {
                text: 'Stop',
                onPress: () => { /* Exit*/ },
            },
        ]);
    };
    
    // Alert user when reaches 10 gems and give 1 extra life
    useEffect(() => {
    if (stars === 10) {
        setIsPaused(true);
        Alert.alert('Congratulations!', 'You reached 10 jellies! 🎉', [
            {
                text: 'Continue',
                onPress: () => setIsPaused(false),
            },
        ]);
    }
}, [stars]);

    // Utility function to handle starting the game or pausing it
    const toggleGame = () => {
        if (gameStarted) {
            setIsPaused(!isPaused);
        } else {
            setGameStarted(true);
            setIsPaused(false);
        }
    };

    // Rendering our game's UI
    // Also, styling characters to be replaced later after we create the character icons, for now just testing game functionalities.
    return (
        <View style={{ flex: 1, backgroundColor: 'skyblue' }}>
            <Text style={{ position: 'absolute', top: 10, right: 10, fontSize: 20 }}>Jelly: {stars} 🪼</Text>
            <Text style={{ position: 'absolute', top: 10, left: 0, right: 0, fontSize: 20, textAlign: 'center' }}>Lives: {lives} ❤️</Text>


            <TouchableOpacity onPress={toggleGame} style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'pink', padding: 10 }}>
                <Text>{gameStarted ? (isPaused ? 'Resume' : 'Pause') : 'Start Game'}</Text>
            </TouchableOpacity>

            <View style={{ position: 'absolute', bottom: 0, left: 0, height: GROUND_HEIGHT, width: SCREEN_WIDTH, backgroundColor: 'green' }} />
       <Animated.View
                {...panResponder.panHandlers}
                style={{
                    position: 'absolute',
                    width: BOX_SIZE,
                    height: BOX_SIZE,
                    backgroundColor: 'red',
                    bottom: jumpRed,
                    left: moveRedForward,
                }}
            />

            <Animated.View
                style={{
                    position: 'absolute',
                    width: BOX_SIZE,
                    height: BOX_SIZE,
                    backgroundColor: 'black',
                    bottom: RED_BOX_INITIAL_BOTTOM_POSITION,
                    left: moveBlack,
                }}
            />

            <Animated.View
                style={{
                    position: 'absolute',
                    width: BOX_SIZE,
                    height: BOX_SIZE,
                    backgroundColor: 'pink',
                    bottom: RED_BOX_INITIAL_BOTTOM_POSITION,
                    left: movePink,
                }}
            />

            <Animated.View
                style={{
                    position: 'absolute',
                    width: BOX_SIZE,
                    height: BOX_SIZE,
                    backgroundColor: 'yellow',
                    bottom: RED_BOX_INITIAL_BOTTOM_POSITION,
                    left: moveYellow,
                }}
            />
            <Animated.View
    style={{
        position: 'absolute',
        bottom: 0,
        left: moveGround1,
        height: GROUND_HEIGHT,
        width: GROUND_WIDTH,
        backgroundColor: 'green',
        opacity: 0.5,
    }}
/>
<Animated.View
    style={{
        position: 'absolute',
        bottom: 0,
        left: moveGround2,
        height: GROUND_HEIGHT,
        width: GROUND_WIDTH,
        backgroundColor: 'green',
        opacity: 0.5,
    }}
/>
        </View>
    );
};

export default Gameplay;

