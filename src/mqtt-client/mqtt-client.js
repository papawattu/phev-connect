import mqtt from 'mqtt'
import { log } from 'phev-utils'

const MqttClient = ({ client = mqtt.connect('mqtt://secure.wattu.com')} = {}) => ({
    start: () => {
        log.info('Started MQTT')
        client.on('connect', () => log.info('MQTT connected'))
    },
    registerHandler: handler => {
        log.debug('Registered Handler')
        
        client.subscribe('phev/send')
        client.on('message', (topic, message) => handler(message))
    },
    publish: message => client.publish('phev/receive', message)
})

export default MqttClient