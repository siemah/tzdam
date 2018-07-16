import React, { Component } from 'react';
import { 
  Animated, 
  Dimensions, 
  View, 
  TouchableOpacity, 
  Text, 
  BackHandler,
  ViewPagerAndroid,
  ScrollView, 
  Picker,
  TouchableNativeFeedback,
  Alert,
  AsyncStorage
} from 'react-native'
import { createBottomTabNavigator,  } from 'react-navigation';
// import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Settings from './Settings';
import Main from './Main';
import CustomModal from './components/CustomModal';
import InputField from './components/InputField'

import httpFetch from '../assets/include/fetch'
const APIURL = 'http://192.168.1.39:8888';

const { height, width } = Dimensions.get('window')

const HomeTabNavigator = createBottomTabNavigator (
  {
  Buy: { screen: Settings },
  Home: Main,
  }, 
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return null;
      },
      
    }),
    tabBarOptions: {
      activeTintColor: '#1dd1a1',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: 'rgba(255,255,255,.85)',
        borderWidth: 0,
        borderColor: "rgba(255,255,255,.85)",
        position: 'absolute',
        bottom: 0,
        height: 40,
        width: '100%',
      },
      showIcon:true,
      showLabel: false
    },
  });

export default class Home extends Component {

  state = {
    initialRoute: 'Home',
    top: new Animated.Value( height ),
    transactionModalIsShowed: false,
    somme: 0,
    cardType: 'pnb',
    securityCode: null,
    cardNumSender: null,
    cardNumReceiv: null,
    ID: null,
    initialPage: 0,
  }

  componentWillMount = () => {
    BackHandler.addEventListener('hardwawreBackPress', () => {
      if( this.state.transactionModalIsShowed ) {
        this._onToggleTransactionModal();
        return true;
      }
      return false;
    })
  }

  componentWillMount  = () => {
    BackHandler.removeEventListener('hardwawreBackPress');
  }

  _onToggleTransactionModal = () => {
    Animated.timing(
      this.state.top,
      {
        duration: 250,
        toValue: this.state.transactionModalIsShowed? height : 0
      }
    ).start();
    this.setState({transactionModalIsShowed: !this.state.transactionModalIsShowed})
  }

  _onSetRoute = initialRoute => this.setState({
    initialRoute
  })
  

  _onPressOk = () => {
    this._transferSlider.setPage(0);
    this.setState({ initialPage: 0 })

  }

  _onTransferMoney = async () => {
    let token = await AsyncStorage.getItem('__token__id__')
    let { cardNumSender, cardNumReceiv, cardType, somme, ID, securityCode } = this.state;
    if (cardNumSender !== null && cardNumReceiv !== null && somme !== 0 && securityCode !== null) {
      httpFetch(APIURL + '/transfer/' + token, { cardNumSender, cardNumReceiv, cardType, somme, ID, securityCode }, 'POST')
        .then(res => {
          console.warn("object", res)
          Alert.alert(
            "Money Transfer",
            res.message,
            [{ text: 'OK', onPress: Alert.dismiss }]
          )
          this.setState({ loading: false });
        })
        .catch(e => {
          this.setState({ loading: false });
          console.warn(e)
          Alert.alert(
            "Money Transfer",
            "Transfer failed, please try again",
            [
              { text: 'Try', onPress: this._onTransferMoney },
              { text: 'Cancel', onPress: Alert.dismiss }
            ]
          )
        })
    } else {
      Alert.alert(
        'Check fields?',
        'Check your inputs something it\' wrong!',
        [
          { text: 'OK', onPress: this._onPressOk },
          { text: 'Try', onPress: this._onTransferMoney }
        ]
      )
    }
  }

  _onSetState = val => this.setState(val)

  _changePage = () => {
    this._transferSlider.setPage(this.state.initialPage === 1 ? 0 : 1);
    this.setState({ initialPage: this.state.initialPage === 1 ? 0 : 1 })
  }


