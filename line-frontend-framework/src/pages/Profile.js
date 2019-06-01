import React, { Component } from 'react';
import man from '../assets/img/man.png';
import liffHelper from '../utils/liffHelper';
import QrReader from 'react-qr-reader';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 'No result',
      profile: {
        pictureUrl: man,
      }
    };
    liffHelper.getProfile()
      .then(profile => {
        this.setState({ profile });
      });
  }

  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      })
    }
  }
  handleError = err => {
    console.error(err)
  }

  render() {
    return (
      <div>
        <div className="page-content">
          <div className="col-lg-3" />
          <div className="col-lg-6">
            <div>
              <img width="130" className="avatar-img" alt="profile" src={this.state.profile.pictureUrl} />
            </div>
            <hr />
            <div className="form-group">
              <label htmlFor="userid">User ID:</label>
              <input type="text" className="form-control" disabled id="userid" value={this.state.profile.userId} />
            </div>
            <div className="form-group">
              <label htmlFor="name">Display Name:</label>
              <input type="text" className="form-control" disabled id="name" value={this.state.profile.displayName} />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status Message:</label>
              <input type="text" className="form-control" disabled id="status" value={this.state.profile.statusMessage} />
            </div>
            <div className="form-group">
              <label htmlFor="info">LIFF Info:</label>
              <textarea rows="10" className="form-control" disabled id="info" value={JSON.stringify(liffHelper.getLIFFInfo(), '', 2)} />
            </div>
            <hr />
            <button type="button" className="btn btn-default" onClick={() => { liffHelper.closeWindow() }}>Close LIFF</button>
          </div>
          <div className="col-lg-3" />
        </div>
        <div className="page-content">
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />
          <p>{this.state.result}</p>
        </div>
      </div>
    );
  }
}