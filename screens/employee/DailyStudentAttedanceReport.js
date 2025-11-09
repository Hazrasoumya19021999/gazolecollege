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

const DailyStudentAttedanceReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load report.</Text>
          <TouchableOpacity style={styles.button} onPress={handleRetry}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading report...</Text>
            </View>
          )}
          <WebView
            source={{
              uri: 'https://mcerp.in/erp/mobilewebview/DailyStudentAttendanceReportNewWebview.aspx',
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            style={styles.webview}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0000ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default DailyStudentAttedanceReport;
