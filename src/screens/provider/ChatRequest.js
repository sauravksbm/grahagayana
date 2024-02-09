import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { vedic_colors, vedic_images } from '../../config/Constants'
import MyStatusBar from '../../components/MyStatusbar'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ChatRequest = (props) => {
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: false
        })
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: vedic_colors.white_color }}>
            <MyStatusBar backgroundColor={vedic_colors.yellow_color1} barStyle='light-content' />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name='user-circle' color={vedic_colors.black_color6} size={60} />
                    <Text style={{fontSize: 16, color: vedic_colors.black_color8, fontWeight: 'normal', marginTop: 20}}>Chirag Gautam</Text>
                </View>
                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: vedic_colors.black_color, fontWeight: 'bold' }}>Please accept the chat requested</Text>
                </View>
                <View style={{ flex: 0.2, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flex: 0, width: '40%', justifyContent: 'center', alignItems: 'center', borderRadius: 6, paddingVertical: 10, backgroundColor: vedic_colors.red_color1 }}>
                        <Text style={{ fontSize: 16, color: vedic_colors.white_color, fontWeight: 'normal' }}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 0, width: '40%', justifyContent: 'center', alignItems: 'center', borderRadius: 6, paddingVertical: 10, backgroundColor: vedic_colors.green_color2 }}>
                        <Text style={{ fontSize: 16, color: vedic_colors.white_color, fontWeight: 'normal' }}>Accept</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={vedic_images.logo}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                    <Text style={{ fontSize: 22, color: vedic_colors.black_color9, fontWeight: 'normal', marginLeft: 10 }}>Vaidic guru</Text>
                </View>
            </View>
        </View>
    )
}

export default ChatRequest