  render = () => (
    <View style={{ flex: 1, borderColor: 'red', borderWidth: 0}}>

      <Settings />

      <TouchableOpacity style={{...style.btn, zIndex: 10 }} onPress={ this._onToggleTransactionModal } activeOpacity={.9}>
        {
          !this.state.transactionModalIsShowed?
            <MaterialIcons name="add" color='white' size={25} /> :
            <MaterialIcons name="arrow-downward" color='white' size={25} /> 
        }
      </TouchableOpacity>

      <HomeTabNavigator />

      <CustomModal title="Transfer" top={this.state.top} onHideModel={this._onToggleTransactionModal} >
        <View style={style.pagerContainer} >
          <ViewPagerAndroid
            pageMargin={500}
            scrollEnabled={false}
            style={style.pager}
            ref={component => this._transferSlider = component}
            initialPage={this.state.initialPage}>
            <View style={{ flexDirection: 'column' }} >
              <View style={style.payHeader} >
                <Text style={style.payLabel}>{`Sender Card Infos`.toUpperCase()}</Text>
              </View>
              <ScrollView
                keyboardShouldPersistTaps='always'
                keyboardDismissMode='interactive'
                contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', marginBottom: 0, alignItems: 'center', marginTop: 5 }} >
                <View style={{ margin: 0, position: 'relative', height: 40, width: '100%', }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={this.state.cardType}
                    style={{ height: 40, width: 150, color: "#777", position: 'absolute', left: 25, top: 5 }}
                    itemStyle={{ padding: 0, color: '#777' }}
                    onValueChange={cardType => this._onSetState({ cardType })}>
                    <Picker.Item label="BADR" value='badr' />
                    <Picker.Item label="Edahabya" value='dahabya' />
                    <Picker.Item label="BNP" value='bnp' />
                  </Picker>
                </View>
                <InputField _onChangeText={cardNumSender => this._onSetState({ cardNumSender })} underlineColor="#cdcdcd" returnType="next" placeholder='Card nombre' />
                <InputField _onChangeText={securityCode => this._onSetState({ securityCode })} underlineColor="#cdcdcd" returnType="next" placeholder='Secure code' />
                <InputField _onChangeText={ID => this._onSetState({ ID })} underlineColor="#cdcdcd" returnType="next" placeholder='ID code' />
                <View
                  style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, width: '100%', height: 60 }} >

                  <TouchableNativeFeedback
                    onPress={this._changePage}>
                    <View
                      style={{ height: 40, marginHorizontal: 5, borderRadius: 50, overflow: 'hidden', elevation: 10, backgroundColor: '#1dd1a1', alignItems: 'center', justifyContent: 'center', width: 100, }} >
                      <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }} >NEXT</Text>
                    </View>
                  </TouchableNativeFeedback>

                </View>

              </ScrollView>
            </View>
            <View>
              <View style={style.payHeader} >
                <Text style={style.payLabel}>{`Receiver Card Info `.toUpperCase()}</Text>
              </View>
              <ScrollView keyboardShouldPersistTaps='always' >
                <InputField _onChangeText={somme => this._onSetState({ somme })} underlineColor="#cdcdcd" returnType="next" placeholder='Balance to transfer' />
                <InputField _onChangeText={cardNumReceiv => this._onSetState({ cardNumReceiv })} underlineColor="#cdcdcd" returnType="next" placeholder='Card number of receiver' />
                <View
                  style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginTop: 10, width: '100%', height: 60 }} >
                  <TouchableNativeFeedback
                    onPress={this._changePage}>
                    <View
                      style={{ height: 40, marginHorizontal: 5, borderRadius: 50, overflow: 'hidden', elevation: 10, backgroundColor: '#1dd1a1', alignItems: 'center', justifyContent: 'center', width: 100, }} >
                      <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }} >PREVIOUS</Text>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    onPress={this._onTransferMoney}>
                    <View
                      style={{ height: 40, marginHorizontal: 5, borderRadius: 50, overflow: 'hidden', elevation: 10, backgroundColor: '#1dd1a1', alignItems: 'center', justifyContent: 'center', width: 100, }} >
                      <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }} >Transfer</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </ScrollView>
            </View>
          </ViewPagerAndroid>
        </View>
      </CustomModal>
    </View>
  )
}
const style = {
  btn: {
    position: 'absolute',
    backgroundColor: '#1dd1a1',
    bottom: 15,
    left: width / 2 - 20,
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
  },
  pagerContainer: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 5
  },
  pager: {
    flex: 1,
    marginBottom: 40,
  },
  payHeader: {
    backgroundColor: '#1da1d1',
    height: 45,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  payLabel: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  }
}