import { subscribe, send, messages } from 'phev-mqtt'
import { Observable } from 'rxjs'
import net from 'net'

const logging = process.env.DEBUG ? true : false

const log = message => logging ? console.log(message) : undefined

const client = new net.Socket();

const connect = (cmd, cb) => {
    log('Connecting');
    client.connect(8080, '192.168.8.46', () => {
        Observable.fromEvent(client,'data').subscribe(data => {
            send('phev/receive', data)
            log('Car    : ' + data.toString('hex'))
        })
    })
}

subscribe('phev/send')
messages('phev/send').subscribe(m => {
    client.write(m)
    log('Client : ' + m.toString('hex'))
})

connect(0, () => {

});
