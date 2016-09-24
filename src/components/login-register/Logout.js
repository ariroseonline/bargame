import React from 'react';

var Logout = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
            error: false
        }
    },
    componentDidMount: function () {
        firebase.auth().signOut(); //maybe needs a then callback
        this.setState({loggedIn: false});
        // this.context.router.replace('/');
        //TODO: I think you we want to reload the route...there's some problems with logging out and immediately logging in again
    },
    render: function () {
        return <p>You are now logged out</p>;
    }
});

export default Logout;
