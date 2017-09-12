import PhevMqtt from 'phev-mqtt'
import { log } from 'phev-utils'
import { Observable } from 'rxjs'
import net from 'net'

const logging = process.env.DEBUG ? true : false
const carHost = process.env.CAR_HOST || '192.168.8.46'
const carPort = process.env.CAR_PORT || 8080
const phevReceive = process.env.PHEV_RECEIVE || 'phev/receive'
const phevSend = process.env.PHEV_SEND || 'phev/send'
const phevStatus = 'phev/status'
const phevError = 'phev/error'
const phevConnection = 'phev/connection'
const phevStart = 'phev/start'
const phevDisconnect = 'phev/disconnect'

const mqttUsername = process.env.MQTT_USERNAME || ''
const mqttPassword = process.env.MQTT_PASSWORD || ''
const mqttUri = process.env.MQTT_URI || 'mqtt://secure.wattu.com'

const PhevConnect = ({ mqtt } = {}) => {

    const phevMqtt = PhevMqtt({ mqtt, uri: mqttUri, options: { username: mqttUsername, password: mqttPassword } })
    
    const client = new net.Socket();
    
    const connectToCar = () => {
        
        log.info('Connecting to ' + carHost + ':' + carPort);
        client.connect(carPort, carHost, () => {
            
        })  
        
        client.on('connect', () => {
            log.debug('Client connected')
            phevMqtt.send('connection', 'connected')
            Observable.fromEvent(client, 'data').subscribe(data => {
                phevMqtt.send(phevReceive, data)
                log.debug('Car    : ' + data.toString('hex'))
            })
        })
        client.on('end', () => {
            log.debug('Client socket ended')
            client.destroy()
        })
        client.on('error', err => {
            log.error('Client socket error ' + err)
            phevMqtt.send(phevError, err)
            client.destroy()
        })      
    }

    const connectToMqtt = () => {
        
        log.debug('Subscribed ' + mqttUri)
        phevMqtt.subscribe(phevSend)

        phevMqtt.messages(phevSend)
            .subscribe(m => {

            if(!client.destroyed) {
                client.write(m.message)
            } else {
                connectToCar()
                client.once('connect', () => client.write(m.message))
            }
        })
    }
    const connect = () => {
        connectToMqtt()
    }

    return {
        connect: connect
    }
}

export default PhevConnect