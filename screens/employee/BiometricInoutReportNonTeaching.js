import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';

const BiometricInoutReportNonTeaching = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Failed to load report</Text>
          <Text style={styles.errorMessage}>Check your connection and try again</Text>
          <TouchableOpacity style={styles.button} onPress={handleRefresh}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {loading && (
            <View style={styles.centerOverlay}>
              <ActivityIndicator size="large" color="#2F80ED" />
              <Text style={styles.loadingText}>Loading report...</Text>
            </View>
          )}
          <WebView
            source={{ uri: 'https://mcerp.in/erp/mobilewebview/EmployeeBiometricAttendanceReportInDetails2WebView.aspx' }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            startInLoadingState
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4A5568',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2F80ED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default BiometricInoutReportNonTeaching;
