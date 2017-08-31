import { startPing, sendMessage, receivedMessages } from './car_service'
import { Observable } from 'rxjs'
const net = require('net');

const client = new net.Socket();

const connect = (cmd,cb) => {
	if(!client.writeable) {
		console.log('Connecting');
		client.connect(8080,'192.168.8.46', ()=> {
		});

		client.on('data',(data) => {
            console.log(data.toString('hex'));
            console.log('CAR ' + sendMessage(data))
		});
		client.once('connect',() => {
			console.log('Connected');		
                	cb();

		});
		client.on('error',(err) => {
			console.log('error ' + err);
		});
		client.on('end',() => {
			console.log('end');
		});
	} else {
		comsole.log('Sending');
		cb();
	}
}

receivedMessages().subscribe(m => {
    client.write(m)
    console.log('Client ' + m)
})

connect(0,()=>{

});
