import React from 'react';
import { remote } from 'electron';
import gitAuth from '../utils/github.settings'; // obj with id, secret, scopes

export default class LoginComponent extends React.Component {
  props: {
    githubLogin: () => void
  };

  handleAuth() {
    const webPreferences = {
      nodeIntegration: false
    };

    let authWindow = new remote.BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences
    });

    const githubUrl = 'https://github.com/login/oauth/authorize?';
    const authUrl = `${githubUrl}client_id=${gitAuth.client_id}&scope=${gitAuth.scopes}`;
    authWindow.loadURL(authUrl);
    authWindow.show();

    const handleCallback = (url) => {
      const rawCode = /code=([^&]*)/.exec(url) || null;
      const authCode = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
      const error = /\?error=(.+)$/.exec(url);

      // Close the mini login-browser if auth code found or error
      if (authCode || error) {
        authWindow.destroy();
      }

      // If there is an auth code (supplied via callback url), get token from github
      if (authCode) {
        this.requestGithubToken(authCode);
      } else if (error) {
        alert('Oops! Something went wrong and we couldn\'t' +
          'log you in using Github. Please try again.');
      }
    };

    // handle response from github, handles first-time-login
    authWindow.webContents.on('will-navigate', (event, url) => {
      handleCallback(url);
    });

    // handles case where already logged into Github
    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      handleCallback(newUrl);
    });

    // Reset the authWindow on close
    authWindow.on('close', () => { authWindow = null; }, false);
  }

  requestGithubToken(authCode) {
    this.props.githubLogin(authCode);
  }

  // should have a way to check if localstorage token is still valid
  // if access has been granted, then revoked by user, this won't work
  render() {
    return (
      <div>
        <h2>Welcome to Codelab</h2>
        <button onClick={this.handleAuth.bind(this)}>
          Log in with Github
        </button>
        <h5>dev note: If successful, auth token should be on state and in localstorage</h5>
      </div>
    );
  }
}
