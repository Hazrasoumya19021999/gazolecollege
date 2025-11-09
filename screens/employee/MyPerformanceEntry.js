import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const MyPerformanceEntry = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [teacherId, setTeacherId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            loadTeacherId();
        }, [])
    );

    const handleRetry = () => {
        setLoading(true);
        setError(false);
    };

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

    return (
        <SafeAreaView style={styles.container}>
            {error ? (
                <View style={styles.centered}>
                    <Icon name="error-outline" size={50} color="red" />
                    <Text style={styles.title}>Failed to load</Text>
                    <Text style={styles.subtitle}>Check connection and try again</Text>
                    <TouchableOpacity onPress={handleRetry} style={styles.button}>
                        <Text style={styles.buttonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.webviewWrapper}>
                    {loading && (
                        <View style={styles.loading}>
                            <ActivityIndicator size="large" color="#2F80ED" />
                            <Text>Loading...</Text>
                        </View>
                    )}
                    <WebView
                        source={{ uri: `https://mcerp.in/erp/mobilewebview/MonthlyPerformanceEntryWebview.aspx?Id=0&TeacherId=${teacherId}` }}
                        onLoadEnd={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                        startInLoadingState={true}
                        javaScriptEnabled
                        domStorageEnabled
                        style={{ flex: 1 }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5 },
    button: {
        marginTop: 20,
        backgroundColor: '#2F80ED',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    webviewWrapper: { flex: 1 },
    loading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 10,
    },
});

export default MyPerformanceEntry;
