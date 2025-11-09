import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar,
    SafeAreaView, Image, ActivityIndicator, BackHandler,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler';
import { getData, postData } from '../services/api';

const SemWiseAttendanceReport = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [Semester, setSemester] = useState([])
    const [SemesterId, setSemesterId] = useState(0);

    var data1 = [];
    const CurrentSem = AsyncStorage.getItem('currsem')
    for (var i = 0; i >= CurrentSem; i++) {
       // console.log('start')
        data1.push("ram");

    }
    console.log(data1);
    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Select Semester
                </Text>
            );
        }
        return null;
    };


    useEffect(() => {
        bindSemester()
        const value = AsyncStorage.getItem('studenttokenid')
        //console.log(value)
    }, [])
    useEffect(() => {
        //console.log("Semester value", SemesterId)
    }, [SemesterId])

    const getStoredData = async (semesterid) => {
        try {
            const value = await AsyncStorage.getItem('studentid')
            if (value !== null && semesterid != null) {
                setLoading(true);
                console.log(`StudentReactNative/usp_StudentAttendanceReport_SemWise?StudentId=${parseInt(value)}&SemId=${parseInt(semesterid)}`)
                const result = await getData(`StudentReactNative/usp_StudentAttendanceReport_SemWise?StudentId=${parseInt(value)}&SemId=${parseInt(semesterid)}`);
                console.log('Data ',result)
                if (result != "No Data Found") {
                    setData(result)
                    setLoading(false);
                } else {
                    setData([])
                    setLoading(false);
                    Alert.alert("No Data Found");
                }

            }
        } catch (e) {
            console.log(e)
        }
    }

    //bind Semester
    const bindSemester = async () => {
        const value1 = await AsyncStorage.getItem('currsem')
        console.log(`StudentReactNative/SemesterGetAllBy_SemId?SemId=${value1}`)
        const semesterdata = await getData(`StudentReactNative/SemesterGetAllBy_SemId?SemId=${value1}`);
        console.log(semesterdata.semList)
        const semesterItems = semesterdata.semList.map((item) => ({
            label: item.SemesterName,
            value: item.SemesterId,
        }));
        setSemester(semesterItems)

        if (semesterItems.length > 0) {
            setSemesterId(semesterItems[0].value);
            getStoredData(semesterItems[0].value)
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 0 }}>
            {
                loading ?
                    <LoadingAnimation /> :
                    <View style={styles.container}>
                        <View style={styles.container1}>
                            {renderLabel()}
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={Semester}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select Semester' : '...'}
                                searchPlaceholder="Search..."
                                value={SemesterId}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setSemesterId(item.value);
                                    getStoredData(item.value)
                                    setIsFocus(false);
                                }}
                            />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.headerText}>Overall Total Class : {data.OverAllTotalClass}</Text>
                            <Text style={styles.headerText}>Overall Total Present : {data.OverAllTotalPresent}</Text>
                            <Text style={styles.headerText}>Overall Total Precentage :  {data.OverAllTotalPercentage}</Text>
                        </View>
                        <View style={styles.subheader} >
                            <Text style={styles.subheaderText}>Paper</Text>
                            <Text style={styles.subheaderText}>Total{'\n'}Class</Text>
                            <Text style={styles.subheaderText}>Total{'\n'}Present</Text>
                            <Text style={styles.subheaderText}>Total{'\n'}Precentage</Text>
                        </View>
                        <View>
                            <FlatList
                                data={data['students']}
                                renderItem={({ item }) =>
                                    <View style={styles.list}>
                                        <Text style={styles.listtext}>{item.TakePaper}</Text>
                                        <Text style={styles.listtext}>{item.TotalClass}</Text>
                                        <Text style={styles.listtext}>{item.TotalPresent}</Text>
                                        <Text style={styles.listtext}>{item.TotalPercentage}</Text>
                                    </View>
                                }
                            />
                        </View>

                    </View>

            }
        </SafeAreaView>
    )
}

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Attendance...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flex: 0,
        flexDirection: "column",
    },
    headerText: {
        color: "#00517c",
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    subheader: {
        flex: 0,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#00517c',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: -10,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderRadius: 0,
        backgroundColor: '#00517c',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        marginVertical: 10
    },
    subheaderText: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 10,
        color: '#fff'

    },
    list: {
        flex: 0,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#00517c',
        paddingHorizontal: 15,
        paddingVertical: 5,
        margin: -10,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderRadius: 0,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        marginVertical: 5
    },
    listtext: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 10,
        color: '#000'
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

    container1: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default SemWiseAttendanceReport