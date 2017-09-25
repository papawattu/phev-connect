import mqtt from 'mqtt'
import { log } from 'phev-utils'

const MqttClient = ({ mqtt, mqttUri, topicName = 'phev/receive', subscriptionName = 'phev/send' } = {}) => {

    let client = null 

    return {
        start: () => {
            log.info('Started MQTT')
            client = mqtt.connect(mqttUri)
            client.on('connect', () => log.info('MQTT connected'))
    },
        registerHandler: handler => {
            log.debug('Registered Handler')

            client.subscribe(subscriptionName)
            client.on('message', (topic, message) => handler(message))
        },
        publish: message => client.publish(topicName, message)
    }
}

export default MqttClient