import React, { Component } from 'react'
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Animated, 
    KeyboardAvoidingView, 
    AsyncStorage, 
    Dimensions, 
    BackHandler, 
    Alert,
    ActivityIndicator,
    FlatList,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Drawer from './Drawer';
import Header from './components/Header';
import DrawerItem from './components/DrawerItem';
import App from '../App'
import PageHeader from './components/PageHeader';
import SettingsContent from './components/SettingsContent';
import CustomModal from './components/CustomModal';
import InputField from './components/InputField';

import httpFetch from '../assets/include/fetch'; 

const { height, width } = Dimensions.get('window');
const APIURL = 'http://192.168.1.39:8888';

export default class Settings extends Component {

    constructor() {
        super()
        this.state = {
            menuiconRotate: 0,
            left: new Animated.Value(-width),
            logOut: false,
            passwordSettingsTop: new Animated.Value(height),
            passwordModelIsShowed: false,
            historySettingsTop: new Animated.Value(height),
            oldPassword: '',
            newPassword: '',
            confirmation: '',
            transactionsHistory: [],
            token: null,
            loadingArchive: false,
            renderArchive: false
        }
        AsyncStorage.getItem('__token__id__', (err, token) => {
            this.setState({ token })
            fetch(`${APIURL}/transfer/${this.state.token}`).then(d => d.json())
                .then( results => { 
                    this.setState({ transactionsHistory: results.response, loadingArchive: false })
                }).catch(err => alert("Check network", err.message))
        });
    }

