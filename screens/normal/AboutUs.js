import {
    View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView,
    Image, ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { getData } from '../services/api';

const AboutUs = () => {
    const [loading, setLoading] = useState(false);
    const [AboutUsBody, setAboutUsBody] = useState('');
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
          ${AboutUsBody}            
          </body>
        </html>
      `;

    const source = { html: modifiedNoticeBody };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getData('StudentReactNative/AboutUs');
            setAboutUsBody(result[0].AboutUsBody);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <ScrollView>
                        <View style={styles.logoContainer}>
                            <Image source={require('../assets/applogo.png')} style={styles.logo} />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.noticeno}>About Gazole Mahavidyalaya College</Text>
                        </View>

                        <View style={styles.body}>
                            <RenderHtml
                                contentWidth={width}
                                source={source}
                            />
                        </View>
                    </ScrollView>
            }
        </SafeAreaView>
    )
}

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" color="#00517c" />
            <Text style={styles.indicatorText}>Loading ...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    logo: {
        width: 170,
        height: 170
    },
    noticeno: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: 'white'
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
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
        color: '#00517c'
    },
});

export default AboutUs;
