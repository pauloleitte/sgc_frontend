angular.module('SGC').factory('firebase', [
    '$firebaseAuth',
    FireFactory
])

function FireFactory($firebaseAuth){

    var config = {
        apiKey: "AIzaSyD3OTlrZvWw8SJ8V857lQAlQVK4lQt3zsQ",
        authDomain: "firtsnodejs.firebaseapp.com",
        databaseURL: "https://firtsnodejs.firebaseio.com",
        projectId: "firtsnodejs",
        storageBucket: "firtsnodejs.appspot.com",
        messagingSenderId: "642928186664",
        automaticDataCollectionEnabled: ""
    }
}