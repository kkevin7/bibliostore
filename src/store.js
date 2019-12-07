import {createStore, combineReducers, compose} from 'redux';
import {reactReduxFirebase, firebaseReducer} from 'react-redux-firebase';
import {reduxFirestore, firestoreReducer} from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

//Configurar firestore
var firebaseConfig = {
    apiKey: "AIzaSyBgo9Gg0lUcUaliNuWHWLDc1dU_w-0xX2c",
    authDomain: "bibliostore-99d77.firebaseapp.com",
    databaseURL: "https://bibliostore-99d77.firebaseio.com",
    projectId: "bibliostore-99d77",
    storageBucket: "bibliostore-99d77.appspot.com",
    messagingSenderId: "291758006000",
    appId: "1:291758006000:web:a8d580a6d1798b4fe46c35"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// configuracion de react-redux
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true
}

// crear el enhacer con compose de redux y firestore
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore)

// Reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

// state incial
const initialState = {};

// Crear el store
const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))

export default store;