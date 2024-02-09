import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import MyStatusBar from '../components/MyStatusbar'
import { vedic_colors, vedic_images } from '../config/Constants'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const { width, height } = Dimensions.get('screen');
const CELL_COUNT = 4;

const CustomerLogin = (props) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [otpprops, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false
    })
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: vedic_colors.white_color }}>
      <MyStatusBar backgroundColor={vedic_colors.yellow_color1} barStyle='light-content' />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback>
          <ScrollView style={{ flex: 0 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 0, margin: 15 }}>
              <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={vedic_images.login}
                  style={{ width: width * 0.7, height: width * 0.6, resizeMode: 'contain' }}
                />
              </View>
              <View style={{ flex: 0, marginTop: 20 }}>
                <Text style={{ fontSize: 18, color: vedic_colors.black_color9, fontWeight: 'bold' }}>Talk With India's Best Astrologers</Text>
                <Text style={{ fontSize: 20, color: vedic_colors.black_color9, fontWeight: 'bold', marginTop: 10 }} >At <Text style={{ color: vedic_colors.yellow_color1 }}>Vaidic Guru</Text></Text>
                <Text style={{ fontSize: 14, color: vedic_colors.black_color9, fontWeight: 'normal', marginTop: 25 }}>Please enter your mobile number to login/signup on Vaidic Guru</Text>
              </View>
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 25 }}>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 5, marginRight: 20, borderBottomColor: vedic_colors.black_color8 }}>
                  <Image
                    source={vedic_images.flag}
                    style={{ width: 25, height: 18, resizeMode: 'contain' }}
                  />
                  <Text style={{ fontSize: 14, color: vedic_colors.black_color9 }}>+91</Text>
                </View>
                <TextInput
                  // value={phoneNumber}
                  placeholder='Enter 10 digit mobile number'
                  style={{ width: '80%', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: vedic_colors.black_color8 }}
                />
              </View>
              <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ flex: 0, width: width * 0.8, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 25, backgroundColor: vedic_colors.yellow_color1, paddingVertical: 10, borderRadius: width * 0.1 }}>
                <Text style={{ fontSize: 16, color: vedic_colors.white_color, fontWeight: 'bold' }}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={{ flex: 0, marginHorizontal: 15 }} >
          <Text style={{ fontSize: 12, textAlign: 'center' }}>By Signing up, You are agree to our <TouchableOpacity><Text style={{ fontSize: 12, color: vedic_colors.yellow_color1, textDecorationLine: 'underline' }}>Terms and Use</Text></TouchableOpacity>and <TouchableOpacity><Text style={{ fontSize: 12, color: vedic_colors.yellow_color1, textDecorationLine: 'underline' }}>Privacy Policy</Text></TouchableOpacity></Text>
        </View>
        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => {
            setModalVisible(false)
          }}
        >
          <TouchableWithoutFeedback style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
              style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000050' }}>
              <View style={{ flex: 0, backgroundColor: vedic_colors.white_color, padding: 15 }}>
                <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, color: vedic_colors.black_color9, fontWeight: 'bold' }}>Verify Your Number</Text>
                  <Text style={{ fontSize: 12, textAlign: 'center', marginVertical: 15, color: vedic_colors.black_color7 }}>Enter the OTP to verify and update mobile Number we have sent OTP on Number we sent OTP on</Text>
                  <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: vedic_colors.black_color8, fontWeight: 'normal', marginRight: 8 }}>9560116872</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false)
                      }}
                    >
                      <FontAwesome name='edit' color={vedic_colors.yellow_color1} size={20} />
                    </TouchableOpacity>

                  </View>
                  <TouchableOpacity style={{ flex: 0, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: vedic_colors.black_color9, textDecorationLine: 'underline', letterSpacing: 1 }}>ENTER MANUALY</Text>
                  </TouchableOpacity>
                  <View style={{flex: 0}}>
                    <CodeField
                      ref={ref}
                      {...otpprops}
                      // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                      value={value}
                      onChangeText={setValue}
                      cellCount={CELL_COUNT}
                      rootStyle={styles.codeFieldRoot}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      renderCell={({ index, symbol, isFocused }) => (
                        <Text
                          key={index}
                          style={[styles.cell, isFocused && styles.focusCell]}
                          onLayout={getCellOnLayoutHandler(index)}>
                          {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                      )}
                    />
                  </View>
                  <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                     <Text style={{fontSize: 14, color: vedic_colors.black_color7, fontWeight: 'normal'}}>Resend OTP in </Text>
                     <Text style={{fontSize: 14, color: vedic_colors.black_color7, fontWeight: 'normal'}}>32 Seconds </Text>
                     <TouchableOpacity>
                      <Text style={{fontSize: 14, color: vedic_colors.black_color9, fontWeight: 'normal'}}>Resend</Text>
                     </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                  onPress={()=>{
                    setModalVisible(false)
                    props.navigation.navigate('signup')
                  }}
                  style={{flex: 0, width: width*0.75, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: vedic_colors.yellow_color1, marginTop: 20, borderRadius: 5}}
                  >
                    <Text style={{fontSize: 16, color: vedic_colors.white_color, fontWeight: 'normal'}}>VERIFY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </View>

  )
}

export default CustomerLogin

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 60,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#00000030',
    textAlign: 'center',
    marginRight: 5
  },
  focusCell: {
    borderColor: '#000',
  },
});