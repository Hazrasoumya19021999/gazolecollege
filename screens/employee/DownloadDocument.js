import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { getData } from '../services/api';
import { Alert } from 'react-native';

const DownloadDocument = () => {
    const navigation = useNavigation()
    const [studentid, setStudentId] = useState(0)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoredData()
        // const value = AsyncStorage.getItem('studenttokenid')
        // console.log(value)
    }, [])

    const getStoredData = async () => {
        try {
            // UserType 1 for student and UserType 2 for Employee
            const result = await getData(`StudentReactNative/App_DownloadMaster_GetByUserType?UserType=2`)
            if (result != "No Data Found") {
                setData(result)
                //console.log(result)
                setLoading(false);
            } else {
                setLoading(false);
              //  setData([])
                Alert.alert("No Data Found");
            }

        } catch (e) {
            console.log(e)
        }
    }

    function Download(_itemDocumentPath) {
        navigation.navigate('Download Details', {
            DocumentPath: _itemDocumentPath
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <FlatList
                        data={data}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => Download(item.DownloadLink)} style={{
                                    backgroundColor: '#fff', shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 10,
                                    borderRadius: 10,
                                    marginBottom: 10
                                }} >
                                    <View style={{ borderColor: '#00517c', borderWidth: 1, margin: 5, borderRadius: 5 }}>

                                        <View >
                                            <Text style={styles.noticetitle}>{item.DownloadTitle}</Text>
                                            <Text style={styles.noticenumber} >Click To Print/Download PDF{item.NoticeNumber}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>}
                    />
            }
        </SafeAreaView>
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
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    noticeoutline: {

    },
    noticedate: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5
    },
    noticetitle: {
        marginVertical: 5,
        fontSize: 23,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 'bold',
        color: '#00517c'
    },
    noticenumber: {
        marginVertical: 5,
        fontSize: 16,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#000',
        fontWeight: 'bold'
    },
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
});

export default DownloadDocument