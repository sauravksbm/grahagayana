import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { colors, fonts, getFontSize } from '../config/Constants';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

const HomeHeader = ({ navigation }) => {
  const { t } = useTranslation();

  const renderHeaderIcon = (iconSource, onPress, position) => (
    <TouchableOpacity
      style={{ position: 'relative', right: position }}
      onPress={onPress}
    >
      <Image
        source={iconSource}
        style={{ height: 20, width: 25, tintColor: colors.white_color }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>

        <TouchableOpacity
          style={{ flex: 0.1 }}
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={require("../assets/images/icon/toggle.png")}
            style={{ height: 20, width: 25, tintColor: colors.white_color, position: 'relative', right: -10 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          {t('astrokunj')}
        </Text>
      </View>
        {renderHeaderIcon(
          require("../assets/images/icon/language.png"),
          () => {
            //  alert("select language")
            // Handle language icon press here
          },
          -30
        )}
        {renderHeaderIcon(
          require("../assets/images/icon/profile.png"),
          () => {
            // Handle profile icon press here
          },
          -20
        )}
        {renderHeaderIcon(
          require("../assets/images/icon/wallet.png"),
          () => {
            navigation.navigate("wallet")

            // Handle wallet icon press here
          },
          0
        )}
      </View>

  );
};

const styles = {
  container: {
    flex: 0,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.background_theme2,
  },
  title: {
    flex: 0.4,
    fontFamily: fonts.bold,
    color: colors.white_color,
    fontSize: getFontSize(1.6),
    marginLeft: 25,
  },
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
  notificationCounts: state.customer.notificationCounts,
});

export default connect(mapStateToProps)(HomeHeader);
