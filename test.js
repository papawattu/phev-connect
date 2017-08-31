const net = require('net');

const client = new net.Socket();

let chksum = 0xfd;
let seq = 0;


function ping() {
	console.log('Write : ' + Buffer.from([0xf9,0x04,0x00,(seq++) % 0x64,0x00,(chksum++) % 0xff]).toString('hex'));
        client.write(Buffer.from([0xf9,0x04,0x00,(seq++) % 0xff,0x00,(chksum++) % 0xff]));

}
function send(cmd) {
	switch (cmd) {
		case 0: {
			console.log('Start');
			client.write(Buffer.from([0xf2,0x0a,0x00,0x01,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0xff]));
			break;
		}
		case 1: {
			console.log('f6');
			client.write(Buffer.from([0xf6,0x04,0x00,0xaa,0x00,0xa4]));
			break;
		}
		case 2: {
			console.log('Write : ' + Buffer.from([0xf9,0x04,0x00,(seq++) % 0xff,0x00,(chksum++) % 0xff]).toString('hex'));
			client.write(Buffer.from([0xf9,0x04,0x00,(seq++) % 0xff,0x00,(chksum++) % 0xff]));
			break;
		}
		case 3: {
			client.end();
			break;
		}
	}
}

function connect(cmd,cb) {
	//console.log(client.writeable);
	if(!client.writeable) {
		console.log('Connecting');
		client.connect(8080,'192.168.8.46', ()=> {
		});

		client.on('data',(data) => {
			console.log(data.toString('hex'));
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

connect(0,()=>{
//	while(1) {
		ping();
//	}
});
