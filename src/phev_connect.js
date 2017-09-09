import PhevMqtt from 'phev-mqtt'
import { Observable } from 'rxjs'
import net from 'net'

const logging = process.env.DEBUG ? true : false
const carHost = process.env.CAR_HOST || '192.168.8.46'
const carPort = process.env.CAR_PORT || 8080
const phevReceive = process.env.PHEV_RECEIVE || 'phev/receive'
const phevSend = process.env.PHEV_SEND || 'phev/send'
const mqttUsername = process.env.MQTT_USERNAME || ''
const mqttPassword = process.env.MQTT_PASSWORD || ''
const mqttUri = process.env.MQTT_URI || 'mqtt://secure.wattu.com'

const log = message => logging ? console.log(message) : undefined

const PhevConnect = ({mqtt} = {}) => {

    const client = new net.Socket();
    const phevMqtt = PhevMqtt({mqtt, uri: mqttUri, options : {username: mqttUsername, password: mqttPassword}})
    
    const connect = () => {
        log('Connecting to ' + carHost + ':' + carPort);
        client.connect(carPort, carHost, () => {
            Observable.fromEvent(client, 'data').subscribe(data => {
                phevMqtt.send(phevReceive, data)
                log('Car    : ' + data.toString('hex'))
            })
        })
    }

    log('Subsribed to ' + phevSend + ' on ' + mqttUri)
    phevMqtt.subscribe(phevSend)

    phevMqtt.messages(phevSend).subscribe(m => {
        client.write(m.message)
        log('Client : ' + m.message.toString('hex'))
    })
        
    return {
        connect: connect
    }
}

export default PhevConnect