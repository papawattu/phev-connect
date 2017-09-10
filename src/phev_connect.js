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


const mqttUsername = process.env.MQTT_USERNAME || ''
const mqttPassword = process.env.MQTT_PASSWORD || ''
const mqttUri = process.env.MQTT_URI || 'mqtt://secure.wattu.com'

const PhevConnect = ({ mqtt } = {}) => {

    const phevMqtt = PhevMqtt({ mqtt, uri: mqttUri, options: { username: mqttUsername, password: mqttPassword } })

    let connected = false

    const connectToCar = () => {
        const client = new net.Socket();
        
        log.info('Connecting to ' + carHost + ':' + carPort);
        client.connect(carPort, carHost, () => {
            Observable.fromEvent(client, 'data').subscribe(data => {
                phevMqtt.send(phevReceive, data)
                log.debug('Car    : ' + data.toString('hex'))
            })
        })
        client.on('connect', () => {
            log.debug('Client connected')
            phevMqtt.send('connection', 'connected')
        })
        client.on('end', () => {
            log.debug('Client socket ended')
            phevMqtt.send(phevConnection, 'disconnected')
        })
        client.on('error', err => {
            log.debug('Client socket error ' + err)
            phevMqtt.send(phevError, err)
        })
    }

    const connectToMqtt = () => {
        
        log.debug('Subscribed ' + mqttUri)
        phevMqtt.subscribe([phevSend, phevStatus, phevStart])

        phevMqtt.messages(phevSend).subscribe(m => {
            if (connected && !client.destroyed) {
                client.write(m.message)
                log.debug('Client : ' + m.message.toString('hex'))
            }
        })
        phevMqtt.messages(phevStatus).subscribe(m => {
            log.debug('Status request')
            phevMqtt.send(phevConnection, connected ? 'connected' : 'disconnected')
        })

        phevMqtt.messages(phevStart).subscribe(m => {
            log.debug('Starts request')
            connectToCar()
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