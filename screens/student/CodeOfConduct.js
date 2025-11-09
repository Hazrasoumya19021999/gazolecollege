import { StatusBar, View, ActivityIndicator, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CodeOfConduct= () => {
    const [studentid, setStudentId] = useState(0)
    const [loading, setLoading] = useState(true);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('studentid')
            if (value !== null) {
                setStudentId(value)
                console.log(value)
                await delay(3000);
                setLoading(false);
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            {
                loading ? <LoadingAnimation /> :
                    <WebView source={{ uri: 'https://www.maldacollege.ac.in/code-of-conduct-for-students.php'}}
                        injectedJavaScript={`
                            const meta = document.createElement('meta'); 
                            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); 
                            meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
                        }
                    />

            }

        </>
    )
}
function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Code Of Conduct...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {},
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
    },
})
export default CodeOfConduct