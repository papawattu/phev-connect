import uuid from 'uuid/v1'

const PhevConnect = ({ vin, observableMqtt }) => {
    
    const createSessionId = () => process.env.NODE_ENV === 'test' ? '11111111-1111-1111-1111-111111111111' : uuid()
    
    const { send, messages } = observableMqtt('phev/connect')

    messages()
        .filter(msg => msg === vin)
        .subscribe(msg => {
            send(createSessionId(test))
        })
    return {
    }

}
export default PhevConnect