import React from 'react'
import { View, Text, StyleSheet, TextInput, StatusBar, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import Dashboard from '../student/Dashboard'
import DrawerNavigation from '../student/StudentDrawer/DrawerNavigation'

const Parent = () => {
  return (
  //  <Dashboard />
  <DrawerNavigation/>
  );
}

export default Parent