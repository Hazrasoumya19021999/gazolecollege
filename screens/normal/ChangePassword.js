import {
    View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, StatusBar,
    SafeAreaView, Image, ActivityIndicator, BackHandler, ScrollView,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { postData, getData } from '../services/api';

const ChangePassword = () => {
    const [loading, setLoading] = useState(true);
    const [Studentid, setStudentId] = useState(0);
    const [Employeeid, setEmployeeId] = useState(0);
    const [Logintype, setLoginType] = useState('');
    const [Employeepassword, setEmployeePassword] = useState('');
    const [Studentpassword, setStudentPassword] = useState('');

    const [Oldpassword, setOldPassword] = useState('');
    const [Newpassword, setNewPassword] = useState('');
    const [Confirmpassword, setConfirmPassword] = useState('');

    useEffect(() => {
        getStoredData()
        setLoading(false);
    }, [])

    const getStoredData = async () => {
        try {
            const Stdid = await AsyncStorage.getItem('studentid')
            const empid = await AsyncStorage.getItem('empid')
            const stdpass = await AsyncStorage.getItem('stdpwd')
            const logtype = await AsyncStorage.getItem('logintype')
            const emppass = await AsyncStorage.getItem('emppwd')

            setLoginType(logtype)
            setStudentId(Stdid)
            setStudentPassword(stdpass)
            setEmployeeId(empid)
            setEmployeePassword(emppass)
            // console.log('StudentId - ', Stdid)
            // console.log('Student Password - ', stdpass)
            // console.log('Login Type - ', logtype)
            // console.log('Employee Id - ', empid)
            // console.log('Employee Password - ', emppass)
        } catch (e) {
            console.log(e)
        }
    }

    const ForgtPassword = async () => {
        // Validate mandatory fields
        if (!Oldpassword) {
            Alert.alert("Alert", "Please select current password");
            return;
        }
        if (!Newpassword) {
            Alert.alert("Alert", "Please select new password");
            return;
        }
        if (!Confirmpassword) {
            Alert.alert("Alert", "Please select confirm password");
            return;
        }
        //  setLoading(true);

        if (Logintype == 'Student') {
            if (Oldpassword != Studentpassword) {
                Alert.alert("Alert", "Current Password Doesn't match, Try Again!");
                return;
            } else {
                if (Newpassword != Confirmpassword) {
                    Alert.alert("Alert", "New Password and Confirm Password Doesn't match, Try Again!");
                    return;
                } else {
                    setLoading(true);
                    const body = {
                        EmployeeId: parseInt(Studentid),
                        Password: Newpassword,
                        UserType: Logintype
                    };
                    const result = await postData('StudentReactNative/ChangePassword', body);
                    Alert.alert("Alert", result);
                    setLoading(false);
                }
            }
        } else {
            if (Oldpassword != Employeepassword) {
                Alert.alert("Alert", "Current Password Doesn't match, Try Again!");
                return;
            } else {
                if (Newpassword != Confirmpassword) {
                    Alert.alert("Alert", "New Password and Confirm Password Doesn't match, Try Again!");
                    return;
                } else {
                    setLoading(true);
                    const body = {
                        EmployeeId: parseInt(Employeeid),
                        Password: Newpassword,
                        UserType: Logintype
                    };
                    const result = await postData('StudentReactNative/ChangePassword', body);
                    Alert.alert("Alert", result);
                    setLoading(false);
                }
            }
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <View>
                        <View style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 1,
                            padding: 10,
                            marginHorizontal: 5
                        }}>
                            <TextInput
                                placeholder='Enter Current Password...'
                                editable
                                placeholderTextColor={'black'}
                                onChangeText={(text) => setOldPassword(text)} />
                        </View>
                        <View style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 1,
                            padding: 10,
                            marginHorizontal: 5
                        }}>
                            <TextInput
                                placeholder='Enter New Password...'
                                editable
                                placeholderTextColor={'black'}
                                onChangeText={(text) => setNewPassword(text)} />
                        </View>
                        <View style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 1,
                            padding: 10,
                            marginHorizontal: 5
                        }}>
                            <TextInput
                                placeholder='Re-type New Password...'
                                editable
                                placeholderTextColor={'black'}
                                onChangeText={(text) => setConfirmPassword(text)} />
                        </View>
                        <TouchableOpacity
                            onPress={() => ForgtPassword()}
                            style={{
                                backgroundColor: '#00517c',
                                padding: 10,
                                marginBottom: 20,
                                borderRadius: 5,
                                margin: 10,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10,
                                borderColor: '#00517c',
                                borderWidth: 1
                            }}>
                            <Text style={{
                                fontSize: 19,
                                color: '#fff',
                                textAlign: 'center'
                            }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
            }
        </SafeAreaView>
    )
}
function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading ...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        alignSelf: 'center',
    },
    noticeoutline: {

    },
    noticedate: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5
    },
    noticetitle: {
        fontSize: 15,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 'bold',
        color: '#00517c'
    },
    noticenumber: {
        fontSize: 14,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#000',
        fontWeight: 'bold'
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {},
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
    },
});
export default ChangePassword;