import { View, Text,TouchableOpacity,ScrollView,StyleSheet } from 'react-native'
import React,{useEffect,useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { api_url,whaticanask,getFontSize } from '../../config/Constants';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import { useTranslation } from 'react-i18next';
const AskAstrologer = (props) => {
  const {t} = useTranslation();
  useEffect(() => {
    props.navigation.setOptions({
      title: t("What"),
      headerTintColor: colors.black_color,
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background_theme2,
        
      },
      headerTitleStyle: {
        fontSize: getFontSize(2), // Set the desired font size here
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{flex: 0}}>
          <AntDesign
            name="arrowleft"
            color={colors.black_color}
            size={getFontSize(2.5)}
          />
        </TouchableOpacity>
      ),
      // headerRight: () => (
      //   <TouchableOpacity disabled>
      //   <MaterialCommunityIcons name='gesture-tap-button' color={colors.black_color} size={30} />
      //   </TouchableOpacity>
      // ),
    }),[]});

    const [Ask,setAsk] = useState([]);
    console.log('dddd',Ask);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null);
    useEffect(() => {
      get_video();
    }, []);
    
    const get_video = () => {
      setIsLoading(true);
      axios({
        url: api_url + whaticanask,
      })
        .then((res) => {
          setIsLoading(false);
          console.log(res.data);
          setAsk(res.data.records);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    };

  return (
    <View>
      <ScrollView style={styles.container}>
        <MyLoader isVisible={isLoading} />
        {Ask && Ask.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => setExpandedItem(index === expandedItem ? null : index)}
              style={styles.itemHeader}
            >
              <Text style={styles.question}>{item.title}</Text>
            </TouchableOpacity>
            {index === expandedItem && (
              <View style={styles.itemContent}>
                <Text style={{color:colors.black_color,fontSize:14}}>{item.question}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 0,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemHeader: {
    padding: 16,
  },
  question: {
    fontSize: getFontSize(1.8),
    fontWeight: 'bold',
    color:colors.black_color
  },
  itemContent: {
    padding: getFontSize(1.6),
    color:colors.black_color,
    fontSize:12,
    backgroundColor:'#f1f1f1'
  },
});

export default AskAstrologer