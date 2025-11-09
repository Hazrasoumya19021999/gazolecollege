import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native';
import { postData, getData } from '../services/api';

const Fees = () => {
    const navigation = useNavigation()
    const [studentid, SetStudentId] = useState(0)
    const [data, Setdata] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLocalData()
    }, [])

    const getLocalData = async () => {
        try {
            const value = await AsyncStorage.getItem('studentid')
            if (value !== null) {
                SetStudentId(value)
                console.log(value)
                const result = await getData(`StudentNewReactNative/StudentFeesDetails?studentid=${value}`)
                console.log(result)
                if (result != "No Data Found") {
                    Setdata(result)
                    setLoading(false);
                } else {
                    Setdata([])
                    setLoading(false);
                    Alert.alert("No Data Found");
                }

            }
        } catch (e) {
            console.log(e)
        }
    }
    function navigationToNewPage(_itemfeename, _itempaymentdate, _itembillduedate, _itembillamount, _itemdiscountamt, _itempayableamount, _itembillstatus, _feebillid, _feepaymentid) {
        navigation.navigate('Student Fees', {
            feename: _itemfeename,
            paymentdate: _itempaymentdate,
            billduedate: _itembillduedate,
            billamount: _itembillamount,
            discountamt: _itemdiscountamt,
            payableamount: _itempayableamount,
            billstatus: _itembillstatus,
            feebillid: _feebillid,
            feepaymentid: _feepaymentid
        })
    }
    function navigationToAdmissionFeePage() {
        navigation.navigate('Admission Fees')
    }
    return (
        <SafeAreaView style={{ flex: 1, marginTop: 10 }}>
            {
                loading ? <LoadingAnimation />
                    :
                    <View style={styles.container}>
                        <View style={styles.header} >
                            <Text style={styles.headerText}>Fees Name</Text>
                            <Text style={styles.headerText}>Fees Amount</Text>
                            <Text style={styles.headerText}>Status</Text>
                        </View>
                        <FlatList
                            data={data}
                            renderItem={({ item }) =>
                                <View style={{ flex: 1, marginHorizontal: 6 }}>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#fff', shadowColor: "#000", borderWidth: 1,
                                        borderColor: '#00517c',
                                        borderRadius: 5,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 10,
                                        //   marginBottom: 5,
                                        marginTop: 10,
                                    }} onPress={() => navigationToNewPage(item.FeeStructureName, item.PaymentDate, item.BillDueDate, item.BillAmount, item.DiscountAmount, item.PaybleAmount, item.BillStatus, item.FeeBillId, item.FeesPaymentId)}>
                                        <View style={{ flexDirection: 'row', borderColor: '#7092db', width: '38%' }}>
                                            <Text style={styles.noticedate}>{item.FeeStructureName}</Text>
                                            <View style={{ width: '100%' }}>
                                                <Text style={styles.noticetitle}>{item.BillAmount}</Text>
                                            </View>
                                            <View >
                                                {
                                                    item.BillStatus == "Paid" ?
                                                        <Text style={styles.listpaid}>{item.BillStatus}</Text>
                                                        :
                                                        <Text style={styles.listunpaid}>{item.BillStatus}</Text>
                                                }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                        <TouchableOpacity
                            onPress={() => navigationToAdmissionFeePage()}
                            style={{
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
                            }}>
                            <Text style={{
                                fontSize: 19,
                                color: '#fff',
                                textAlign: 'center'
                            }}>Admission Fee</Text>
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
            <Text style={styles.indicatorText}>Loading Fees Details...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#00517c',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: -2,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 0,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    headerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        paddingHorizontal: 10,
        color: '#00517c'

    },
    noticedate: {
        backgroundColor: '#00517c',
        padding: 10,
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlignVertical: 'center',

    },
    noticetitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop: 40
    },
    listpaid: {
        fontSize: 14,
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        width: '250%',
        marginTop: 40
    },
    listunpaid: {
        fontSize: 12,
        textAlign: 'center',
        color: '#e65c4f',
        fontWeight: 'bold',
        width: '250%',
        marginTop: 40
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
export default Fees;