import React, { useState } from 'react';
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

const MonthlyBiometricAttendanceCountReportTeaching = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.centered}>
          <Icon name="error-outline" size={48} color="red" />
          <Text style={styles.title}>Failed to load report</Text>
          <TouchableOpacity style={styles.button} onPress={handleRefresh}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.webviewWrapper}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2F80ED" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          <WebView
            source={{
              uri: 'https://mcerp.in/erp/mobilewebview/EmployeeBiometricAttendanceCountReportInDetailswebview.aspx',
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2F80ED',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  webviewWrapper: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 8,
    color: '#333',
  },
});

export default MonthlyBiometricAttendanceCountReportTeaching;
