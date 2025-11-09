import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const EmployeeHeader = () => {
    const [name, setName] = useState('')
    const [desg, setDesig] = useState('')
    const [photo, setPhoto] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        console.log(1)
        getData()
    }, [])

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('firstname')
            const value1 = await AsyncStorage.getItem('middlename')
            const value2 = await AsyncStorage.getItem('lastname')
            const value3 = await AsyncStorage.getItem('designation')
            const value4 = await AsyncStorage.getItem('EmpPhoto')
            const value5 = await AsyncStorage.getItem('department')

            if (value !== null || value1 != null && value2 != null && value4 != null) {
                console.log(value)
                console.log(value1)
                console.log(value2)
                setName(value + ' ' + value2)
                setDesig(value3)
                setPhoto(value4)
                setDepartment(value5)
            }
        } catch (e) {
            console.log(e)
        }
    }
    const getCurrentDate = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        return date + '-' + month + '-' + year;
    }
    return (
        <View style={styles.header}>
            <Image source={{
                uri: `${photo}`,
            }} style={{
                width: 80,
                height: 90,
                borderWidth: 3,
                borderColor: '#fff',
                marginLeft: 25,
                borderRadius: 90,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 10
            }} />
            <View style={{ marginLeft: '5%', marginRight: '25%' }}>
                <Text style={{ fontSize: RFValue(18, 680), fontWeight: '900', color: '#00517c', marginBottom: 8, }}>{name}</Text>
                <Text style={{ fontSize: RFValue(12, 680), fontWeight: '900', color: '#00517c', marginBottom: 8 }}>{desg}</Text>
                <Text style={{ fontSize: RFValue(12, 680), fontWeight: '900', color: '#00517c', marginBottom: 8 }}>{department}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Image source={require('../assets/calender.png')} style={{ width: 30, height: 30 }} />
                    <Text style={{ fontSize: RFValue(12, 680), fontWeight: '900', color: '#00517c', marginLeft: 10 }}>{getCurrentDate()}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '25%',
        backgroundColor: '#ffffff',
        marginBottom: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        paddingTop: 30,
        borderWidth: 2,
        borderColor: '#00517c'
    },
})

export default EmployeeHeader