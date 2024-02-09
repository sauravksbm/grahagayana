import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import CustomerLogin from '../screens/CustomerLogin';
import ProviderLogin from '../screens/ProviderLogin';
import Signup from '../screens/Signup';
import DrawerNavigator from './DrawerNavigator';
import ForgetPassword from '../screens/provider/ForgetPassword';
import ProviderHome from '../screens/provider/ProviderHome';
import OrderHistory from '../screens/provider/OrderHistory';
import ProviderChat from '../screens/provider/ProviderChat';
import ChatRequest from '../screens/provider/ChatRequest';
import Logout from '../screens/Logout';
import AstrologerLogin from '../screens/provider/AstrologerLogin';
import Otp from '../screens/customer/Otp';
import AstrologerLIst from './AstrologerLIst';
import AstrologerDetailes from '../screens/customer/AstrologerDetailes';
import AllRemedies from '../screens/customer/AllRemedies';
import Wallet from '../screens/customer/Wallet';
import BillHistory from '../screens/customer/BillHistory';
import CustomerOrderHistory from '../screens/customer/CustomerOrderHistory';
import Following from '../screens/customer/Following';
import HowUse from '../screens/customer/HowUse';
import AskAstrologer from '../screens/customer/AskAstrologer';
import Testimonials from '../screens/customer/Testimonials';
import HelpSupport from '../screens/customer/HelpSupport';
import Setting from '../screens/customer/Setting';
import Kundli from './Kundli';
import Matching from './Matching';
import Live from './Live';
import SelectSign from '../screens/customer/SelectSign';
import TotalCard from './TotalCard';
import ChatIntakeForm from '../screens/customer/ChatIntakeForm';
import PlaceOfBirth from '../screens/customer/PlaceOfBirth';
import ChatPickup from '../screens/customer/ChatPickup';
import CustomerChat from '../screens/customer/CustomerChat';
import CallIntakeForm from '../screens/customer/CallIntakeForm';
import {
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ChatRating from '../screens/customer/ChatRating';
import ChatInvoice from '../screens/customer/ChatInvoice';
import AstroDateRegister from '../screens/customer/AstroDateRegister';
import AstroAccount from '../screens/customer/AstroAccount';
import ChoosePlan from '../screens/customer/ChoosePlan';
import ConnectWithFriends from './ConnectWithFriends';
import ShowKundli from '../screens/customer/ShowKundli';
import KundliMatch from '../screens/customer/KundliMatch';
import ShowHoroscope from '../screens/customer/ShowHoroscope';
import TarotCard from '../screens/customer/TarotCard';
import OneCardReading from '../screens/customer/OneCardReading';
import CustomerAccount from '../screens/customer/CustomerAccount';
import UserGuide from '../screens/customer/UserGuide';
import BlogDetailes from '../screens/customer/BlogDetailes';
import RecommendedProfile from '../screens/customer/RecommendedProfile';
import CallInvoice from '../screens/customer/CallInvoice';
import Notifications from '../screens/customer/Notifications';
import NotificationDetailes from '../screens/customer/NotificationDetailes';
import VerifiedAstrologer from '../screens/provider/VerifiedAstrologer';
import ProviderRemedies from './ProviderRemedies';
import AstrologerWallet from '../screens/provider/AstrologerWallet';
import ProviderFollowing from '../screens/provider/ProviderFollowing';
import ProviderOffer from '../screens/provider/ProviderOffer';
import ProviderProfile from '../screens/provider/ProviderProfile';
import ProviderChatPickup from '../screens/provider/ProviderChatPickup';
import AstrodateChat from '../screens/customer/AstrodateChat';
import AstroLive from '../screens/customer/AstroLive';
import LiveNow from '../screens/provider/LiveNow';
import HostPage from '../screens/provider/HostPage';
import HostLive from '../screens/provider/HostLive';
import editkundli from '../screens/customer/editkundli';
import CallRating from '../screens/customer/CallRating';
import KundliProvider from '../screens/provider/KundliProvider';
import ShowDashna from '../screens/customer/ShowDashna';
import PhoneView from '../screens/customer/PhoneView';
import HowToScreenshots from '../screens/customer/HowToScreenshots';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import HowToVideo from '../screens/customer/HowToVideo';
import ViewRemedies from '../screens/customer/ViewRemedies';
import downloadKundli from './DownloadKundli';
import AstrologerSignUp from '../screens/provider/AstrologerSignUp';
import Webpage from '../screens/customer/Webpage';
import AddNote from '../screens/customer/AddNote';
import HomeNotes from '../screens/customer/HomeNotes';
import Trash from '../screens/customer/Trash';
import UpdateNote from '../screens/customer/UpdateNote';
import Religion from '../screens/customer/Religion';
import DailyPanchang from '../screens/customer/DailyPanchang';
import BirhatHoroscope from '../screens/customer/BirhatHoroscope';
import Magazine from '../screens/customer/Magazine';
import Remedies from '../screens/customer/Remedies';
import Language from '../screens/language/language';
import AstrologerSignUpUser from '../screens/provider/AstrologerSignUpUser';
import YellowBook from '../screens/customer/YellowBook';
import AuspicionsTime from '../screens/customer/AuspicionsTime';
import AskQuestion from '../screens/customer/AskQuestions';
import { useTranslation } from 'react-i18next';
import Mobile from '../screens/Mobile';
import CategoryList from '../screens/customer/Mall/CategoryList';
import ProductDetails from '../screens/customer/Mall/ProductDetails';
import OrderAddress from '../screens/customer/Mall/OrderAddress';
import AddAddress from '../screens/customer/Mall/AddAddress';
import OrderBooking from '../screens/customer/Mall/OrderBooking';
import CustomerMallHistory from '../screens/customer/Mall/CustomerMallHistory';
import Searchpage from '../screens/customer/SearchPage';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerContent = (props) => {
  return (
    <>
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
          <Text style={{ marginBottom: 10, paddingVertical: 10, paddingTop: 25, paddingLeft: 20, fontSize: 20, borderBottomWidth: 1, borderBottomColor: "#eee" }}>Notes App</Text>
          <DrawerItemList {...props} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const StackNavigator = (data,data1) => {
  const {t} = useTranslation();
  return (
    
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen name="splash">
      {(props) => <Splash {...props} data={data} data1={data1} />}
        </Stack.Screen>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="mobile" component={Mobile} />
      <Stack.Screen name="customerLogin" component={CustomerLogin} />
      <Stack.Screen name="providerLogin" component={ProviderLogin} />
      <Stack.Screen name="signup" component={Signup} />
      <Stack.Screen
        name="home"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen name="Menus" options={{ headerShown: false }} component={() => (
          <Drawer.Navigator drawerContent={DrawerContent}>
            <Drawer.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name="Trash" component={Trash} />
          </Drawer.Navigator>
        )} /> */}
      <Stack.Screen name="forgetPassword" component={ForgetPassword} />
      <Stack.Screen name="providerHome" component={ProviderHome} />
      <Stack.Screen name="orderHistory" component={OrderHistory} />
      <Stack.Screen name="providerChat" component={ProviderChat} />
      <Stack.Screen name="chatRequest" component={ChatRequest} />
      <Stack.Screen name="logout" component={Logout} />
      <Stack.Screen name="astrologerLogin" component={AstrologerLogin} />
      <Stack.Screen name="otp" component={Otp} />
      <Stack.Screen name="astrologerList" component={AstrologerLIst} />
      <Stack.Screen name="astrologerDetailes" component={AstrologerDetailes} />
      <Stack.Screen name="allRemedies" component={AllRemedies} />
      <Stack.Screen name="wallet" component={Wallet} />
      <Stack.Screen name="billHistory" component={BillHistory} />
      <Stack.Screen
        name="customerOrderHistory"
        component={CustomerOrderHistory}
      />
      <Stack.Screen name="following" component={Following} />
      <Stack.Screen name="howUse" component={HowUse} />
      <Stack.Screen name="askAstrologer" component={AskAstrologer} />
      <Stack.Screen name="testimonials" component={Testimonials} />
      <Stack.Screen name="helpSupport" component={HelpSupport} />
      <Stack.Screen name="setting" component={Setting} />
      <Stack.Screen name="kundli" component={Kundli} />
      <Stack.Screen name="matching" component={Matching} />
      <Stack.Screen name="selectSign" component={SelectSign} />
      <Stack.Screen name="totalCard" component={TotalCard} />
      <Stack.Screen name="chatIntakeForm" component={ChatIntakeForm} />
      <Stack.Screen name="placeOfBirth" component={PlaceOfBirth} />
      <Stack.Screen name="chatPickup" component={ChatPickup} />
      <Stack.Screen name="customerChat" component={CustomerChat} options={{gestureEnabled: false}} />
      <Stack.Screen name="callIntakeForm" component={CallIntakeForm} />
      <Stack.Screen
        name="ZegoUIKitPrebuiltCallInCallScreen"
        component={ZegoUIKitPrebuiltCallInCallScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ZegoUIKitPrebuiltCallWaitingScreen"
        component={ZegoUIKitPrebuiltCallWaitingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name='chatRating' component={ChatRating} />
      <Stack.Screen name='chatInvoice' component={ChatInvoice} options={{animation: 'fade', headerShown: false, gestureEnabled: false}} />
      <Stack.Screen name='astroDateRegister' component={AstroDateRegister} />
      <Stack.Screen name='astroAccount' component={AstroAccount} />
      <Stack.Screen name='choosePlan' component={ChoosePlan} />
      <Stack.Screen name='connectWithFriends' component={ConnectWithFriends} />
      <Stack.Screen name='showKundli' component={ShowKundli} />
      <Stack.Screen name='kundliMatch' component={KundliMatch} />
      <Stack.Screen name='showHoroscope' component={ShowHoroscope} />
      <Stack.Screen name='tarotCard' component={TarotCard} />
      <Stack.Screen name='oneCardReading' component={OneCardReading} />
      <Stack.Screen name='customerAccount' component={CustomerAccount} />
      <Stack.Screen name='userGuide' component={UserGuide} />
      <Stack.Screen name='blogDetailes' component={BlogDetailes} />
      <Stack.Screen name='recommendedProfile' component={RecommendedProfile} />
      <Stack.Screen name='callInvoice' component={CallInvoice} options={{headerShown: false}}/>
      <Stack.Screen name='notifications' component={Notifications} />
      <Stack.Screen name='notificationDetailes' component={NotificationDetailes} />
      <Stack.Screen name='astrodateChat' component={AstrodateChat} />

      {/* //Prvider  */}
      <Stack.Screen name='verifiedAstrologer' component={VerifiedAstrologer} />
      <Stack.Screen name='providerRemedies' component={ProviderRemedies}  />
      <Stack.Screen name='astrologerWallet' component={AstrologerWallet} />
      <Stack.Screen name='providerFollowing' component={ProviderFollowing} />
      <Stack.Screen name='providerOffer' component={ProviderOffer} />
      <Stack.Screen name='providerProfile' component={ProviderProfile} />
      <Stack.Screen name='providerChatPickup' component={ProviderChatPickup} />

      <Stack.Screen name="live" component={Live}/>
      <Stack.Screen name="livenow" component={LiveNow} options={{animation: 'fade', headerShown: true, gestureEnabled: false}}/>
      <Stack.Screen options={{headerShown: false}} name="HostPage" component={HostPage} />
      <Stack.Screen options={{headerShown: false}} name="HostLive" component={HostLive} />
      <Stack.Screen name="editkundli" component={editkundli} />
      <Stack.Screen name="callRating" component={CallRating} />
      <Stack.Screen name="providerKundli" component={KundliProvider} />
      <Stack.Screen name="phoneView" component={PhoneView} options={{headerShown:false}} />
      <Stack.Screen name="HowToScreenshots" component={HowToScreenshots} />
      <Stack.Screen name="HowToVideo" component={HowToVideo} />
      <Stack.Screen name="ViewRememdies" component={ViewRemedies} />
      <Stack.Screen name="DownloadKundali" component={downloadKundli} />
      <Stack.Screen name="AstrologerSignUp" component={AstrologerSignUp} />
      <Stack.Screen name="Webpage" component={Webpage} />
      <Stack.Screen name="AddNote" component={AddNote} options={{ title: "New note" }} />
      <Stack.Screen name="Notes" component={HomeNotes} options={{headerShown:false}}/>
      <Stack.Screen name="UpdateNote" component={UpdateNote} options={{ title: "Note"}} />
      <Stack.Screen name="religion" component={Religion} options={{ title: t('religion1')}} />
      <Stack.Screen name="DailyPanchang" component={DailyPanchang} options={{title: t('dp1')}} />
      <Stack.Screen name="birhatHoroscope" component={BirhatHoroscope} options={{title: t('b_h')}} />
      <Stack.Screen name="magazine" component={Magazine} options={{title: t('astrokunj_magazine')}} />
      <Stack.Screen name="remedies" component={Remedies} options={{title: t('remedies')}} />
      <Stack.Screen name="yellowBook" component={YellowBook} options={{title: t('yellow_book')}} />
      <Stack.Screen name="auspicions" component={AuspicionsTime} options={{title: t('muhurat')}} />
      <Stack.Screen name="askQuestion" component={AskQuestion} options={{title: t('ask_a_question')}} />
      <Stack.Screen name="language" component={Language} />
      <Stack.Screen name="AstrologerSignUpUser" component={AstrologerSignUpUser} />

      <Stack.Screen name="categoryList" component={CategoryList} />
      <Stack.Screen name="productdetails" component={ProductDetails} />
      <Stack.Screen name="OrderAddress" component={OrderAddress} />
      <Stack.Screen name="addaddress" component={AddAddress} />
      <Stack.Screen name="OrderBooking" component={OrderBooking} />
      <Stack.Screen name="customerMallHistory" component={CustomerMallHistory} />
      <Stack.Screen name="search" component={Searchpage} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

// vDyrZdnqcvTtYK8F9BlDDDFWTaF2sk