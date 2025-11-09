import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './screens/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {

  useEffect(() => {
    getDeviceToken()
  }, [])
  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    console.log(token)
    storeStudentTokenId(token);
  }
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notice', JSON.stringify(remoteMessage.notification.body).replaceAll('"', ''));
    });
    return unsubscribe;
  }, []);
  const storeStudentTokenId = async (value: string) => {
    try {
      console.log(value)
      await AsyncStorage.setItem('studenttokenid', value)
    } catch (e) {
      // saving error
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['bottom']}>
      <AppNavigator />
    </SafeAreaView>

  );
}

export default App;
