export default function() {

  //Always be watching for sign in/out changes
  firebase.auth().onAuthStateChanged(function(user) {
    alert('auth state changed')
    if (user) {
      // User is signed in.
      var usersRef = firebase.database().ref('users');
      usersRef.child(user.uid).once('value', function(snapshot) {

        //add user to database if not already there
        if(snapshot.val() === null) {
          usersRef.child(user.uid).set({
            provider:  user.providerData[0].providerId,
            name: user.providerData[0].displayName,
            email: user.providerData[0].email,
            level: 0
          });
        }
      });


    } else {
      // User is signed out.
    }


  }, function(error) {
    console.log(error);
  });

}
