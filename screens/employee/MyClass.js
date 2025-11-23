import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const MyClass = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [teacherId, setTeacherId] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

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
                setReloadKey(prev => prev + 1);
            } else {
                setError(true);
            }
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await loadTeacherId();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Icon name="error-outline" size={48} color="#EB5757" />
                    <Text style={styles.errorText}>Failed to load report</Text>
                    <Text style={styles.errorSubText}>Please check your connection and try again</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={handleRefresh}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : teacherId ? (
                <>
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#2F80ED" />
                            <Text style={styles.loadingText}>Loading report...</Text>
                        </View>
                    )}
                    <WebView
                        key={reloadKey}
                        source={{
                            uri: `https://gmg.ac.in/erp/mobilewebview/FacultyWiseClassReportWebView.aspx?TeacherId=${teacherId}`
                        }}
                        style={styles.webview}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        sharedCookiesEnabled={true}
                    />
                </>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2F80ED" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    webview: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        zIndex: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#4A5568',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#FFFFFF',
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A202C',
        marginTop: 16,
    },
    errorSubText: {
        fontSize: 14,
        color: '#718096',
        marginTop: 8,
        textAlign: 'center',
        marginHorizontal: 24,
    },
    retryButton: {
        marginTop: 24,
        backgroundColor: '#2F80ED',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MyClass;
