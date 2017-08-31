import { subscribe, send, messages } from 'phev-mqtt'
import { Observable } from 'rxjs'
import net from 'net'

const log = message => console.log

const client = new net.Socket();

const connect = (cmd,cb) => {
	if(!client.writeable) {
		log('Connecting');
		client.connect(8080,'192.168.8.46', ()=> {
		})

		client.on('data',(data) => {
            send('phev/receive',data)
            log('Car    : ' + data.toString('hex'))
        })
		client.once('connect',() => {
			log('Connected');		
                	cb();

		})
		client.on('error',(err) => {
			log('error ' + err);
		});
		client.on('end',() => {
			log('end');
		});
	} else {
		log('Sending');
		cb();
	}
}

messages().subscribe(m => {
    client.write(m)
    log('Client : ' + m.toString('hex'))
})

connect(0,()=>{

});
