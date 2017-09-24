import mqtt from 'mqtt'

const MqttClient = ({ client = mqtt.connect('mqtt://secure.wattu.com')}) => ({
    start: () => {
        client.on('connect', () => {
            client.subscribe('receive')
        })
    },
    registerHandler: handler => {
        client.on('message', handler)
    },
    publish: client.publish
})

export default MqttClient