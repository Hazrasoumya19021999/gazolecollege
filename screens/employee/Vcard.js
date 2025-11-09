import { StatusBar, View, ActivityIndicator, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Vcard = () => {
    const [employeeId, setEmployeeId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('empid');
            if (value !== null) {
                setEmployeeId(parseInt(value));
            } else {
                console.log('No Employee ID Found');
            }
        } catch (e) {
            console.log('Error retrieving employee ID:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#00517c" translucent={true} />
            {loading ? (
                <LoadingAnimation />
            ) : (
                employeeId ? (
                    <WebView
                        source={{ uri: `https://mcerp.in/erp/Employee/EmployeeVCard.aspx?EmployeeId=${employeeId}` }}
                        injectedJavaScript={`
                            const meta = document.createElement('meta'); 
                            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); 
                            meta.setAttribute('name', 'viewport'); 
                            document.getElementsByTagName('head')[0].appendChild(meta);
                        `}
                    />
                ) : (
                    <View style={styles.indicatorWrapper}>
                        <Text style={styles.indicatorText}>Employee ID not found.</Text>
                    </View>
                )
            )}
        </>
    );
};

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" color="#00517c" />
            <Text style={styles.indicatorText}>Loading V-Card...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
        color: '#00517c'
    },
});

export default Vcard;
