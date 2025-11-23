import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    Animated,
    Easing,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { getData, postData } from '../services/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';
import { getCurrentPosition } from 'react-native-geolocation-service';
import Geolocation from 'react-native-geolocation-service';

const { width, height } = Dimensions.get('window');

const GiveAttendance = ({ navigation }) => {
    const [code, setCode] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputs = useRef([]);
    const scrollViewRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(1.2)),
                useNativeDriver: true,
            })
        ]).start();

        if (loading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [loading]);

    const handleCodeChange = (text, index) => {
        const alphanumericText = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        const newCode = [...code];
        newCode[index] = alphanumericText;
        setCode(newCode);

        if (alphanumericText && index < 3) {
            inputs.current[index + 1].focus();
        }

        // When last digit is entered, automatically process
        if (alphanumericText && index === 3) {
            Keyboard.dismiss();
            handleSubmit(newCode.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // const handleSubmit = async (fullCode) => {
    //   if (fullCode.length !== 4) {
    //     setError('Please enter a 4-character code');
    //     return;
    //   }

    //   setLoading(true);
    //   setError('');
    //   setSuccess('');
    //   setAttendanceData(null);

    //   try {
    //     // 1. Verify the attendance code
    //     const response = await getData(`Employee/SearchStudentAttendanceDetails?Code=${fullCode}`);
    //     console.log('API Response:', response); // Debug log

    //     // Handle empty string response
    //     if (response === "") {
    //       setError('Invalid attendance code');
    //       setCode(['', '', '', '']);
    //       inputs.current[0].focus();
    //       return;
    //     }

    //     // Handle other empty/error cases
    //     if (!response || response.length === 0) {
    //       setError('No attendance found for this code');
    //       return;
    //     }


    //     const attendanceRecord = response[0];

    //     if (!attendanceRecord || attendanceRecord.IsGiven) {
    //       setError('This code has already been expired ');
    //       // setCode(['', '', '', '']);
    //       // inputs.current[0].focus();
    //       return;
    //     }

    //     setAttendanceData(attendanceRecord);

    //     // 2. Get student ID
    //     const studentId = await AsyncStorage.getItem('studentid');
    //     if (!studentId) {
    //       setError('Student ID not found');
    //       return;
    //     }

    //     // 3. Format date without time
    //     const formatDateWithoutTime = (dateString) => {
    //       if (!dateString) return dateString;
    //       return dateString.includes('T') ? dateString.split('T')[0] : dateString;
    //     };

    //     //4. Check if student is valid for this attendance
    //     const chekcbody = {
    //       SessionId: attendanceRecord.SessionId,
    //       YearId: attendanceRecord.Year,
    //       SemNo: attendanceRecord.SemNo,
    //       SubjectId: attendanceRecord.SubjectId,
    //       SubjectType: attendanceRecord.SubjectType,
    //       PeriodId: attendanceRecord.PeriodId,
    //       Paper: 0,
    //       Date: formatDateWithoutTime(attendanceRecord.AttendanceDate),
    //       TeacherId: attendanceRecord.TeacherId,
    //       DayMorning: "",
    //       SectionId: attendanceRecord.SectionId || 0,
    //       StudentId: parseInt(studentId),
    //       ProgrammeId: attendanceRecord.Programme || 0,
    //       DayMorning: attendanceRecord.DayMorning || "",
    //     };

    //     console.log('Check Body:', chekcbody); // Debug log

    //     const response1 = await postData('Employee/BindStudentCheck', chekcbody);

    //     console.log('Check Response:', response1); // Debug log

    //     try {
    //       if (response1 && response1 !== "No Data Found" && response1.length > 0) {
    //         // 4. Prepare and submit attendance
    //         const submissionData = {
    //           SessionId: attendanceRecord.SessionId,
    //           YearId: attendanceRecord.Year,
    //           SemNo: attendanceRecord.SemNo,
    //           SubjectType: attendanceRecord.SubjectType || "",
    //           SubjectId: attendanceRecord.SubjectId,
    //           SectionId: attendanceRecord.SectionId || 0,
    //           Period: attendanceRecord.PeriodId,
    //           TeacherId_FK: attendanceRecord.TeacherId,
    //           CreatedBy: attendanceRecord.TeacherId,
    //           ModifiedBy: attendanceRecord.TeacherId,
    //           AttendanceDate: formatDateWithoutTime(attendanceRecord.AttendanceDate),
    //           Date: formatDateWithoutTime(attendanceRecord.AttendanceDate),
    //           DayMorning: "",
    //           Remark: "",
    //           students: [{
    //             StudentId: parseInt(studentId),
    //             IsPresent: true
    //           }]
    //         };

    //         const submissionResponse = await postData('Employee/SaveStudentAttendance', submissionData);
    //         const message = submissionResponse?.replace(/^\d+\s*/, '') || 'Attendance submitted successfully';

    //         setSuccess(message);
    //         // setTimeout(() => {
    //         //   navigation.goBack();
    //         // }, 2000);
    //       }
    //       else {

    //       }
    //     }
    //     catch (error) {
    //       console.error("Error in response1:", error);
    //       setError('Failed to check student validity');
    //       return;
    //     }



    //   } catch (error) {
    //     console.error("Error:", error);
    //     setError(error.message || 'Failed to process attendance');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // const handleSubmit = async (fullCode) => {
    //     if (fullCode.length !== 4) {
    //         setError('Please enter a 4-character code');
    //         return;
    //     }

    //     setLoading(true);
    //     setError('');
    //     setSuccess('');
    //     setAttendanceData(null);

    //     try {
    //         // 1. Verify the attendance code
    //         const response = await getData(`EmployeeNew/SearchStudentAttendanceDetails?Code=${fullCode}`);
    //         console.log('API Response:', response);

    //         if (response === "" || !response || response.length === 0) {
    //             setError('Invalid attendance code');
    //             setCode(['', '', '', '']);
    //             //inputs.current[0].focus();
    //             return;
    //         }

    //         const attendanceRecord = response[0];

    //         if (!attendanceRecord || attendanceRecord.IsGiven) {
    //             setError('This code has already been expired');
    //             return;
    //         }

    //         // 2. Get student ID
    //         const studentId = await AsyncStorage.getItem('studentid');
    //         if (!studentId) {
    //             setError('Student ID not found');
    //             return;
    //         }

    //         // 3. Format date without time
    //         const formatDateWithoutTime = (dateString) => {
    //             if (!dateString) return dateString;
    //             return dateString.includes('T') ? dateString.split('T')[0] : dateString;
    //         };

    //         // 4. Check if student is valid for this attendance
    //         const checkBody = {
    //             SessionId: attendanceRecord.SessionId,
    //             YearId: attendanceRecord.Year,
    //             SemNo: attendanceRecord.SemNo,
    //             SubjectId: attendanceRecord.SubjectId,
    //             SubjectType: attendanceRecord.SubjectType,
    //             PeriodId: attendanceRecord.PeriodId,
    //             Paper: attendanceRecord.Paper || 0,
    //             Date: formatDateWithoutTime(attendanceRecord.AttendanceDate),
    //             TeacherId: attendanceRecord.TeacherId,
    //             DayMorning: "",
    //             SectionId: attendanceRecord.SectionId || 0,
    //             StudentId: parseInt(studentId),
    //             Programme: attendanceRecord.Programme || 0,
    //             DayMorning: attendanceRecord.DayMorning || "",
    //             CourseId: attendanceRecord.CourseId || 0,
    //         };

    //         console.log('Check Body:', checkBody);
    //         const response1 = await postData('EmployeeNew/BindStudentCheck', checkBody);
    //         console.log('Check Response:', response1);

    //         if (response1 && response1 !== "No Data Found" && response1.length > 0) {
    //             // Show attendance data only if student is valid
    //             setAttendanceData(attendanceRecord);

    //             // 5. Prepare and submit attendance
    //             const submissionData = {
    //                 SessionId: attendanceRecord.SessionId,
    //                 YearId: attendanceRecord.Year,
    //                 SemNo: attendanceRecord.SemNo,
    //                 SubjectType: attendanceRecord.SubjectType || "",
    //                 SubjectId: attendanceRecord.SubjectId,
    //                 SectionId: attendanceRecord.SectionId || 0,
    //                 Period: attendanceRecord.PeriodId,
    //                 Paper: attendanceRecord.Paper || 0,
    //                 TeacherId_FK: attendanceRecord.TeacherId,
    //                 CreatedBy: attendanceRecord.TeacherId,
    //                 ModifiedBy: attendanceRecord.TeacherId,
    //                 AttendanceDate: formatDateWithoutTime(attendanceRecord.AttendanceDate),
    //                 Date: formatDateWithoutTime(attendanceRecord.AttendanceDate),
    //                 DayMorning: "",
    //                 Remark: "",
    //                 students: [{
    //                     StudentId: parseInt(studentId),
    //                     IsPresent: true
    //                 }]
    //             };

    //             console.log('Submission Data:', submissionData);

    //             const submissionResponse = await postData('EmployeeNew/SaveStudentAttendance', submissionData);
    //             const message = submissionResponse?.replace(/^\d+\s*/, '') || 'Attendance submitted successfully';
    //             setSuccess(message);
    //         } else {
    //             setError('You are not registered for this class');
    //             setCode(['', '', '', '']);
    //             //inputs.current[0].focus();
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         setError(error.message || 'Failed to process attendance');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (fullCode) => {
        if (fullCode.length !== 4) {
            setError('Please enter a 4-character code');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        setAttendanceData(null);

        try {
            // 1. Get current location first
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "We need your location to verify attendance",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                setError('Location permission is required to submit attendance');
                return;
            }

            const position = await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            });

            const { latitude, longitude, accuracy } = position.coords;

            console.log(`EmployeeNew/SearchStudentAttendanceDetails?Code=${fullCode}&latitude=${latitude}&longitude=${longitude}&accuracy=${accuracy}`);

            // 2. Verify the attendance code with location data
            const response = await getData(
                `EmployeeNew/SearchStudentAttendanceDetails?Code=${fullCode}&latitude=${latitude}&longitude=${longitude}&accuracy=${accuracy}`
            );

            console.log('API Response:', response);

            if (response === "" || !response || response.length === 0) {
                setError('Invalid attendance code');
                setCode(['', '', '', '']);
                return;
            }

            const attendanceRecord = response[0];

            // 3. Check attendance status
            if (attendanceRecord.AttendanceStatus !== "Granted") {
                setError('Attendance not granted for this location');
                return;
            }

            if (attendanceRecord.IsGiven) {
                setError('This code has already been expired');
                return;
            }

            // 4. Get student ID
            const studentId = await AsyncStorage.getItem('studentid');
            if (!studentId) {
                setError('Student ID not found');
                return;
            }

            // 5. Format date without time
            const formatDateWithoutTime = (dateString) => {
                if (!dateString) return dateString;
                return dateString.includes('T') ? dateString.split('T')[0] : dateString;
            };

            // 6. Check if student is valid for this attendance
            const checkBody = {
                SessionId: attendanceRecord.SessionId,
                YearId: attendanceRecord.Year,
                SemNo: attendanceRecord.SemNo,
                SubjectId: attendanceRecord.SubjectId,
                SubjectType: attendanceRecord.SubjectType,
                PeriodId: attendanceRecord.PeriodId,
                Paper: attendanceRecord.Paper || 0,
                Date: formatDateWithoutTime(attendanceRecord.AttendanceDate),
                TeacherId: attendanceRecord.TeacherId,
                DayMorning: "",
                SectionId: attendanceRecord.SectionId || 0,
                StudentId: parseInt(studentId),
                Programme: attendanceRecord.Programme || 0,
                DayMorning: attendanceRecord.DayMorning || "",
                CourseId: attendanceRecord.CourseId || 0,
                Latitude: latitude,
                Longitude: longitude,
                Accuracy: accuracy
            };

            console.log('Check Body:', checkBody);
            const response1 = await postData('EmployeeNew/BindStudentCheck', checkBody);
            console.log('Check Response:', response1);

            if (response1 && response1 !== "No Data Found" && response1.length > 0) {
                // Show attendance data only if student is valid
                setAttendanceData(attendanceRecord);

                // 7. Prepare and submit attendance with location data
                const submissionData = {
                    SessionId: attendanceRecord.SessionId,
                    YearId: attendanceRecord.Year,
                    SemNo: attendanceRecord.SemNo,
                    SubjectType: attendanceRecord.SubjectType || "",
                    SubjectId: attendanceRecord.SubjectId,
                    SectionId: attendanceRecord.SectionId || 0,
                    Period: attendanceRecord.PeriodId,
                    Paper: attendanceRecord.Paper || 0,
                    TeacherId_FK: attendanceRecord.TeacherId,
                    CreatedBy: attendanceRecord.TeacherId,
                    ModifiedBy: attendanceRecord.TeacherId,
                    AttendanceDate: formatDateWithoutTime(attendanceRecord.AttendanceDate),
                    Date: formatDateWithoutTime(attendanceRecord.AttendanceDate),
                    DayMorning: "",
                    Remark: "",
                    Latitude: latitude,
                    Longitude: longitude,
                    Accuracy: accuracy,
                    students: [{
                        StudentId: parseInt(studentId),
                        IsPresent: true
                    }]
                };

                console.log('Submission Data:', submissionData);

                const submissionResponse = await postData('EmployeeNew/SaveStudentAttendanceByCode', submissionData);
                const message = submissionResponse?.replace(/^\d+\s*/, '') || 'Attendance submitted successfully';
                setSuccess(message);
            } else {
                setError('You are not registered for this class');
                setCode(['', '', '', '']);
            }
        } catch (error) {
            console.error("Error:", error);
            let errorMessage = 'Failed to process attendance';

            if (error.code === 'PERMISSION_DENIED') {
                errorMessage = 'Location permission denied';
            } else if (error.code === 'POSITION_UNAVAILABLE') {
                errorMessage = 'Could not get location';
            } else if (error.code === 'TIMEOUT') {
                errorMessage = 'Location request timed out';
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={['#f8f9fa', '#e9ecef']}
                style={styles.gradientContainer}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={[
                            styles.content,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Attendance Verification</Text>
                            <Text style={styles.subHeaderText}>
                                Enter the 4-character code provided by your instructor
                            </Text>
                        </View>

                        <View style={styles.codeContainer}>
                            {code.map((char, index) => (
                                <TextInput
                                    key={index}
                                    ref={ref => (inputs.current[index] = ref)}
                                    style={[
                                        styles.codeInput,
                                        char && styles.codeInputFilled,
                                        error && styles.codeInputError
                                    ]}
                                    keyboardType="numeric"
                                    autoCapitalize="characters"
                                    maxLength={1}
                                    value={char}
                                    onChangeText={text => handleCodeChange(text, index)}
                                    onKeyPress={e => handleKeyPress(e, index)}
                                    selectTextOnFocus
                                    editable={!loading}
                                />
                            ))}
                        </View>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="warning" size={18} color="#e74c3c" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {success ? (
                            <View style={styles.successContainer}>
                                <Ionicons name="checkmark-circle" size={18} color="#27ae60" />
                                <Text style={styles.successText}>{success}</Text>
                            </View>
                        ) : null}

                        {loading && (
                            <Animated.View style={[styles.loadingContainer, { transform: [{ scale: pulseAnim }] }]}>
                                <ActivityIndicator size="large" color="#4a90e2" />
                                <Text style={styles.loadingText}>Processing attendance...</Text>
                            </Animated.View>
                        )}

                        {attendanceData && (
                            <View style={styles.dataCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>Class Details</Text>
                                    <View style={styles.verifiedBadge}>
                                        <Ionicons name="checkmark-circle" size={18} color="#27ae60" />
                                        <Text style={styles.verifiedText}>Verified</Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                {/* <View style={styles.detailRow}>
                  <Ionicons name="key" size={20} color="#4a90e2" style={styles.detailIcon} />
                  <View>
                    <Text style={styles.detailLabel}>Attendance Code</Text>
                    <Text style={styles.detailValue}>{code.join('')}</Text>
                  </View>
                </View> */}

                                <View style={styles.detailRow}>
                                    <Ionicons name="book" size={20} color="#4a90e2" style={styles.detailIcon} />
                                    <View>
                                        <Text style={styles.detailLabel}>Subject</Text>
                                        <Text style={styles.detailValue}>{attendanceData.SubjectName}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <Ionicons name="person" size={20} color="#4a90e2" style={styles.detailIcon} />
                                    <View>
                                        <Text style={styles.detailLabel}>Teacher Name</Text>
                                        <Text style={styles.detailValue}>
                                            {attendanceData.FirstName} {attendanceData.MiddleName} {attendanceData.LastName}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <Ionicons name="time" size={20} color="#4a90e2" style={styles.detailIcon} />
                                    <View>
                                        <Text style={styles.detailLabel}>Period</Text>
                                        <Text style={styles.detailValue}>{attendanceData.PeriodName}</Text>
                                    </View>
                                </View>

                                {/* <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={20} color="#4a90e2" style={styles.detailIcon} />
                  <View>
                    <Text style={styles.detailLabel}>Session</Text>
                    <Text style={styles.detailValue}>{attendanceData.SessionName}</Text>
                  </View>
                </View> */}

                                <View style={styles.detailRow}>
                                    <Ionicons name="today" size={20} color="#4a90e2" style={styles.detailIcon} />
                                    <View>
                                        <Text style={styles.detailLabel}>Attendance Date</Text>
                                        <Text style={styles.detailValue}>
                                            {formatDate(attendanceData.AttendanceDate)}
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        )}

                        {/* <TouchableOpacity
              style={styles.helpLink}
              onPress={() => navigation.navigate('CodeHelp')}
            >
              <Text style={styles.helpText}>Having trouble with the code?</Text>
              <Ionicons name="help-circle" size={18} color="#4a90e2" />
            </TouchableOpacity> */}
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        padding: 25,
        //paddingTop: height * 0.1,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 8,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
    },
    subHeaderText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    codeInput: {
        width: 48,
        height: 64,
        borderWidth: 1.5,
        borderColor: '#dfe6e9',
        borderRadius: 12,
        marginHorizontal: 6,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: '600',
        color: '#2c3e50',
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    codeInputFilled: {
        borderColor: '#4a90e2',
        backgroundColor: '#f0f7ff',
        shadowColor: '#4a90e2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    codeInputError: {
        borderColor: '#e74c3c',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#fdecea',
        borderRadius: 8,
    },
    errorText: {
        color: '#e74c3c',
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '500',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        color: '#7f8c8d',
        fontSize: 15,
    },
    dataCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    verifiedText: {
        color: '#27ae60',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f3f5',
        marginVertical: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailIcon: {
        marginRight: 12,
    },
    detailLabel: {
        color: '#7f8c8d',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 2,
    },
    detailValue: {
        color: '#2c3e50',
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        borderRadius: 14,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#4a90e2',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 10,
    },
    helpLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    helpText: {
        color: '#4a90e2',
        fontSize: 15,
        fontWeight: '500',
        marginRight: 6,
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
    },
    successText: {
        color: '#27ae60',
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '500',
    },
});

export default GiveAttendance;