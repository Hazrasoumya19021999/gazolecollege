import React, { useState, useCallback } from 'react';  // Import useCallback from React
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const EmployeeBiometricAttendanceReportInDetails1 = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [teacherId, setTeacherId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            loadTeacherId();
        }, [])
    );

    const loadTeacherId = async () => {
        try {
            setLoading(true);
            setError(false);
            const id = await AsyncStorage.getItem('empid');
            if (id) {
                setTeacherId(id);
            } else {
                setError(true);
            }
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setError(false);
        loadTeacherId();
    };

    if (error) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.errorText}>Failed to load the report.</Text>
                <TouchableOpacity onPress={handleRetry} style={styles.button}>
                    <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {loading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            )}
            {teacherId && (
                <WebView
                    source={{ uri: `https://mcerp.in/erp/mobilewebview/EmployeeBiometricAttendanceReportInDetails1Webview.aspx?TeacherId=0&Page=DailyReport` }}
                    onLoadEnd={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: { fontSize: 16, marginBottom: 12 },
    button: { backgroundColor: '#0000ff', padding: 10, borderRadius: 5 },
    buttonText: { color: '#fff' },
});

export default EmployeeBiometricAttendanceReportInDetails1;