import {
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { api_astrolist1, api_url, colors, fonts, get_HouseReport, get_panchang,getFontSize } from '../../../config/Constants';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import MyLoader from '../../../components/MyLoader';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
const { width, height } = Dimensions.get('screen');
import RenderHTML from 'react-native-render-html';
const RahuHouse = props => {
    console.log('pppp', props?.route?.params?.data);
    const { t } = useTranslation();

    useEffect(() => {
        props.navigation.setOptions({

        });
    }, []);

    const [randomNumber, setRandomNumber] = useState(null);

    useEffect(() => {
        // Generate a random number between 1 and 12 when the component mounts
        const randomNum = Math.floor(Math.random() * 12) + 1;
        setRandomNumber(randomNum);
    }, []);

    const renderContent = () => {
        switch (randomNumber) {
            case 1:
                return <Text>{t("rahu_house_1")}</Text>;
            case 2:
                return <Text>{t("rahu_house_2")}</Text>;
            case 3:
                return <Text>{t("rahu_house_3")}</Text>;
            case 4:
                return <Text>{t("rahu_house_4")}</Text>;
            case 5:
                return <Text>{t("rahu_house_5")}</Text>;
            case 6:
                return <Text>{t("rahu_house_6")}</Text>;
            case 7:
                return <Text>{t("rahu_house_7")}</Text>;
            case 8:
                return <Text>{t("rahu_house_8")}</Text>;
            case 9:
                return <Text>{t("rahu_house_9")}</Text>;
            case 10:
                return <Text>{t("rahu_house_10")}</Text>;
            case 11:
                return <Text>{t("rahu_house_11")}</Text>;
            case 12:
                return <Text>{t("rahu_house_12")}</Text>;
            // Add cases for 3 through 12 as needed
            default:
                return <Text>No content for this case</Text>;
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
            {/* <MyLoader isVisible={isLoading} /> */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flex: 0,
                        width: '95%',
                        alignSelf: 'center',
                        backgroundColor: '#fafdf6',
                        marginVertical: 10,
                        borderRadius: 15,
                        shadowColor: colors.black_color5,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 6
                    }}>

                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{t("rahu")}</Text>
                        <View>
                            <Text style={{ color: 'black', padding: 10, fontSize: getFontSize(1.8), textAlign: 'justify' }}>
                                {randomNumber && renderContent()}
                            </Text>
                        </View>
                    </View>




                </View>

            </ScrollView>
        </View>
    );
};

export default RahuHouse;

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,

        alignItems: 'center',
        padding: 15,
        alignSelf: 'center'
    },
    itemText: {

        fontSize: getFontSize(1.8),
        color: 'red',
        fontFamily: fonts.medium,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});
