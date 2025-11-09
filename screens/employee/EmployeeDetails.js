import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../services/api';

const EmployeeDetails = ({ route, navigation }) => {
    const [loading, setLoading] = useState(false);
    const [Empid, setEmpId] = useState('');
    const [Empcode, setEmpcode] = useState('');
    const [dept, setDept] = useState('');
    const [desg, setDesg] = useState('');
    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');
    const [email, setEmmail] = useState('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState('');

    const { data } = route.params;

    useEffect(() => {
        setEmpcode(data.EmpCode)
        setDept(data.Department)
        setName(data.FirstName + ' ' + data.MiddleName + ' ' + data.LastName)
        setMobile(data.ContactNo1)
        setDesg(data.Designation)
        setEmmail(data.ContactEmail1)
        setAddress(data.PermanentAddress)
        setPhoto(data.Photo)
        setLoading(false);
    })

    // const getEmployeeData = async () => {
    //     try {
    //         const empId = await AsyncStorage.getItem('empid')
    //         console.log('EmpId', empId)
    //         console.log(`EmployeeNew/EmployeeDetails?EmployeeId=${empId}`)
    //         const employeeDetails = await getData(`Employee/EmployeeDetails?EmployeeId=${empId}`);
    //         console.log('Employee Data', employeeDetails)
    //         setEmpcode(employeeDetails.EmpCode)
    //         setDept(employeeDetails.Department)
    //         setName(employeeDetails.FirstName + ' ' + employeeDetails.MiddleName + ' ' + employeeDetails.LastName)
    //         setMobile(employeeDetails.ContactNo1)
    //         setDesg(employeeDetails.Designation)
    //         setEmmail(employeeDetails.ContactEmail1)
    //         setAddress(employeeDetails.PermanentAddress)
    //         setPhoto(employeeDetails.Photo)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }


    return (
        <ScrollView>
            {
                loading ?
                    <LoadingAnimation /> :
                    <View style={styles.container}>
                        <Image source={require('../assets/Malda3.png')} style={styles.header} />
                        <Image
                            style={styles.avatar}
                            source={{
                                uri: `${photo}`,
                            }}
                        />
                        <View style={styles.body}>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.info} >{desg}</Text>
                            <Text style={styles.info} >Mobile No :  {mobile}</Text>
                            <View style={{ marginTop: 5, marginLeft: 7, marginRight: 7 }}>
                                <View style={styles.descheader} >
                                    <Text style={styles.desc}>Employee Code</Text>
                                    <Text style={styles.descinfo}>{Empcode}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Department</Text>
                                    <Text style={styles.descinfo}>{dept}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Email Id</Text>
                                    <Text style={styles.descinfo}>{email}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Address</Text>
                                    <Text style={styles.descinfo}>{address}</Text>
                                </View>

                            </View>
                        </View>
                    </View>
            }
        </ScrollView>
    )
}
function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Profile..Please Wait...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#00BFFF',
        height: 200,
        width: '100%'
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130,
    },
    name: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00517c'
    },
    body: {
        marginTop: "17%",
    },
    info: {
        fontSize: 16,
        marginTop: 2,
        textAlign: 'center',
        color: '#000000',
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#00517c',
        padding: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    descinfo: {
        textAlignVertical: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
        fontSize: 20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        color: 'black',

    },
    descheader: {
        borderColor: '#78a6c8',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
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
})
export default EmployeeDetails