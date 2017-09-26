import _mqtt from 'mqtt'
import { log } from 'phev-utils'

const MqttClient = ({ mqtt = _mqtt, mqttUri, topicName = 'phev/receive', subscriptionName = 'phev/send' } = {}) => {

    let client = null 

    return {
        start: () => new Promise((resolve, reject) => {
            log.info('Started MQTT')
            client = mqtt.connect(mqttUri)
            
            client.on('error', err => {
                log.error(err)
                reject(err)
            })
            client.on('connect', () => {
                log.info('MQTT connected')
                resolve(client)
            })
    }),
        registerHandler: handler => {
            log.debug('Registered Handler')

            client.subscribe(subscriptionName)
            client.on('message', (topic, message) => handler(message))
        },
        publish: message => client.publish(topicName, message)
    }
}

export default MqttClient