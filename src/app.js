import { BehaviorSubject, Observable } from 'rxjs'
import ObservableMqtt from 'observable-mqtt'
import PhevConnect from './phev-connect'

const App = config => {

    const validateConfig = config => {
        const { mqttUri, vin } = config

        if (!mqttUri) return 'Config Error - Missing MQTT Uri'
        if (!vin) return 'Config Error - Missing VIN'
        
        return undefined
    }

    const errorMessage = validateConfig(config) 
    
    if(errorMessage) throw new Error(errorMessage)

    const observableMqtt = ObservableMqtt({ mqtt: config.mqtt, uri: config.mqttUri })
    
    const { messages: connectMessages } = observableMqtt('phev/connect/'+ config.vin)
    
    const connected = connectMessages()
        .distinct()
        .share()
        
    const subject = new BehaviorSubject(false)

    connected.subscribe(subject)

    const { messages: sendMessages } = observableMqtt('phev/send')

    return {
        isConnected: cb => subject.subscribe(cb)
    }
}


export default App