import PhevConnect from './phev_connect'
import mqtt from 'mqtt'

const App = () => {

    const mqttUri = process.env.MQTT_URI || 'ws://secure.wattu.com:8080'
    const phevConnect = PhevConnect({mqtt, mqttUri})
    
    const start = () => {
        phevConnect.connect()
    }
    const stop = () => undefined
    
    return {
        start: start,
        stop: stop
    }
}

export default App