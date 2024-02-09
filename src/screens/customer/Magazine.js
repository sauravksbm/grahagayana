import React,{useEffect,useState} from "react";
import axios from "axios";
import { Text,View,Dimensions,FlatList } from "react-native";
import MyLoader from "../../components/MyLoader";
import { api_url,get_magazine } from "../../config/Constants";
import RenderHtml from 'react-native-render-html';

const {width, height} = Dimensions.get('screen');

const Magazine = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [remediesData,setRemediesData] = useState(null);
    
    useEffect(() => {
        get_data();
    },[]);

    const get_data = () => {
        setIsLoading(true);
        axios({
            method:'get',
            url: api_url + get_magazine,
        }).then(res => {
            console.log(res.data.data);
            setRemediesData(res.data.data)
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }


    const renderItem = ({item, index}) => {
        return (
            <View style={{padding:5}} key={index}>
                <Text style={{textAlign:'center',
        fontSize:22,
        color:'white',
        fontWeight:'bold',
        backgroundColor:'#48cae4',
        padding:10,
        borderRadius:10}}>{item.title}</Text>
                <RenderHtml
                      contentWidth={320}
                      source={{
                        html: `<div style="color: black; max-width: 320px;">${item.description}</div>`,
                      }}
                    />
            </View>
        )
    }

    return(
        <View style={{padding:10,backgroundColor:'white',flex:1}}>
            <MyLoader isVisible={isLoading} />
            {remediesData && (
                <FlatList
                data={remediesData}
                renderItem={renderItem}
                contentContainerStyle={{padding: 15}}
                />
            )}            
        </View>
    )
    

}

export default Magazine;