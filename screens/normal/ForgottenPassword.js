import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getData } from '../services/api';

const { width } = Dimensions.get('window');

const ForgottenPassword = () => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();


  const radiolist = [
    { label: 'Student', value: 0 },
    { label: 'Employee', value: 1 },
  ];

  // Step 1: Send OTP (mocked)
  const handleSendOtp = async () => {
    if (userType === null) {
      Alert.alert('Select User Type', 'Please select Student or Employee.');
      return;
    }

    if (!userId.trim()) {
      Alert.alert('Enter User ID', 'Please enter your User ID.');
      return;
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);

    let opcode;
    if (userType === 0) {
      opcode = 1; // Student
    } else {
      opcode = 2; // Employee
    }

    try {
      const result = await resetPassword(opcode, userId, otp, '');

      console.log('ResetPassword API result:', result);

      if (result == -1 || result == "-1") {
        Alert.alert('Sorry', 'No User ID exists.');
        setOtpSent(false); // reset OTP state if user not found
        return;
      }

      // If user exists and OTP sent successfully
      Alert.alert(
        'OTP Sent',
        'A 4-digit OTP has been sent to your registered email.'
      );
      console.log(
        `OTP sent to ${userType === 0 ? 'Student' : 'Employee'} email:`,
        otp
      );
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };


  // Step 2: Verify OTP
  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setOtpVerified(true);
      Alert.alert('Success', 'OTP verified successfully.');
    } else {
      Alert.alert('Invalid OTP', 'Please enter the correct 4-digit OTP.');
    }
  };

  // Step 3: Update Password
  const handleUpdatePassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      let opcode;
      if (userType === 0) {
        opcode = 3; // Student - update password
      } else {
        opcode = 4; // Employee - update password
      }

      console.log('Updating password with:', {
        opcode,
        userId,
        enteredOtp,
        confirmPassword
      });

      // Use enteredOtp instead of otp variable
      const result = await resetPassword(opcode, userId, enteredOtp, confirmPassword);
      console.log('ResetPassword API result:', result);

      // Handle API response
      if (result) {
        Alert.alert('Success', 'Password updated successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update password. Please try again.');
      }

    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'An error occurred while updating password. Please try again.');
    }
  };

  // Also update your resetPassword function to add more debugging:
  const resetPassword = async (OpCode, UserId, OTP, Password) => {
    try {
      const endpoint = `StudentNew/ResetPassword?OpCode=${OpCode}&UserId=${UserId}&OTP=${OTP}&Password=${Password}`;

      console.log('🔍 Making API call to:', endpoint);

      const result = await getData(endpoint);

      console.log('✅ API Response:', result);

      if (result != "-1") {
        console.log('Password reset response:', result);
        return result;
      } else {
        console.warn('⚠️ No data returned from ResetPassword API');
        return null;
      }

    } catch (error) {
      console.error('❌ Error calling ResetPassword API:', error);
      throw error;
    }
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressStep}>
        <View style={[styles.progressCircle, otpSent && styles.progressCircleActive]}>
          <Icon
            name="person"
            size={16}
            color={otpSent ? "#fff" : "#999"}
          />
        </View>
        <Text style={[styles.progressText, otpSent && styles.progressTextActive]}>Verify</Text>
      </View>

      <View style={[styles.progressLine, otpSent && styles.progressLineActive]} />

      <View style={styles.progressStep}>
        <View style={[styles.progressCircle, otpVerified && styles.progressCircleActive]}>
          <Icon
            name="lock"
            size={16}
            color={otpVerified ? "#fff" : "#999"}
          />
        </View>
        <Text style={[styles.progressText, otpVerified && styles.progressTextActive]}>Reset</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Step 1: Select type */}
        {!otpSent && !otpVerified && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Icon name="security" size={80} color="#00517C" />
            </View>

            <Text style={styles.subtitle}>Verify Your Identity</Text>
            <Text style={styles.description}>
              Select your user type and enter your User ID to receive a verification code
            </Text>

            <View style={styles.radioWrapper}>
              <RadioForm
                radio_props={radiolist}
                initial={-1}
                formHorizontal={true}
                buttonColor={'#00517C'}
                selectedButtonColor={'#00517C'}
                buttonSize={12}
                buttonOuterSize={24}
                labelStyle={styles.radioLabel}
                onPress={value => setUserType(value)}
                style={styles.radioContainer}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your User ID"
                placeholderTextColor="#999"
                value={userId}
                onChangeText={setUserId}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Continue</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: OTP verification */}
        {otpSent && !otpVerified && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Icon name="sms" size={80} color="#00517C" />
            </View>

            <Text style={styles.subtitle}>Enter Verification Code</Text>
            <Text style={styles.description}>
              We've sent a 4-digit code to your registered email address
            </Text>

            <View style={styles.otpContainer}>
              <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.otpInput}
                placeholder="Enter 4-digit OTP"
                placeholderTextColor="#999"
                value={enteredOtp}
                onChangeText={setEnteredOtp}
                keyboardType="numeric"
                maxLength={4}
                textAlign="center"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
              <Icon name="check-circle" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: New password */}
        {otpVerified && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Icon name="lock-reset" size={80} color="#00517C" />
            </View>

            <Text style={styles.subtitle}>Create New Password</Text>
            <Text style={styles.description}>
              Your new password must be different from previous used passwords
            </Text>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#999"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
              <Text style={styles.buttonText}>Update Password</Text>
              <Icon name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f8f9fa',
    minHeight: Dimensions.get('window').height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00517C',
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  progressCircleActive: {
    backgroundColor: '#00517C',
    borderColor: '#00517C',
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  progressTextActive: {
    color: '#00517C',
    fontWeight: 'bold',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  progressLineActive: {
    backgroundColor: '#00517C',
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00517C',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  radioWrapper: {
    marginBottom: 25,
  },
  radioContainer: {
    justifyContent: 'space-around',
    width: '100%',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fafafa',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 25,
    backgroundColor: '#fafafa',
    paddingHorizontal: 15,
  },
  otpInput: {
    flex: 1,
    height: 55,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 8,
  },
  button: {
    backgroundColor: '#00517C',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#00517C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#00517C',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ForgottenPassword;