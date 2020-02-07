import React from "react";
import { TouchableHighlight, TextInput, Image, View, Text, Button, Alert, StyleSheet} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCIiMiMlfrtRk-0qPSPfnerEUCPlPyF-88",
    authDomain: "allerg-eats.firebaseapp.com",
    databaseURL: "https://allerg-eats.firebaseio.com",
    projectId: "allerg-eats",
    storageBucket: "allerg-eats.appspot.com",
    messagingSenderId: "767488223051",
    appId: "1:767488223051:web:cb566cd1e20a1fb1"
};

firebase.initializeApp(firebaseConfig);

// var db = firebase.firestore();

class HomeScreen extends React.Component {
  render() {
    const {navigate} = this.props.navigation
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#0099ff'}}>
          <View style= {{top:70}}>
          <Image style={{width: 300, height: 300}} source = {require('./Allergeats_logo.png')}/>
          <View style= {{backgroundColor: 'orange', borderRadius: 20, padding: 10}}>
          <TouchableHighlight>
          <Button
            title= "Scan Barcode"
            onPress={() => navigate('Barcode')}
            color= 'white'
          />
          </TouchableHighlight>
          </View>
          </View>
        </View>
    );
  }
}

class BarcodeScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned ? undefined : (
          <Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.props.navigation.navigate('Item', {barcode: data})
  };
}

class ItemScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      barcode:this.props.navigation.state.params.barcode
    }
  }

  componentDidMount(){
    return fetch(`https://api.nutritionix.com/v1_1/item?upc=${this.state.barcode}&appId=4d5d841f&appKey=2c1010147628d92a04fdfae215e990d8`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (!responseJson.error_code){
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        })
      }

    return fetch(`https://api.barcodelookup.com/v2/products?barcode=${this.state.barcode}&formatted=y&key=u9t35zm3411hvhd8g4puprhmiv2scq`)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        image: responseJson.products[0].images[0]
      })
    })
    .catch((error) =>{
      console.error(error);
    })
    })
    }

  render() {
    return (
      this.state.dataSource ?
      <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between", alignSelf: 'stretch'}}>
      <View style = {{top: 40, justifyContent:'center'}}>
        <View style={{alignItems: "center", justifyContent: "center", paddingBottom: 30, fontWeight: 'bold'}}>
          <Image
            style={{width: 170, height: 170}}
            source={{uri: this.state.image}}
          />
          <Text style = {{fontSize:30, fontWeight: 'bold'}}> {this.state.dataSource.brand_name} {this.state.dataSource.item_name} </Text>
        </View>
        <Text style={{fontSize:15, fontWeight: 'bold'}}>Brand Name:
          <Text style = {{fontSize:15, fontWeight: "normal"}}> {this.state.dataSource.brand_name}</Text>
        </Text>
        <Text style={{fontSize:15, fontWeight: 'bold'}}>Description:
        <Text style = {{fontSize:15, fontWeight: "normal"}}> {this.state.dataSource.item_description}</Text>
        </Text>
        <Text style={{fontSize:15, fontWeight: 'bold'}}>Ingredients:
          <Text style = {{fontSize:15, fontWeight: "normal"}}> {this.state.dataSource.nf_ingredient_statement}</Text>
        </Text>
        <Button
         title="Add Review"
         onPress={() => this.props.navigation.navigate('AddReview')}
       />
      </View>
      <View style = {{flexDirection: 'row', justifyContent:'space-around', alignSelf: 'stretch', backgroundColor: 'blue', padding: 15}}>
        <Button
         title="Go to Home"
         onPress={() => this.props.navigation.navigate('Home')}
         color = 'white'
         fontStyle = 'bold'
       />
       <Button
         title="Scan Again"
         onPress={() => this.props.navigation.navigate('Barcode')}
         color= 'white'
         outline= 'true'
       />
       </View>
      </View>
       :
       <View style = {{flex: 1, alignContent:'center'}}>
       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
         <Text style = {{fontSize:30, fontStyle: "italic", paddingBottom:30}}>Item Not Found</Text>
        </View>
        <View style = {{flexDirection: 'row', justifyContent:'space-around', alignContent: 'stretch', backgroundColor: 'blue', padding: 15}}>
        <Button
         title="Go to Home"
         onPress={() => this.props.navigation.navigate('Home')}
         color = 'white'
         fontStyle = 'bold'
       />
       <Button
         title="Scan Again"
         onPress={() => this.props.navigation.navigate('Barcode')}
         color= 'white'
         outline= 'true'
       />
       </View>
       </View>
    );
  }
}

class AddReview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      allergies:'',
      review: '',
      submitted: false
    }
    this.handleSubmit.bind(this.handleSubmit)
  }

  componentDidMount() {
    this.setState(this.state)
  }

  handleSubmit () {
    alert("Thank you for your review!")
    this.setState({submitted: true})
  }

  render() {
    return(
      this.state.submitted === true ?
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Thanks for submitting your review!</Text>
      </View>
      :
      <View>
        <Text style = {{fontWeight: 'bold', fontSize: 30}}>Name: </Text>
        <View style={{borderWidth:2, borderColor:'black'}}>
          <TextInput style={{height: 40}}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          />
        </View>
        <Text style = {{fontWeight: 'bold', fontSize: 30}}>Allergies: </Text>
        <View style={{borderWidth:2, borderColor:'black'}}>
          <TextInput style={{height: 40}}
          onChangeText={(allergies) => this.setState({allergies})}
          value={this.state.allergies}
          />
        </View>
        <Text style = {{fontWeight: 'bold', fontSize: 30}}>Review: </Text>
        <View style={{borderWidth:2, borderColor:'black'}}>
          <TextInput style={{height: 40}}
          onChangeText={(review) => this.setState({review})}
          value={this.state.review}
          />
        </View>
        <Button title= "Submit" onPress={this.handleSubmit}/>
      </View>
    )
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Barcode: BarcodeScreen,
    Item: ItemScreen,
    AddReview: AddReview
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
