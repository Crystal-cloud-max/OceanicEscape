# Download Project and in your Terminal type:
cd CapstoneProject
npm install
npm start
npm run ios
or
npm run android

# Capstone Project
Our Team "Fish Duo Cali" of the CSUMB, is creating a Capstone Project game mobile app to be available on the Apple's AppStore. More infromation visit React Native website https://reactnative.dev

#Game Name: "Oceanic Escape"

# About our project
We creating a mobile game using React Native, a framework built on React Facebook's JavaScript library for designing user interfaces. React targets browsers and React Native supports mobile platforms, making it a preferred choice for mobile app development. Our team uses React Native, with JSX Elements and Syntax providing necessarily support to enhance and maintain our project.


# Front-end
User interface, game logic, and animations. Rendering game’s characters, handling user input to move the character, collision detection, updating the score and lives. 

# Back-end
The game will use AsyncStorage to store the user's coins, it involves data storage and retrieval. After testing using local storage, the back-end will involve to server-side operations that is Firebase, database interactions, that will update worldwide users and their leaderboard scores. 


# Our Game Overview
Game designed for mobile devices iOS/Android, with React Native framework. Game with obstacles, avoidance and coin collection game. 

Gameplay
The 2D game is an engaging, time based mobile game designed to provide a fun and competitive experience. The player assumes the role of a character, represented by a rainbow fish, with the primary objective to collect as many stars, represented by jelly gems, as possible while avoiding obstacles, represented by villain sharks and coral colliders, and surviving for as long as possible. The play involves navigating the rainbow fish character across a horizontally scrolling screen, collecting jelly gems, and avoiding collisions with villain sharks and coral colliders. The game is time bound, with a timer that counts down from a number of seconds. However, for every 10 stars collected, the player is awarded an extra life, providing an opportunity to extend the game duration. The game incorporates several features to enhance the user experience. Upon starting the game, players can personalize their experience by entering a nickname, uploading a photo avatar, and selecting their location. As the game progresses, the current number of jelly gems collected, the number of lives remaining, and a greeting message displaying the player's nickname are all visible on the game's UI. Also a progress bar represents the remaining time, and there are buttons to start, pause, and resume the game. More key features of the game is the leaderboard, which encourages a competitive environment among players worldwide. The leaderboard is updated in real time, showcasing the top scores and allowing players to compare their performance with others globally. Also, the game will include a settings menu where players can choose the music to on or off according to their preference. When the game concludes, either by running out of time or lives, the player's score, represented by the number of jelly gems collected, is stored. A Game Over message will then be displayed, providing the option to restart or stop the game. The game will be designed to be both entertaining and challenging, encouraging players to improve their skills and climb the leaderboard while enjoying a visually ocean animation and characters and interactive environment.

Sounds
Three sounds, two playing character sounds and 1 background game music, one for good events collecting jellies or destroying other fishes and one for bad events colliding with fish.

Timer and Lives
The game includes a timer, and when it reaches zero, the game is paused, and the player is asked if they want to restart or end the game.
If the player collects a multiple of 10 jellies, the game is paused, and the player is awarded an extra life.

Game Over
When the player loses all their lives, a game over message is displayed, and the player is asked if they want to restart or stop the game.

Collections and User Data
The game keeps track of the jellies collected by the player.
The user's jellies are stored in async storage, so they persist even if the app is closed and reopened.
The user's nickname is displayed during the game.
The game can be paused, resumed, or started by pressing a button.

#Animations
Fish 1 moves from left to right.
The fish 4 moves from right to left with a delay before it starts moving.
The fish 3 moves from right to left with a delay before it starts moving and a delay after it reaches the end.
The Fish 1 can be moved left or right by dragging it and can be made to jump by dragging it up.

# For full information follow Google doc link
https://docs.google.com/document/d/18hkCDM45AMlsjYKj7dxUTcEuDy5TX2RyLjd31QMTcLk/edit



# Getting started on Mac with React Native Framework app for iOS and Android
To get started with the React Native app, we installed dependencies that are offered to get started from the official website https://reactnative.dev/docs/environment-setup

In the Terminal type the line.
brew install node

Then command this line.
brew install watchman

In the Xcode installed Command Line Tools
Give the name of the app (name can be changed at anytime)
npm react-native@latest init CapstoneProject

Install and start npm
npm i
npm start
To run the app either run through the SDK or Terminal
npm run ios
npm run android 

The app now is running by default successfully but with a simple hello world view.
React Native by default suggests using TypeScript file names.
To add more tabs in the app, in the terminal type the following line
npm install @react-navigation/native @react-navigation/bottom-tabs

In terminal this line as well
npm install @types/react-navigation

Then for iOS app only install pods
cd ios && pod install && cd

Customizing the appearance
https://reactnavigation.org/docs/tab-based-navigation/#customizing-the-appearance
Finally creating the tabs successfully but they come simple with text and without icons, so we need to install tabs icons using…
npm install react-native-vector-icons

Installing async modules, this will help to local store the Leaderboard. For the worldwide board we need to create database servers. One way is to use Heroku and APIs, SQL databases to store users and new ones. (First we test the functionalities using local storage)
npm install @react-native-async-storage/async-storage

