import { View, Text, ImageBackground, Image, TouchableOpacity, BackHandler, Alert, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = (props) => {
    const [email, setEmail] = useState(null)
    const [imageurl, setprflimage] = useState(null)

    const navigation = useNavigation();

    function SignOut() {
        clearAll()
        navigation.navigate('Login')
    }
    clearAll = async () => {
        try {
            await AsyncStorage.clear()
        } catch (e) {
            // clear error
        }

        console.log('Done.')
    }


    useEffect(() => {
        getStudentData()
    }, [])
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email')
            const value2 = await AsyncStorage.getItem('image')
            console.log('data')
            console.log(value)
            console.log(value2)
            if (value !== null && value2 != null) {
                setEmail(value)
                setprflimage(value2)
            }
        } catch (e) {
            console.log(e)
        }
    }
    const getStudentData = async () => {
        try {
            const value = await AsyncStorage.getItem('email')
            const value2 = await AsyncStorage.getItem('image')
            getData()
            if (value !== null && value2 != null) {
                setEmail(value)
                setprflimage(value2)
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{}}>
                <ImageBackground
                    source={require('../assets/Malda3.png')}
                    style={{ padding: 20, marginTop: 10 }}>
                    <Image
                        source={{ uri: imageurl }}
                        style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
                    />
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 15,
                            fontFamily: 'Roboto-Medium',
                            marginBottom: 5,
                        }}>
                        {email}
                    </Text>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 0, borderTopWidth: 0, borderTopColor: '#ccc' }}>
                {/* <TouchableOpacity onPress={() => {navigation.navigate('AboutUs') }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Medium',
                                marginLeft: 5,
                                color:'black'
                            }}>
                            About College
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Change Password') }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Medium',
                                marginLeft: 5,
                                color:'black'
                            }}>
                            Change Password
                        </Text>
                    </View>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={{ paddingVertical: 15 }} onPress={SignOut}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Medium',
                                marginLeft: 5,
                                color: 'black'
                            }}>
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity> */}
                <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={SignOut}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    logoutContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' },
    logoutButton: { backgroundColor: '#ff4d4d', padding: 15, borderRadius: 10 },
    logoutText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});
export default CustomDrawer