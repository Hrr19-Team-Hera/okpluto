"use strict";

import React from 'react';
//Required for Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyTheme from '../theme/theme.js';
//Material-UI components used within this form
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import MeetupCreation from './meetupCreation.jsx';
import ChatCreation from './chatCreation.jsx';
import Snackbar from 'material-ui/Snackbar';
import * as Colors from 'material-ui/styles/colors';
//Services
import eventServices from '../services/eventServices.js';
import chatServices from '../services/chatServices.js';

class ChatDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      errorText: {},
      creator: this.props.userInfo._id,
      //Target user and creator automatically added to attendees
      attendees: [this.props.userInfo._id, this.props.userId],
      category: 'Dog Park',
      snackbar: false,
      messages: [{text: 'a'}],
      inputMessage: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleInputMessage = this.handleInputMessage.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    // this.handleOpenChat = this.handleOpenChat.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleSend = this.handleSend.bind(this);
    chatServices.listenForNewChat(this.handleReceivedChat.bind(this));

    var self = this;
    chatServices.listenForMessage(function(data){
      console.log('message pushed to state',data);
      self.setState({messages: self.state.messages.concat([{text: data}])});
    })
  }

  handleSend(){
    console.log('sending message');
  }

  handleOpen() {
    chatServices.requestChat(this.state.attendees);
    this.setState({open: true});
  }

  handleReceivedChat() {
    console.log('chat request received, opening dialog');
    //chatServices.requestChat(this.state.attendees);
    this.setState({open: true});
  }

  // handleOpenChat() {
  //   this.setState({open: true})
  // }

  handleClose() {
    this.setState({open: false});
  }

  handleSnackbarClose() {
    this.setState({snackbar: false});
  }

  validate(values) {
    const errors = {};
    const requiredFields = [ 'eventname', 'where', 'date', 'time' ];
    requiredFields.forEach(field => {
      //Checks if any of the requiredFields don't have a value
      if (!values[field].value) {
        errors[field] = 'Required';
      }
    });
    //Checks if lat and lng are null - means a valid location was not chosen
    if (!this.state.lat || !this.state.lng) {
      errors.where = 'Please enter a valid location';
    }
    if (!this.state.category) {
      errors.category = 'Required';
    }
    return errors;
  }

  handleSubmit() {
    var self = this;
    var sender = this.state.attendees[0];
    var receiver = this.state.attendees[1];
    var message = {text: this.state.inputMessage, self: true};

    //clear the text field
    this.handleChange('inputMessage',""); 
    //update this components messages to add my message
    self.setState({messages: self.state.messages.concat([message])});

    console.log('handling submit');
    console.log('attendees', this.state.attendees);
    console.log('messages after submit', this.state.messages);
    //send message to receiver
    chatServices.sendMessage(this.state.attendees, message.text);
  }

  handleChange(prop, newValue) {
    var change = {};
    change[prop] = newValue;
    this.setState(change);
    console.log('handledChange, new state.inputMessage',this.state.inputMessage);
  }

  handleInputMessage(e){
    var message = e.target.value;
    console.log('event message in handleinputmessage',message); 
    this.handleChange('inputMessage',message);
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Send"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />
    ];



    //autoScrollBodyContent within Dialog is super important when you're wondering why all of your form fields are not showing up
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
        <div>
          <RaisedButton
            onTouchTap={this.handleOpen}
            label="Let's Chat!"
            primary={true}
          />

          <Dialog
            title="Chat Area"
            titleStyle={{textAlign: 'center'}}
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
            autoDetectWindowHeight={true}
          >
            <div className="middle" style={{wordWrap: "break-word"}}>

              {this.state.messages.map(function(message){
                if(message.self){
                  return (
                    <p>{message.text}</p>
                  )
                }
                else {
                  return (
                    <p style={{color:"red"}}>{message.text}</p>
                  )
                }
              })}
             

            <TextField
              hintText="Message"
              value = {this.state.inputMessage} 
              onChange = {this.handleInputMessage}
            />
            </div>
          </Dialog>

          <Snackbar
            bodyStyle={{background: Colors.blueGrey600}}
            open={this.state.snackbar}
            message="Event created successfully"
            autoHideDuration={3000}
            onRequestClose={this.handleSnackbarClose}
          />
        </div>

      </MuiThemeProvider>
    )
  }
}



module.exports = ChatDialog;