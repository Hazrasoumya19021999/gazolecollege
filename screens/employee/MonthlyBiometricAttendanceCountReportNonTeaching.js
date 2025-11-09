import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MonthlyBiometricAttendanceCountReportNonTeaching = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Failed to load report</Text>
        <TouchableOpacity onPress={handleRetry} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading report...</Text>
        </View>
      )}
      <WebView
        source={{ uri: 'https://mcerp.in/erp/mobilewebview/EmployeeBiometricAttendanceCountReportInDetailsNewWebview.aspx' }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, marginBottom: 16 },
  button: { backgroundColor: '#2F80ED', padding: 12, borderRadius: 6 },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default MonthlyBiometricAttendanceCountReportNonTeaching;
