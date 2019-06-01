import React, { Component } from 'react';
import liffHelper from '../utils/liffHelper';
import messageHelper from '../utils/messagingApiHelper';
import swal from 'sweetalert2';
import { geolocated } from 'react-geolocated';

const messageTypes = [
  { key: 'text', label: 'Text', editable: true, value: 'Some Text' },
  { key: 'image', label: 'Image', editable: true, value: 'https://obs.line-scdn.net/hwBbkvLneNGxqfidiPSgzFSgMJlRzKjs4MSZvD3gUdlwgJWc9ZXIyCHsRIQhyIjpoZyc' },
  { key: 'video', label: 'Video', editable: false, value: 'https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  { key: 'audio', label: 'Audio', editable: false, value: 'https://cdn.online-convert.com/example-file/audio/m4a/example.m4a' },
  { key: 'location', label: 'Location', editable: false, value: 'Location' },
  { key: 'button', label: 'Template - Button', editable: false, value: 'Button' },
  { key: 'confirm', label: 'Template - Confirm', editable: false, value: 'Confirm' },
];

class SendMessage extends Component {
  constructor(props) {
    super(props);

    this.textInput = [];

    this.setTextInputRef = (key, element) => {
      this.textInput[key] = element;
    };
  }

  sendMessageToChat(messageKey) {
    let value = this.textInput[messageKey].value;
    let message;
    switch (messageKey) {
      case 'text':
        message = messageHelper.createTextMessage(value); break;
      case 'image':
        message = messageHelper.createImageMessage(value, value); break;
      case 'video':
        message = messageHelper.createVDOMessage(value, 'https://www.sample-videos.com/img/Sample-png-image-500kb.png'); break;
      case 'audio':
        message = messageHelper.createAudioMessage(value, 3600); break;
      case 'button':
        let actions = [
          {
            "type": "uri",
            "label": "Google",
            "uri": `https://google.com`
          },
          {
            "type": "uri",
            "label": "Facebook",
            "uri": `https://facebook.com`
          },
        ];
        message = messageHelper.createButtonMessageWithImage('Select Page', 'Send Buttton Demo', 'https://obs.line-scdn.net/hwBbkvLneNGxqfidiPSgzFSgMJlRzKjs4MSZvD3gUdlwgJWc9ZXIyCHsRIQhyIjpoZyc', actions);
        break;
      case 'confirm':
        let confirmActions = [
          {
            "type": "uri",
            "label": "YES",
            "uri": `https://www.facebook.com/groups/LINEDEVTH`
          },
          {
            "type": "uri",
            "label": "NO",
            "uri": `https://www.facebook.com/LINEDEVTH`
          }
        ];
        message = messageHelper.createConfirmMessage('Send Message again', confirmActions);
        break;
      case 'location':
        if (this.props.isGeolocationAvailable && this.props.isGeolocationEnabled) {
          let lat = this.props.coords.latitude;
          let lng = this.props.coords.longitude;
          message = messageHelper.createLocationMessage(lat, lng);
        } else {
          swal({
            type: 'error',
            title: 'Send Error',
            text: 'Geolocation is not enabled',
          })
        }
        break;
      default:
        message = messageHelper.createTextMessage('ABC');
    }
    if (message) {
      liffHelper.sendMessages([message])
        .then(() => {
          swal({
            type: 'success',
            title: 'Send Message Complete',
            showConfirmButton: false,
            timer: 1000
          })
        })
        .catch((err) => {
          swal({
            type: 'error',
            title: 'Send Error',
            text: err.response.data.message,
          })
        });
    }
  }

  render() {
    let formGroups = messageTypes.map((messageType, index) => {
      return (
        <div className="form-group" key={index}>
          <label htmlFor={`msg_${messageType.key}`} className="message-label">{messageType.label}:</label>
          <div className="input-group">
            <input ref={this.setTextInputRef.bind(this, messageType.key)} id={`msg_${messageType.key}`} disabled={!messageType.editable} type="text" className="form-control" defaultValue={messageType.value} />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" disabled={messageType.disabled} onClick={this.sendMessageToChat.bind(this, `${messageType.key}`)} >Send</button>
            </span>
          </div>
        </div>
      );
    });
    return (
      <div className="page-content">
        <div className="col-lg-3" />
        <div className="col-lg-6">
          {formGroups}
          <hr />
          <button type="button" className="btn btn-default" onClick={() => { liffHelper.closeWindow() }}>Close LIFF</button>
        </div>
        <div className="col-lg-3" />
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(SendMessage);