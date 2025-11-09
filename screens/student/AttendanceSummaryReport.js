import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const AttendanceSummaryReport = () => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    getStoredData();
  }, []);

  const getStoredData = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentid');
      if (studentId) {
        // Build webview URL dynamically
        const finalUrl = `https://gmg.ac.in/erp/mobilewebview/AttendanceSummaryReportWebview.aspx?StudentId=${studentId}`;
        setUrl(finalUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!url) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00517c" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: url }}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00517c" />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AttendanceSummaryReport;
