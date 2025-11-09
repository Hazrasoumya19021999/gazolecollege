import {
  View, Text, SafeAreaView, StatusBar, BackHandler, Alert, StyleSheet, TouchableOpacity,
  Platform, ActivityIndicator, Modal, Linking
} from 'react-native';
import EmployeeHeader from './EmployeeHeader';
import EmployeeMenu from './EmployeeMenu';
import EmployeeCustomDrawerHeader from './EmployeeCustomDrawerHeader';
import { useNavigation, DrawerActions, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useFocusEffect } from 'react'
import { getData, postData } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployeeDashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [tokenid, setTokenid] = useState('')
  const [employeeid, setemployeeid] = useState(0)


  const getEmployeea = async () => {
    try {
      const value = await AsyncStorage.getItem('studenttokenid')
      const value1 = await AsyncStorage.getItem('empid')

      if (value !== null && value1 !== null) {
        setTokenid(value)
        setemployeeid(parseInt(value1))
        console.log("TOKEN1 " + value)
        console.log("StudentId1 " + value1)

        SaveTokenAPI()

      }
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    CheckAppVersion();
    getEmployeea();

  });

  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isFocused]);

  const CheckAppVersion = async () => {
    const apiUrl = await getData('EmployeeNew/CheckUpdateAppVersioncode?Versioncode=' + 14);
    try {
      const data = parseInt(apiUrl.message, 11);
      console.log('Versioncode', data)
      if (data == 0) {
        setUpdateModalVisible(true);
      } else {
        setUpdateModalVisible(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const SaveTokenAPI = async () => {
    const body = { EmployeeId: parseInt(employeeid), DeviceToken: tokenid };
    console.log(body)
    const result = await postData('EmployeeNew/SaveDeviceTokenFromMobile', body);
    console.log('result token', result)

    // result = await result.json();
    //  console.log(result)

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#75c7a1" />
      {/* <EmployeeCustomDrawerHeader
        HeaderDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      /> */}
      <EmployeeHeader />
      <EmployeeMenu />
      <Modal transparent={true} visible={updateModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Update Available</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.updateIcon}>system_update</Text>
              <Text style={styles.modalText}>
                We've added new features and improvements. Update now for the best experience!
              </Text>

              <Text style={[styles.modalText, { marginBottom: 20, color: 'red' }]}>
                This version is no longer supported. Please update to continue using the app.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={() => Linking.openURL(Platform.OS === 'android' ?
                    'https://play.google.com/store/apps/details?id=com.maldacollegeapp' :
                    'itms-apps://itunes.apple.com/app/idYOUR_APP_ID')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buttonText}>UPDATE NOW</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => BackHandler.exitApp()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>EXIT FROM APP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    width: '95%',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f7f4f0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDesignation: {
    color: 'darkblue',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 15,
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 16,
    marginBottom: 5,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  mealContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  mealBox: {
    width: '48%',
    backgroundColor: '#ffebcd',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  datePickerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  datePickerText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f', // Red color for warning messages
    textAlign: 'center',
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  modalBody: {
    padding: 24,
    alignItems: 'center',
  },
  updateIcon: {
    fontFamily: 'MaterialIcons',
    fontSize: 48,
    color: '#2196F3',
    marginBottom: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#bdbdbd',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
    letterSpacing: 0.5,
  },
});
export default EmployeeDashboard;