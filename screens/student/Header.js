import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from "react-native-responsive-fontsize";
import { getData } from '../services/api';

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const Header = () => {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [imageurl, setPrflimage] = useState('')
  const [regno, setRegno] = useState('')
  const [coursename, setCoursename] = useState('')
  const [universityrollno, setUniversityrollno] = useState('')

  useEffect(() => {
    getLocalData()
  }, [])

  const getLocalData = async () => {
    try {
      const [
        emailValue,
        pwdValue,
        imageValue,
        regnoValue,
        coursenameValue,
        universityrollnoValue,
        studentid
      ] = await Promise.all([
        AsyncStorage.getItem('email'),
        AsyncStorage.getItem('pwd'),
        AsyncStorage.getItem('image'),
        AsyncStorage.getItem('regno'),
        AsyncStorage.getItem('coursename'),
        AsyncStorage.getItem('universityrollno'),
        AsyncStorage.getItem('studentid')
      ])

      // Set all local storage values
      if (emailValue) setEmail(emailValue)
      if (pwdValue) setPwd(pwdValue)
      if (imageValue) setPrflimage(imageValue)
      if (regnoValue) setRegno(regnoValue)
      if (coursenameValue) setCoursename(coursenameValue)
      if (universityrollnoValue) setUniversityrollno(universityrollnoValue)

      // Fetch updated student data if studentid exists
      if (studentid) {
        const data = await getData("StudentReactNative/LoadStudentSubjects?studentid=" + studentid);
        if (data?.StudentPhoto) {
          setPrflimage(data.StudentPhoto);
        }
      }
    } catch (e) {
      console.log('Error loading local data:', e)
    }
  }

  const getCurrentDate = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    return `${date}-${month}-${year}`;
  }

  // Default image URL
  const defaultImageUrl = 'https://gmg.ac.in/erp/Student/StudentPhoto/2024/S1.jpg';
  
  // Image source with fallback to default
  const imageSource = imageurl 
    ? { uri: imageurl }
    : { uri: defaultImageUrl };

  return (
    <View style={styles.header}>
      <Image
        source={imageSource}
        style={styles.profileImage}
        resizeMode="cover"
        onError={() => setPrflimage('')} // Fallback to default image on error
        defaultSource={{ uri: defaultImageUrl }} // iOS fallback
      />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.emailText}>
          {email || 'N/A'}
        </Text>
        <Text style={styles.courseText}>
          {coursename || 'Course not available'}
        </Text>
        <Text style={styles.infoText}>
          Reg No: {regno || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          University Roll No: {universityrollno || 'N/A'}
        </Text>
        
        <View style={styles.dateRow}>
          <Image 
            source={require('../assets/calender.png')} 
            style={styles.calendarIcon} 
            resizeMode="contain"
          />
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: verticalScale(200), // Increased height to accommodate multiple lines
    minHeight: 170, // Increased minimum height
    backgroundColor: '#ffffff',
    marginBottom: verticalScale(5),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    flexDirection: 'row',
    alignItems: "flex-start", // Changed to flex-start for better text alignment
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02, // Added vertical padding
    borderWidth: moderateScale(2),
    borderColor: '#00517c',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileImage: {
    width: width * 0.22,
    height: width * 0.22,
    minWidth: 70,
    minHeight: 70,
    maxWidth: 100,
    maxHeight: 100,
    borderWidth: moderateScale(2),
    borderColor: '#fff',
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    marginTop: verticalScale(8), // Added top margin for better alignment
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  detailsContainer: {
    flex: 1,
    marginLeft: width * 0.04,
    justifyContent: 'flex-start',
  },
  emailText: {
    fontSize: RFValue(16, 680),
    fontWeight: '900',
    color: '#00517c',
    marginBottom: verticalScale(3),
    includeFontPadding: false,
    flexWrap: 'wrap', // Allow text to wrap to next line
    flexShrink: 1, // Allow text to shrink and wrap
  },
  courseText: {
    fontSize: RFValue(13, 680),
    fontWeight: '700',
    color: '#00517c',
    marginBottom: verticalScale(3),
    includeFontPadding: false,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  infoText: {
    fontSize: RFValue(12, 680),
    fontWeight: '600',
    color: '#00517c',
    marginBottom: verticalScale(2),
    includeFontPadding: false,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  calendarIcon: {
    width: RFValue(14),
    height: RFValue(14),
    tintColor: '#00517c',
  },
  dateText: {
    fontSize: RFValue(12, 680),
    fontWeight: '700',
    color: '#00517c',
    marginLeft: moderateScale(8),
    includeFontPadding: false,
  },
})

export default Header