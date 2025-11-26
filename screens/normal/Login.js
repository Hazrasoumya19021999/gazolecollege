import {
    View, Text, StyleSheet, TextInput, StatusBar, Image, ScrollView,
    TouchableOpacity, Alert, Modal, ActivityIndicator, BackHandler
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioForm from 'react-native-simple-radio-button';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native'
import { postData, getData } from '../services/api';

const Login = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [email, setEmail] = useState(null)
    const [pwd, setpwd] = useState(null)
    const [val, setVal] = useState('-');
    const [hidePass, setHidePass] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const radiolist = [
        { label: "Student", value: 0 },
        { label: "Employee", value: 1 },
    ];

    useEffect(() => {
        fetchLocalData()
        const backAction = () => {
            if (isFocused) {
                BackHandler.exitApp();
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [navigation, isFocused]);

    const fetchLocalData = async () => {
        const value = await AsyncStorage.getItem('stdpwd')
        const value1 = await AsyncStorage.getItem('logintype')
        const value3 = await AsyncStorage.getItem('emppwd')

        if (value1 == "Student" && value != null) {
            navigation.navigate('Parent')
        } else if (value1 == "Employee" && value3 != null) {
            navigation.navigate('Employee')
        }
    }

    const showPopupMessage = (title, message) => {
        Alert.alert(title, message, [{ text: "OK" }]);
    };

    // login api call
    const savedata = async () => {
        try {
            if (val == 0) {
                setIsLoading(true);
                const body = { UserId: 0, Email: email, Password: pwd }
                const result = await postData('studentnew/Login', body);

                console.log(result);

                if (result == "Bad Request") {
                    showPopupMessage("Student Login Failed", "Username or Password is incorrect");
                    setIsLoading(false);
                    return false;
                }
                else {
                    storeemail(result.StudentName)
                    storecode(result.StudentCode)
                    storestdpassword(result.Password)
                    storeImage(result.ImageUrl)
                    storeCoursename(result.CourseName)
                    storeRegno(result.RegistrationNo)
                    storeStudentid(result.StudentId.toString())
                    storeCompulsorySubject(result.CompulsorySubjectName)
                    storeCurrentSemester(result.CurrentSemester.toString())
                    storeCurretYear(result.CurrentYear.toString())
                    storeMobileNo(result.MobileNo)
                    storeStrudentEmail(result.Email)
                    storeSecondSubject(result.SecondSubjectName)
                    storeFirstSubject(result.FirstSubjectName)
                    storeThirdSubject(result.ThirdSubjectName)
                    storeCourseId(result.CourseId.toString())
                    storeUniversityRollNo(result.UniversityRollNo)
                    storeAdmissionSessionId(result.AdmissionSessionId.toString())
                    storeProgrammeId(result.ProgrammeId.toString())
                    StudentPresentAddress(result.StudentPresentAddress.toString())
                    StudentPermanentAddress(result.StudentPermanentAddress.toString())
                    BloodGroup(result.BloodGroup.toString())
                    FatherName(result.FatherName.toString())
                    MotherName(result.MotherName.toString())
                    AadhaarNo(result.AadhaarNo.toString())
                    Gender(result.Gender.toString())

                    storeLogintype("Student");
                    setIsLoading(false);
                    navigation.navigate('Parent')
                }
            } else if (val == 1) {
                setIsLoading(true);
                const body = { UserId: 0, Email: email, Password: pwd }
                const result = await postData('EmployeeNew/EmployeeLogin', body);
                if (result == "Bad Request") {
                    showPopupMessage("Employee Login Failed", "Username or Password is incorrect");
                    setIsLoading(false);
                    return false;
                }
                else {
                    const employeeDetails = await getData(`Employee/EmployeeDetails?EmployeeId=${result.EmployeeId}`);
                    console.log(employeeDetails);
                    storeLogintype("Employee");
                    storeBranchId(result.BranchId.toString());
                    storeDataFlow(result.DataFlow.toString());
                    storeEmpId(result.EmployeeId.toString());
                    storeEmpPassword(result.Password);
                    storeFinYrId(result.FinYrID);
                    storeEmpRole(result.EmpRole);
                    storeSesFromDate(result.SesFromDate);
                    storeSesToDate(result.SesToDate);
                    storeFirstName(result.FirstName);
                    storeMiddleName(result.MiddleName);
                    storeLastName(result.LastName);
                    storeDesignation(result.Designation);
                    storeEmpCode(result.EmpCode)
                    storeDepartment(result.Department)
                    storeEmpImage(employeeDetails.Photo)
                    setIsLoading(false);
                    navigation.navigate('Employee');
                }
            } else {
                showPopupMessage("Alert", "Please select Employee or Student");
            }
        }
        catch (error) {
            showPopupMessage("Login Failed", "Username or Password is incorrect");
            setIsLoading(false);
            return false;
        }
    }

    const Validation = () => {
        if (val == '-') {
            showPopupMessage('Alert', 'Please select Employee or Student');
            return;
        }
        else if (!email) {
            showPopupMessage('Alert', 'Please enter your user id');
            return false;
        }
        else if (!pwd) {
            showPopupMessage('Alert', 'Please enter your password');
            return false;
        }
        else {
            savedata()
        }
    }

    // all AsyncStorage functions exactly as before
    const storeAdmissionSessionId = async (value) => { try { await AsyncStorage.setItem('admissionsessionid', value) } catch (e) { } }
    const storeProgrammeId = async (value) => { try { await AsyncStorage.setItem('programmeid', value) } catch (e) { } }
    const storeUniversityRollNo = async (value) => { try { await AsyncStorage.setItem('universityrollno', value) } catch (e) { } }
    const storeVillage = async (value) => { try { await AsyncStorage.setItem('village', value) } catch (e) { } }
    const storePo = async (value) => { try { await AsyncStorage.setItem('postoffice', value) } catch (e) { } }
    const storeDistrict = async (value) => { try { await AsyncStorage.setItem('district', value) } catch (e) { } }
    const storeLogintype = async (value) => { try { await AsyncStorage.setItem('logintype', value) } catch (e) { } }
    const storeemail = async (value) => { try { await AsyncStorage.setItem('email', value) } catch (e) { } }
    const storecode = async (value) => { try { await AsyncStorage.setItem('pwd', value) } catch (e) { } }
    const storeImage = async (value) => { try { await AsyncStorage.setItem('image', value) } catch (e) { } }
    const storestdpassword = async (value) => { try { await AsyncStorage.setItem('stdpwd', value) } catch (e) { } }
    const storeCoursename = async (value) => { try { await AsyncStorage.setItem('coursename', value) } catch (e) { } }
    const storeRegno = async (value) => { try { await AsyncStorage.setItem('regno', value) } catch (e) { } }
    const storeStudentid = async (value) => { try { await AsyncStorage.setItem('studentid', value) } catch (e) { } }
    const storeCompulsorySubject = async (value) => { try { await AsyncStorage.setItem('compsubject', value) } catch (e) { } }
    const storeCurrentSemester = async (value) => { try { await AsyncStorage.setItem('currsem', value) } catch (e) { } }
    const storeCurretYear = async (value) => { try { await AsyncStorage.setItem('curryear', value) } catch (e) { } }
    const storeMobileNo = async (value) => { try { await AsyncStorage.setItem('mob', value) } catch (e) { } }
    const storeStrudentEmail = async (value) => { try { await AsyncStorage.setItem('studentemail', value) } catch (e) { } }
    const storeSecondSubject = async (value) => { try { await AsyncStorage.setItem('secondsubject', value) } catch (e) { } }
    const storeFirstSubject = async (value) => { try { await AsyncStorage.setItem('firstsubject', value) } catch (e) { } }
    const storeThirdSubject = async (value) => { try { await AsyncStorage.setItem('thirdsubject', value) } catch (e) { } }
    const storeCourseId = async (value) => { try { await AsyncStorage.setItem('CourseId', value) } catch (e) { } }
    const storeBranchId = async (value) => { try { await AsyncStorage.setItem('branchid', value) } catch (e) { } }
    const storeDataFlow = async (value) => { try { await AsyncStorage.setItem('dataflow', value) } catch (e) { } }
    const storeEmpId = async (value) => { try { await AsyncStorage.setItem('empid', value) } catch (e) { } }
    const storeEmpPassword = async (value) => { try { await AsyncStorage.setItem('emppwd', value) } catch (e) { } }
    const storeFinYrId = async (value) => { try { await AsyncStorage.setItem('finyrid', value) } catch (e) { } }
    const storeEmpRole = async (value) => { try { await AsyncStorage.setItem('emprole', value) } catch (e) { } }
    const storeSesFromDate = async (value) => { try { await AsyncStorage.setItem('sesfrmdate', value) } catch (e) { } }
    const storeSesToDate = async (value) => { try { await AsyncStorage.setItem('sestodate', value) } catch (e) { } }
    const storeFirstName = async (value) => { try { await AsyncStorage.setItem('firstname', value) } catch (e) { } }
    const storeMiddleName = async (value) => { try { await AsyncStorage.setItem('middlename', value) } catch (e) { } }
    const storeLastName = async (value) => { try { await AsyncStorage.setItem('lastname', value) } catch (e) { } }
    const storeEmpCode = async (value) => { try { await AsyncStorage.setItem('empcode', value) } catch (e) { } }
    const storeDesignation = async (value) => { try { await AsyncStorage.setItem('designation', value) } catch (e) { } }
    const storeDepartment = async (value) => { try { await AsyncStorage.setItem('department', value) } catch (e) { } }
    const StudentPresentAddress = async (value) => { try { await AsyncStorage.setItem('StudentPresentAddress', value) } catch (e) { } }
    const StudentPermanentAddress = async (value) => { try { await AsyncStorage.setItem('StudentPermanentAddress', value) } catch (e) { } }
    const BloodGroup = async (value) => { try { await AsyncStorage.setItem('BloodGroup', value) } catch (e) { } }
    const FatherName = async (value) => { try { await AsyncStorage.setItem('FatherName', value) } catch (e) { } }
    const MotherName = async (value) => { try { await AsyncStorage.setItem('MotherName', value) } catch (e) { } }
    const AadhaarNo = async (value) => { try { await AsyncStorage.setItem('AadhaarNo', value) } catch (e) { } }
    const Gender = async (value) => { try { await AsyncStorage.setItem('Gender', value) } catch (e) { } }
    const storeEmpImage = async (value) => { try { await AsyncStorage.setItem('EmpPhoto', value) } catch (e) { } }

    return (
        <LinearGradient colors={['#00517c', '#ffffff', '#0078b8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.container}>

            <StatusBar translucent={true} backgroundColor={'transparent'} />

            {/* Popup Loading Screen */}
            <Modal transparent={true} animationType="fade" visible={isLoading}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator size="large" color="#00517c" />
                        <Text style={{ marginTop: 10, color: '#00517c' }}>Loading Please Wait...</Text>
                    </View>
                </View>
            </Modal>

            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Image style={styles.image} source={require("../assets/applogo.png")} />
                    {/* <Text style={{ fontSize: 25, textAlign: 'center' }}>Learn Together Grow Together</Text> */}
                </View>

                <View style={styles.footer}>
                    <ScrollView>
                        <Text style={{ color: '#00517c', fontSize: 18, textAlign: 'center' }}>Login into your account </Text>
                        <RadioForm
                            radio_props={radiolist}
                            initial={-1}
                            formHorizontal={true}
                            buttonColor={'#00517C'}
                            animation={true}
                            selectedButtonColor={'#00517C'}
                            labelStyle={{ marginRight: 40 }}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}
                            onPress={value => setVal(value)}
                        />

                        <TextInput
                            placeholder="User Id"
                            placeholderTextColor="#666666"
                            style={styles.textInput}
                            autoCapitalize="characters"
                            onChangeText={text => setEmail(text)} />

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#666666"
                            style={styles.textInput}
                            secureTextEntry={hidePass}
                            onChangeText={text => setpwd(text)} />

                        <Text style={{ color: 'red', fontSize: 12, textAlign: 'left', paddingTop: 10 }}>*** Your Login User Id and Password will be similar to ERP Portal . </Text>

                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginTop: 20 }} onPress={() => setHidePass(!hidePass)} >
                            {hidePass ?
                                <Image source={require('../assets/unchecked.png')} style={{ width: 30, height: 30 }} /> :
                                <Image source={require('../assets/checked.png')} style={{ width: 30, height: 30 }} />}
                            <Text style={{ color: '#326789', fontSize: 17, paddingLeft: '3%' }}>Show Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.signIn} onPress={Validation}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Login</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Text
                                onPress={() => navigation.navigate("Forgot Password")}
                                style={{ color: '#326789', fontSize: 18, textAlign: 'center' }}
                            >
                                Forgotten Password ?
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { width: 150, height: 150 },
    header: {
        flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20,
        paddingBottom: 50, alignItems: 'center', paddingTop: 100
    },
    footer: {
        flex: 3, backgroundColor: '#ffffff', borderTopLeftRadius: 30,
        borderTopRightRadius: 30, paddingHorizontal: 20, paddingVertical: 30,
    },
    textInput: {
        flex: 1, paddingLeft: 10, color: 'green', borderColor: '#00517c',
        borderWidth: 1, marginTop: 20, borderRadius: 10
    },
    signIn: {
        width: '100%', height: 60, justifyContent: 'center', alignItems: 'center',
        borderRadius: 10, backgroundColor: '#00517c', marginTop: 20,
    },
    modalBackground: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#00000040',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF', height: 120, width: 200, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
})

export default Login;
