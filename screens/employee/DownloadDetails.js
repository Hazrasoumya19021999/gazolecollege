import { StatusBar, View, ActivityIndicator, Text, SafeAreaView, StyleSheet, Button  } from 'react-native'
import React, { useState, useEffect , useRef } from 'react'
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DownloadDetails = ({ route }) => {
    const { DocumentPath } = route.params;
    const [Employeeid, setEmployeeId] = useState(0)
    const [loading, setLoading] = useState(true);
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const webViewRef = useRef(null);
    useEffect(() => {
        getData()
        //handlePrint()
    }, [])

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('empid')
            if (value !== null) {
                setEmployeeId(value)
                console.log(value)
                await delay(3000);
                setLoading(false);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handlePrint = () => {
        webViewRef.current.injectJavaScript('window.print();');
    };

    return (
        <>
            {
                loading ? <LoadingAnimation /> :
                    <>
                        <WebView source={{ uri: `${DocumentPath}${parseInt(Employeeid)}` }}
                         ref={webViewRef}
                            // injectedJavaScript={`
                            // const meta = document.createElement('meta'); 
                            // meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); 
                            // meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
                            // }
                        />
                        {/* <Button title="Print" onPress={handlePrint} /> */}
                    </>

            }

        </>
    )

}
function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Document...</Text>
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

export default DownloadDetails