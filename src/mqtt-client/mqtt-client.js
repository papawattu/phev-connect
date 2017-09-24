import mqtt from 'mqtt'
import { log } from 'phev-utils'

const MqttClient = ({ client = mqtt.connect('mqtt://secure.wattu.com'),
    topicName = 'phev/receive', subscriptionName = 'phev/send'} = {}) => ({
    start: () => {
        log.info('Started MQTT')
        client.on('connect', () => log.info('MQTT connected'))
    },
    registerHandler: handler => {
        log.debug('Registered Handler')
        
        client.subscribe(subscriptionName)
        client.on('message', (topic, message) => handler(message))
    },
    publish: message => client.publish(topicName, message)
})

export default MqttClient