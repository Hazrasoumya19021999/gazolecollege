import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, StatusBar,
    Linking,
    Alert
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native';
import { getData } from '../services/api';

const AdmissionFee = () => {
    const navigation = useNavigation()
    const [studentid, SetStudentId] = useState(0)
    const [sessionid, SetSessionId] = useState(0)
    const [programmeid, SetProgrammeId] = useState(0)
    const [applicationid, SetApplicationId] = useState(0)
    const [data, Setdata] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLocalData()
    }, [])


    const getLocalData = async () => {
        try {
            const value = await AsyncStorage.getItem('studentid')
            const value1 = await AsyncStorage.getItem('admissionsessionid')
            const value2 = await AsyncStorage.getItem('programmeid')
            if (value !== null) {
                SetStudentId(value)
                SetProgrammeId(value2)
                SetSessionId(value1)
                console.log(value)
                const result = await getData(`StudentNewReactNative/usp_ADMApplicationMaster_GetAppliedCourse_ByStudentId?SessionId=${value1}&ProgrammeId=${value2}&StudentId=${value}`)
                console.log('Data', result)
                if (result != "No Data Found") {
                    SetApplicationId(result[0].ApplicationId)
                    Setdata(result)
                    setLoading(false);
                } else {
                    SetApplicationId(0)
                    Setdata([])
                    setLoading(false);
                    Alert.alert("No Data Found");
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const acknowledgementSlip = () => {

        var uri = "https://mcerp.in/erp/StudentPortal/AdmissionAcknowledgementPrintApp.aspx?DATA=" + parseInt(applicationid) + "&SessionId=" + parseInt(sessionid) + "&ProgrammeId=" + parseInt(programmeid) + "&StudentId=" + studentid;
        console.log(uri)
        Linking.openURL(uri).catch(err => console.error("Couldn't load page", err));
    }
    const paymentSlip = () => {
        var uri = "https://mcerp.in/erp/StudentPortal/AdmissionFeeMoneyReceiptForStudentApp.aspx?DATA=" + parseInt(applicationid);
        Linking.openURL(uri).catch(err => console.error("Couldn't load page", err));
    }
    return (

        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <View style={styles.container}>
                        <FlatList
                            data={data}
                            renderItem={({ item }) =>
                                <View style={{ flex: 1, marginHorizontal: 10 }}>

                                    <TouchableOpacity style={{
                                        backgroundColor: '#fff', shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 10,
                                        borderRadius: 10,
                                        marginBottom: 10
                                    }} >
                                        <View style={{ borderColor: '#00517c', borderWidth: 1, margin: 5, borderRadius: 5 }}>

                                            <View >
                                                <Text style={styles.noticetitle}>{item.CourseName}</Text>
                                                <Text style={styles.noticenumber} >Application Code : {item.ApplicationCode}</Text>
                                                <View style={styles.noticedate}>
                                                    <Text>Admission Date : {item.AdmissionDate.substr(0, 10)}</Text>
                                                    <Text>Amount Paid : {item.PaidAdmissionAmount}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                        {applicationid != 0 ? (
                            <>
                                <TouchableOpacity
                                    onPress={() => acknowledgementSlip()}
                                    style={styles.btnDownload}>
                                    <Text style={styles.btnDownloadText}>Download acknowledgement slip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => paymentSlip()}
                                    style={styles.btnDownload}>
                                    <Text style={styles.btnDownloadText}>Download payment receipt</Text>
                                </TouchableOpacity>
                            </>
                        ) : ('')}

                    </View>
            }
        </SafeAreaView>
    );
}
function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Admission Fee...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noticeoutline: {

    },
    noticedate: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5,
    },
    noticetitle: {
        fontSize: 17,
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
    indicator: {},
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
    },
    btnDownload: {
        backgroundColor: '#00517c',
        padding: 15,
        marginBottom: 10,
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
    btnDownloadText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    }
});
export default AdmissionFee;