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
    
    let connected = false

    const connectToCar = () => {
        
        log.info('Connecting to ' + carHost + ':' + carPort);
        client.connect(carPort, carHost, () => {
            Observable.fromEvent(client, 'data').subscribe(data => {
                if(connected) {
                    phevMqtt.send(phevReceive, data)
                    log.debug('Car    : ' + data.toString('hex'))
                } else {
                    log.warn('Got data from car but not connected to client')
                }
            })
        })
        client.on('connect', () => {
            log.debug('Client connected')
            connected = true
            phevMqtt.send('connection', 'connected')
        })
        client.on('end', () => {
            log.debug('Client socket ended')
            disconnect()
        })
        client.on('error', err => {
            log.error('Client socket error ' + err)
            connected = false
            phevMqtt.send(phevError, err)
        })
    }

    const disconnect = () => {
        log.info('Client disconnected')
        phevMqtt.send(phevConnection, 'disconnected')
        connected = false
        client.destroy()
    }
    const connectToMqtt = () => {
        
        log.debug('Subscribed ' + mqttUri)
        phevMqtt.subscribe([phevSend, phevStatus, phevStart])

        phevMqtt.messages(phevSend).subscribe(m => {
            if (connected && !client.destroyed) {
                client.write(m.message)
                log.debug('Client : ' + m.message.toString('hex'))
            } else {
                log.debug('Received message, not sending (not connected)')
            }
        })
        phevMqtt.messages(phevStatus).subscribe(m => {
            log.debug('Status request')
            phevMqtt.send(phevConnection, connected ? 'connected' : 'disconnected')
        })

        phevMqtt.messages(phevDisconnect).subscribe(m => {
            log.debug('Disconnect request')
            disconnect()
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