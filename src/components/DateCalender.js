import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors, fonts} from '../config/Constants';

const DateCalender = ({
  dateVisible = false,
  setDateVisible,
  date = new Date(),
  setDate,
  mode = 'date',
  display = 'inline',
  maximumDate = null,
  minimumDate = null,
}) => {
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    // setDateVisible(false);
  };
  return (
    <Modal
      visible={dateVisible}
      transparent
      onRequestClose={() => setDateVisible(false)}>
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={() => setDateVisible(false)}
        style={{
          flex: 1,
          backgroundColor: colors.black_color9 + '80',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '95%',
            backgroundColor: colors.background_theme1,
            paddingVertical: 20,
            borderRadius: 10,
          }}>
          <DateTimePicker
            value={date}
            mode={mode}
            display={display}
            onChange={onChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
          <TouchableOpacity onPress={()=>setDateVisible(false)} style={{flex: 0, alignSelf: 'center', padding: 5}}>
            <Text style={{fontSize: 16, color: colors.background_theme2, fontFamily: fonts.medium}}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DateCalender;
