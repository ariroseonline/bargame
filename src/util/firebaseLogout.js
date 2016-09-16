import Router from 'react-router';

export default function() {
  firebase.auth().signOut().then(function () {
    // window.location.reload either of these work
    Router.replace(window.location);
  });
}
