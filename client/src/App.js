import React from 'react';
import Board from './Board';
import openSocket from 'socket.io-client';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);

    const socket = openSocket('http://' + window.location.hostname + ':3001' );
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });
    socket.on('message', (msg, data) => {
      console.log(`received '${msg}'`);

      switch (msg)
      {
        case 'state':
        {
          console.log(data);
          this.setState({
            cells: data.cells,
            observer: data.observer,
            status: 'ok'
          });
          break;
        }
      }
    });

    this.state = {
      cells: [],
      status: 'loading',
      io: socket
    };

    socket.send('load');
  }

  render() {
    let content;
    if (this.state.status === 'loading')
    {
      content = (<div>Joining game...</div>);
    }
    else
    {
      content = (<Board cells={this.state.cells} io={this.state.io} />);
    }

    return (
      <div className="flex-container flex-center">
        {content}
      </div>
    );
  }
}

export default App;
