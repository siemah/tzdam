import React, { Component } from 'react'
import { Text, View } from 'react-native'

const Header = props => (
    <View style={{ position: "relative" }} >
        <View style={[style.logoContainer, { ...props.style}]}>
            <View style={[style.triangleShape, { transform: [{ rotate: (props.transform || '-5') + 'deg' }] }]} ></View>
        </View>
        <View style={style.logo} >
            <Text style={style.logoTxt} >{ props.title }</Text>
        </View>
    </View>
);

const style = {
    logoContainer: {
        height: 150,
        backgroundColor: '#ecf0f1',
        overflow: 'visible'
    },
    logo: {
        position: "absolute",
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: "#1dd1a1",
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    logoTxt: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "bold",
    },
    triangleShape: {
        position: "absolute",
        top: 0,
        left: "-20%",
        width: '150%',
        height: 110,
        backgroundColor: "#1dd1a1",
        elevation: 20,
        zIndex: 10,
    }, 
}

export default Header;