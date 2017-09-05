import PhevConnect from './phev_connect'
import mqtt from 'mqtt'

const App = () => {

    const mqttUri = process.env.MQTT_URI || 'wss://secure.wattu.com:8883/mqtt'
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