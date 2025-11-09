import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native';
import { postData, getData } from '../services/api';

const CollegeLeavingCertificate = () => {
    const [studentCode, setStudentCode] = useState('');
    const [studentId, setStudentId] = useState('');
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLocalData()
        const value = AsyncStorage.getItem('studenttokenid')
        console.log(value)
    }, [])

    const getLocalData = async () => {
        try {
            const value = await AsyncStorage.getItem('pwd')
            const vaule1 = await AsyncStorage.getItem('studentid')
            setStudentId(vaule1)

            if (value !== null) {
                setStudentCode(value)
                const currentdata = await getData(`StudentReactNative/usp_StudentPassout_GetAll?StudentCode=${value}`)
                //console.log('DATA', currentdata)
                if (currentdata[0] != "No Data Found") {
                    setData(currentdata[0])
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

    const DownloadCertificate = () => {
        var uri = "https://mcerp.in/erp/StudentPortal/CollegeLeavingCertificate.aspx?StudentId=" + studentId;
        Linking.openURL(uri).catch(err => console.error("Couldn't load page", err));
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 10 }}>
            {
                loading ? <LoadingAnimation />
                    :
                    <View style={styles.container}>
                        <View style={styles.header}>
                            {
                                data.LibraryClearanceId != 0 ?
                                    <View>
                                        <Text style={styles.headerText}>Session : {
                                            data.AcademicSession
                                        }</Text>
                                        <Text style={styles.headerText}>Status : {
                                            data.LibraryStatus
                                        }</Text>
                                        <TouchableOpacity onPress={DownloadCertificate} style={styles.button}>
                                            <Text style={styles.buttonText}>Download Certificate</Text>
                                        </TouchableOpacity>
                                    </View>
                                    : Alert.alert("Message", "No Certificate Enabled For Now!",
                                        [
                                            { text: 'OK', onPress: () => console.log('OK Pressed') }
                                        ]
                                    )
                            }

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
            <Text style={styles.indicatorText}>Loading Certificate...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: "column",
    },
    headerText: {
        color: "#00517c",
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    button: {
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
    },
    buttonText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
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
export default CollegeLeavingCertificate