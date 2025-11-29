import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { pressRetentionOffset } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const FeesDetails = ({ route, navigation }) => {
    const { feename, paymentdate, billduedate, billamount, discountamt, payableamount, billstatus, feebillid, feepaymentid, feestructureid } = route.params;
    const [payment, setPayment] = useState(0);
    const [BilldueDate, setBilldueDate] = useState(0);

    useFocusEffect(
        useCallback(() => {
            console.log("FeesDetails Screen Focused / Refreshed");

            let status = JSON.stringify(billstatus).replaceAll('"', '');
            let status1 = JSON.stringify(billduedate).replaceAll('"', '');

            console.log('Bill Status:', status);
            console.log('Bill Due Date:', status1);

            if (status == "Paid") {
                setPayment(1);
            } else {
                setPayment(0);
            }

            let duedate = new Date(status1.toString().split(' ')[0]);

            if (duedate < getCurrentDate()) {
                console.log("notpay");
                setBilldueDate(0);
            } else {
                console.log("pay");
                setBilldueDate(1);
            }

        }, [billstatus, billduedate])
    );


    // useEffect(() => {
    //     let status = JSON.stringify(billstatus).replaceAll('"', '');
    //     let status1 = JSON.stringify(billduedate).replaceAll('"', '');
    //     console.log('Bill Status:', status)
    //     console.log('Bill Due Date:', status1)

    //     let string1 = "Paid"

    //     if (status == string1) {
    //         setPayment(1)
    //     } else {
    //         setPayment(0)
    //     }

    //     console.log("Bill Due Date Value:", status1.toString().split(' ')[0])
    //     console.log("Current Date:", getCurrentDate())

    //     let duedate = new Date(status1.toString().split(' ')[0]);

    //     // if (billduedate < getCurrentDate) {
    //     //     console.log("notpay")
    //     //     setBilldueDate(0)
    //     // }
    //     // else {
    //     //     console.log("pay")
    //     //     setBilldueDate(1)
    //     // }

    //     if (duedate < getCurrentDate) {
    //         console.log("notpay")
    //         setBilldueDate(0)
    //     }
    //     else {
    //         console.log("pay")
    //         setBilldueDate(1)
    //     }

    // }, []);

    const getCurrentDate = () => {

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        // console.log(date + '/' + month + '-' + year);
        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return month + '/' + date + '/' + year;//format: d-m-y;
    }

    const DoPayment = async () => {
        const StudentId = await AsyncStorage.getItem('studentid')
        if (StudentId != null) {
            var amount = JSON.stringify(payableamount).replaceAll('"', ' ');
            var feeid = JSON.stringify(feebillid).replaceAll('"', ' ');
            var uri = "https://gmg.ac.in/erp/StudentPortal/BillPayment.aspx?FeeBillId=" + feeid + "&PayableAmount=" + amount + "&StudentId=" + parseInt(StudentId) + "&FromMobileApp=1";
            console.log(uri)
            Linking.openURL(uri).catch(err => console.error("Couldn't load page", err));
        }
    }

    // const DoPayment = async () => {
    //     const StudentId = await AsyncStorage.getItem('studentid');

    //     if (StudentId != null) {
    //         var amount = JSON.stringify(payableamount).replaceAll('"', ' ');
    //         var feeid = JSON.stringify(feebillid).replaceAll('"', ' ');

    //         var uri = `https://mcerp.in/erp/StudentPortal/BillPayment.aspx?FeeBillId=${feeid}&PayableAmount=${amount}&StudentId=${parseInt(StudentId)}&FeeStructureId=${parseInt(feestructureid)}&FromMobileApp=1`;

    //         console.log(uri);

    //         navigation.navigate("PaymentWebView", { url: uri });
    //     }
    // };



    const PrintBill = () => {
        var FeepaymentId = JSON.stringify(feepaymentid).replaceAll('"', ' ');
        var uri = "https://mcerp.in/erp/StudentPortal/StudentBillPaymentReceipt.aspx?FeesPaymentId=" + FeepaymentId;
        console.log("PrintBill - ", uri)
        Linking.openURL(uri).catch(err => console.error("Couldn't load page", err));
    }
    return (
        <ScrollView>
            <View>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Fee Name</Text>
                    <Text style={styles.text}>{JSON.stringify(feename).replaceAll('"', ' ')}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Payment Date</Text>
                    <Text style={styles.text} >{JSON.stringify(paymentdate).replaceAll('"', ' ')}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Bill Due Date</Text>
                    <Text style={styles.text}>{JSON.stringify(billduedate).replaceAll('"', ' ')}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Bill Amount</Text>
                    <Text style={styles.text}>{JSON.stringify(billamount).replaceAll('"', ' ')}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Discount Amount</Text>
                    <Text>{JSON.stringify(discountamt).replaceAll('"', ' ')}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Payable Amount</Text>
                    <Text style={styles.text}>{JSON.stringify(payableamount).replaceAll('"', ' ')}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Bill Status</Text>
                    <Text style={styles.text}>{JSON.stringify(billstatus).replaceAll('"', ' ')}</Text>
                </View>
                <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>
                        * If your payment is completed, please reopen the My Fees menu to refresh the details.
                    </Text>
                </View>



            </View>
            { /* <TouchableOpacity style={styles.btnDeatils}>
                <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>Bill Details</Text>
            </TouchableOpacity> */ }
            {/* {
                payment == 0 ?
                    <TouchableOpacity style={BilldueDate == 1 ? styles.btnPayment : styles.btnDisablePayment} onPress={BilldueDate == 1 ? DoPayment : null}>
                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>Do Payment</Text>
                    </TouchableOpacity>
                    :
                    null
            } */}

            {
                payment === 0 ? (
                    <TouchableOpacity
                        style={
                            billstatus === "Unpaid"
                                ? styles.btnDisablePayment     // disable if unpaid
                                : BilldueDate === 1
                                    ? styles.btnPayment        // enable if due date ok
                                    : styles.btnDisablePayment // else disable
                        }
                        onPress={
                            billstatus === "Unpaid"
                                ? null
                                : BilldueDate === 1
                                    ? DoPayment
                                    : null
                        }
                    >
                        <Text style={{ textAlign: 'center', color: 'white' }}>Do Payment</Text>
                    </TouchableOpacity>
                ) : null
            }

            <TouchableOpacity style={styles.btnBillReceipt} onPress={PrintBill}>
                <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>Print Bill Receipt</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        borderWidth: 0,
        borderRadius: 5,
        padding: 10,
        borderColor: '#00517c',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    headertext: {
        fontSize: 20,
        borderBottomColor: '#1f7dc2',
        borderBottomWidth: 2,
        fontWeight: 'bold',
        color: '#04406b'
    },
    text: {
        fontSize: 15,
        paddingTop: 10,
        fontStyle: 'italic'
    },
    btnDeatils: {
        borderWidth: 1,
        borderColor: '#00517c',
        padding: 20,
        margin: 15,
        borderRadius: 15,
        backgroundColor: '#00517c',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    btnPayment: {
        borderWidth: 1,
        borderColor: '#00517c',
        padding: 20,
        margin: 15,
        borderRadius: 15,
        backgroundColor: '#00517c',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    btnBillReceipt: {
        borderWidth: 1,
        borderColor: '#00517c',
        padding: 20,
        margin: 15,
        borderRadius: 5,
        backgroundColor: '#00517c',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    btnDisablePayment: {
        borderWidth: 1,
        borderColor: '#bfbdb8',
        padding: 20,
        margin: 15,
        borderRadius: 15,
        backgroundColor: '#bfbdb8',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    noticeBox: {
        margin: 20,
        padding: 12,
        backgroundColor: '#ffe5e5',   // light red background
        borderLeftWidth: 5,
        borderLeftColor: '#d9534f',   // dark red
        borderRadius: 4,
    },

    noticeText: {
        fontSize: 15,
        color: '#b30000',             // strong red text
        fontWeight: '600',
        lineHeight: 20
    },

})
export default FeesDetails