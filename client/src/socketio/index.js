import io from 'socket.io-client';
import { socketEvents } from './events';

export const socket = io('http://' + window.location.hostname + ':3001', {
	autoConnect: false
});

export const initSockets = ({ setValue }) => {
	socketEvents({ socket, setValue });
	socket.open();
};

// socket.on('connect', () => {
// 	console.log('connected', socket.id);
// });

// socket.on('disconnect', () => {
// 	console.log('disconnected');
// });


		// socket.on('message', (msg, data) => {
		//  console.log(`received '${msg}'`);

		//  switch (msg)
		//  {
		//    case 'state':
		//    {
		//      console.log(data);
		//      this.setState({
		//        cells: data.cells,
		//        observer: data.observer,
		//        status: 'ok'
		//      });
		//      break;
		//    }
		//  }
		// });

		// this.state = {
		//  cells: [],
		//  status: 'loading',
		//  io: socket
		// };

		// socket.send('load');
