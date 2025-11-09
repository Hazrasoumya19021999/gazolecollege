import { AppRegistry, Alert } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { useEffect } from 'react';

// Request notification permissions
async function requestNotificationPermissions() {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
}

// Set up background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    const { title, body } = remoteMessage.notification;
    console.log(title, body);
});

// Set up initial notification handler
messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
        console.log('Message handled in the terminated state:', remoteMessage);
        const { title, body } = remoteMessage.notification;
        // Optionally, you can display an alert or navigate to a specific screen
    }
});

// Set up foreground message handler
messaging().onMessage(async remoteMessage => {
    const { title, body } = remoteMessage.notification;
    Alert.alert(
        title,
        body,
    );
});

// Ensure permissions are requested when the app starts
requestNotificationPermissions();


AppRegistry.registerComponent(appName, () => App);
