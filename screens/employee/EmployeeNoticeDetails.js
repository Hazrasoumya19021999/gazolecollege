import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, BackHandler,
     Alert, Image, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect } from 'react'
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const EmployeeNoticeDetails = ({ route, navigation }) => {
    const { noticeBody, noticeDate, noticetitle, noticeNo, DocumentPath, publishDate } = route.params;
    const { width } = useWindowDimensions();
    const modifiedNoticeBody = `
    <html>
      <head>
        <style>
          body,p {
            color: black !important;
          }
        </style>
      </head>
      <body>
      <p>${noticeBody}</p>
        
      </body>
    </html>
  `;
    const source = {
        html: modifiedNoticeBody
    };

    useEffect(() => {
        console.log(DocumentPath)
        console.log('noticeno ', noticeNo)
        console.log('noticedate ', noticeNo)
        console.log('publishDate ', publishDate)
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Image source={require('../assets/applogo.png')} style={{ width: 170, height: 170 }} />
            </View>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>{JSON.parse(JSON.stringify(noticetitle))}</Text>
                    <Text style={styles.noticedate}>Notice Date : {JSON.parse(JSON.stringify(noticeDate.substr(0, 10)))}</Text>
                </View>
                <ScrollView style={styles.body}>
                    <Text style={styles.noticeno}>Notice No : {JSON.parse(JSON.stringify(noticeNo))}</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={source}
                        style={{ color: 'black' }}
                    />
                    <Text style={styles.publishdate}>Publish Date : {JSON.parse(JSON.stringify(noticeDate.substr(0, 10)))}</Text>
                </ScrollView>
                {
                    DocumentPath == null ? null : <>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL(DocumentPath
                            )
                        }} style={{ borderColor: 'blue', borderWidth: 1, padding: 10, margin: 10, borderRadius: 10, backgroundColor: '#00517c' }}>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>Click Here To see attachments</Text>
                        </TouchableOpacity>
                    </>
                }

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noticebody: {
        textAlign: 'justify'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: 'white'
    },
    noticeno: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    publishdate: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop:10,
        color: 'black'
    },
    noticedate: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#fff'
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    body: {
        borderWidth: 1,
        borderColor: '#00517c',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 3,
        backgroundColor: '#fff',
        color: 'black'
    }
})
export default EmployeeNoticeDetails