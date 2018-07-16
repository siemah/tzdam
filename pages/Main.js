import React, { Component } from 'react'
import { Text, 
  View, 
  AsyncStorage, 
  ViewPagerAndroid, 
  TouchableNativeFeedback, 
  ScrollView, 
  Picker, 
  Keyboard,
  Alert,
}
 from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import InputField from '../pages/components/InputField'
import PageHeader from './components/PageHeader';

import httpFetch from '../assets/include/fetch'
const APIURL = 'http://192.168.1.39:8888';

export default class Main extends Component {

  state = {
    token: 0,
    somme: 0,
    cardType: 'badr',
    securityCode: null,
    cardNumSender: null,
    cardNumReceiv: null,
    ID: null,
    initialPage: 0,
  }

  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      //if (focused) iconSrc = require('../assets/images/shopping-cart-active.png');
      //else iconSrc = require('../assets/images/shopping-cart.png');
      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return (<MaterialIcons
        name='shopping-cart'
        size={25}
        style={{ color: tintColor }}
      />);
    },
    drawerLabel: "Home",
    drawerIcon: ({ tintColor }) => (
      <MaterialIcons
        name='home'
        size={16}
        style={{ color: tintColor }}
      />
    )
  })

  componentDidMount = async () => {
    let token = await AsyncStorage.getItem('__token__id__');
    this.setState({ token })
  }

  _onPressOk = () => { 
    this._transferSlider.setPage(0); 
    this.setState({ initialPage: 0 })
    
  }

  _onTransferMoney = () => {
    let { cardNumSender, cardNumReceiv, cardType, somme, ID, securityCode } = this.state;
    if( cardNumSender !== null && cardNumReceiv !== null && somme !== 0 && securityCode !== null ) {
      httpFetch(`${APIURL}/transfer/${this.state.token}`, { cardNumSender, cardNumReceiv, cardType, somme, ID, securityCode }, 'POST')
        .then(res => {
          console.warn("object", res)
          Alert.alert(
            "Money Transfer",
            res.message,
            [{ text: 'OK', onPress: Alert.dismiss } ]
          )
          this.setState({ loading: false });
        })
        .catch(e => {
          this.setState({ loading: false });
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

  render() {
    return (
      <LinearGradient
        start={{ x: 0.3, y: 0.0 }} end={{ x: 1.0, y: .0 }}
        locations={[0, .6, 1]} colors={['#1dd1a1', '#009688', '#1da1d1']}
        style={style.container} >
        <PageHeader title="Settings" _onPressMenu={this._onPressMenu} />
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
      </LinearGradient>
    )
  }
}

const style = {
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
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