    static navigationOptions = ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            if (focused) iconSrc = require('../assets/images/home-active.png');
            else iconSrc = require('../assets/images/home.png');
            // You can return any component that you like here! We usually use an
            // icon component from react-native-vector-icons
            //return <Image source={iconSrc} style={{ width: 16, height: 16 }} />;
            return <MaterialIcons name='home' size={25} style={{ color: tintColor }} />
        },
    })

    componentDidMount = async () => {
        let token = await AsyncStorage.getItem('__token__id__')
        this.setState({ token });
    }

    componentWillMount = () => {
        // prevent a back button to close a app if modal is showed
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.passwordModelIsShowed) {
                // hide modal if back button is pressed
                this._onToggleChangePasswordModal();
                return true;
            }
            return false;
        });
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    _onPressMenu = () => {
        Animated.timing(
            this.state.left,
            {
                duration: 100,
                toValue: 0,
            }
        ).start();
    }

    _logOut = () => {
        AsyncStorage.removeItem('__token__id__', (err) => this.setState({ logOut: true}));
    }

    _onSetRoute = route => {
        Animated.timing(
            this.state.left,
            {
                duration: 100,
                toValue: -width,
            }
        ).start();
        this.props.navigation.navigate( route || 'Home');
    }

    _onToggleChangePasswordModal = () => {
        Animated.timing(
            this.state.passwordSettingsTop,
            {
                duration: 200,
                toValue: this.state.passwordModelIsShowed? height : 0
            }
        ).start();
        this.setState({ passwordModelIsShowed: !this.state.passwordModelIsShowed });
    }

    _onToggleHistoryModal = () => { 
        Animated.timing(
            this.state.historySettingsTop,
            {
                duration: 200,
                toValue: this.state.passwordModelIsShowed ? height : 0
            }
        ).start();
        this.setState({ passwordModelIsShowed: !this.state.passwordModelIsShowed });
        Animated.timing(this.state.left, { toValue: -width, duration: 100 }).start()
    }

    _onChangePassword = async () => {
        let token = await AsyncStorage.getItem('__token__id__');
        let { oldPassword, newPassword, confirmation } = this.state;
        console.warn(oldPassword, newPassword, confirmation)
        httpFetch(APIURL + `/user/${token}`, { oldPassword, newPassword, confirmation }, 'POST')
            .then(res => {
                console.warn(res);
                Alert.alert(
                    'Change Password',
                    res.message,
                    [
                        { text: 'Ok', onPress: null }
                    ],
                    { cancelable: false }
                )
                this.setState({ loading: false });
            })
            .catch(e => console.warn("err ===========>", e))
    }

    componentDidMount =  () => {
        if(this.state.transactionsHistory.length > 0) {
            this.setState({renderArchive: true})
        }
    }
 

    renderArchive = ({item, index}) => {
        if( this.state.loadingArchive ) {
            return (
                <ActivityIndicator color='1dd1a1' size='large' />
            )
        }
        return (
            <View key={item.Id_paiement} id={item.Id_paiement} style={[{ marginTop: index === 0 ? 15 : 0,}, style.flatItemContainer]} >
                <View style={ style.flatItem } >
                    <MaterialIcons name='attach-money' size={20} color='grey' />
                    <Text style={{ color: '#aaa' }} >From: {item.num_Carte_Client}</Text>
                </View>
                <View style={ style.flatItem } >
                    <MaterialIcons name='attachment' size={20} color='grey' />
                    <Text style={{ color: '#aaa' }} >To: {item.num_Carte_destinataire}</Text>
                </View>
                <View style={ style.flatItem } >
                    <MaterialIcons name='date-range' size={20} color='grey' />
                    <Text style={{ color: '#aaa' }}>At: {item.date_paiement.substr(0, 10)} {item.date_paiement.substr(11, 19)}</Text>
                </View>
                <View style={style.flatItem} >
                    <MaterialIcons name='credit-card' size={20} color='grey' />
                    <Text style={{ color: '#aaa' }}>Type: {item.Type_Carte_Compte_Institution}</Text>
                </View>
            </View>
        )
    }

    render() {
        if (this.state.logOut) return (<App />);
        return (
            <LinearGradient
                start={{ x: 0.3, y: 0.0 }} end={{ x: 1.0, y: .0 }}
                locations={[0, .6, 1]} colors={['#1dd1a1', '#009688', '#1da1d1']}
                style={{ flex: 1, position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} >

                <PageHeader title="Home" _onPressMenu={this._onPressMenu}/>
                
                <SettingsContent _onChangePassword={this._onToggleChangePasswordModal} _onShowHistoryModal={this._onToggleHistoryModal} />

                <CustomModal title="Mot de Passe" top={this.state.passwordSettingsTop} onHideModel={ this._onToggleChangePasswordModal } >
                    <KeyboardAvoidingView behavior="height"  style={{paddingHorizontal: 30, flex: 1}} >
                        <InputField underlineColor='#b5b5b5' secureTextEntry _onChangeText={ value => this.setStateValue('oldPassword', value) } placeholder="Old password" />
                        <InputField underlineColor='#b5b5b5' secureTextEntry _onChangeText={ value => this.setStateValue('newPassword', value) } placeholder="New password" />
                        <InputField underlineColor='#b5b5b5' secureTextEntry _onChangeText={ value => this.setStateValue('confirmation', value) } placeholder="Confirmation" />
                        <LinearGradient
                            style={{ alignItems: "center", height: 40, padding: 5, elevation: 15, borderRadius: 50, marginTop: 20 }}
                            start={{ x: 1, y: 0 }} end={{ x: 0.0, y: 1.0 }}
                            locations={[0, 1]} colors={['#1da1d1', '#1dd1a1']}>
                            <TouchableOpacity activeOpacity={1} onPress={ this._onChangePassword } style={{ alignContent: 'center', width: '100%', height: '100%' }} >
                                <Text style={{ fontWeight: '500', fontSize: 18, color: "white", textAlign: 'center', }} >Change</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </KeyboardAvoidingView>
                </CustomModal>

                <CustomModal title="Transaction history" top={this.state.historySettingsTop} onHideModel={this._onToggleHistoryModal} >
                    <FlatList
                        data={ this.state.transactionsHistory}
                        renderItem={ this.renderArchive }
                    />
                </CustomModal>

                <Drawer left={this.state.left} _onPress={() => Animated.timing(this.state.left, { toValue: -width, duration: 100 }).start()}>
                    <View style={{ flex: 1, width: "70%", backgroundColor: "white" }} >
                        <Header transform='-5' title="TZDAM." style={{ backgroundColor: 'white' }} />
                        <DrawerItem
                            title="Home"
                            containerStyle={style.btnContainerStyle}
                            color="#1dd1a1"
                            iconName="home"
                            imgStyle={{ marginHorizontal: 10 }}
                            _onPressItem={ () => this._onSetRoute('Settings') } />
                        <DrawerItem
                            title="Transfer"
                            containerStyle={style.btnContainerStyle}
                            color="#1dd1a1"
                            iconName="attach-money"
                            imgStyle={{ marginHorizontal: 10 }}
                            _onPressItem={() => this._onSetRoute('Home') } />
                        <DrawerItem
                            title="Histoy"
                            containerStyle={style.btnContainerStyle}
                            color="#1dd1a1"
                            iconName="archive"
                            imgStyle={{ marginHorizontal: 10 }}
                            _onPressItem={this._onToggleHistoryModal} />
                        <DrawerItem
                            title="Logout"
                            containerStyle={style.btnContainerStyle}
                            color="#1dd1a1"
                            iconName="arrow-back"
                            imgStyle={{ marginHorizontal: 10 }}
                            _onPressItem={this._logOut} />
                    </View>
                </Drawer>
            </LinearGradient>
        )
    }

    setStateValue( input, value ) {
        let data = {};
        data[input] = value;
        this.setState( data );
    }
}



const style = {
    btnContainerStyle: { 
        height: 40, 
        paddingVertical: 5, 
    },
    flatItemContainer: { paddingVertical: 10, backgroundColor: '#f5f5f5', elevation: 2, flexDirection: 'column', flexWrap: 'wrap', width: '100%', marginBottom: 20},
    flatItem: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 15 }
}