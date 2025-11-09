import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const NoticeDetails = ({ route }) => {
  const { noticeBody, noticeDate, noticeNo, DocumentPath } = route.params || {};
  const { width } = useWindowDimensions();

  // Ensure HTML content is styled properly
  const modifiedNoticeBody = `
    <html>
      <head>
        <style>
          body, p {
            color: black !important;
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <p>${noticeBody || 'No notice details available.'}</p>
      </body>
    </html>
  `;

  const source = { html: modifiedNoticeBody };

  useEffect(() => {
    console.log('DocumentPath:', DocumentPath);
  }, [DocumentPath]);

  return (
    <SafeAreaView style={styles.container}>
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/applogo.png')}
          style={{ width: 170, height: 170 }}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.noticeno}>
            {noticeNo || 'No Notice Number'}
          </Text>
          <Text style={styles.noticedate}>
            Notice Date : {noticeDate ? noticeDate.substr(0, 10) : 'N/A'}
          </Text>
        </View>

        {/* Body Section */}
        <View style={styles.body}>
          <RenderHtml contentWidth={width} source={source} />
        </View>

        {/* Attachment Section */}
        {DocumentPath ? (
          <TouchableOpacity
            onPress={() => Linking.openURL('https://gmg.ac.in/erp/Notice/' + DocumentPath)}
            style={styles.attachmentButton}
          >
            <Text style={styles.attachmentText}>
              Click Here To See Attachments
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NoticeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  header: {
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#fff',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#00517c',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  noticeno: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  noticedate: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  body: {
    borderWidth: 1,
    borderColor: '#00517c',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  attachmentButton: {
    borderColor: 'blue',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#00517c',
    alignItems: 'center',
  },
  attachmentText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
});
