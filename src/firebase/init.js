import firebase from 'firebase'
import firestore from 'firebase/firestore'

var firebaseConfig = {
  apiKey: 'AIzaSyDykMMdLhqqHPh_UfJRzWHnTEuqYfNnmGc',
  authDomain: 'tasks-manager-5c09a.firebaseapp.com',
  databaseURL: 'https://tasks-manager-5c09a.firebaseio.com',
  projectId: 'tasks-manager-5c09a',
  storageBucket: '',
  messagingSenderId: '243012021910',
  appId: '1:243012021910:web:88c486adc1e3422a'
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp.firestore()
