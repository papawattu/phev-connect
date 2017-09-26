import { log, validate } from 'phev-utils'

const PhevManager = ({ incoming: messagingClient, outgoing: socketConnection, error }) => {
    const client = messagingClient.start()

    const isStartMessage = message => message[0] === 0xf2

    const validateMessage = validate

    const startConnection = () => {
        log.debug('Starting connection')
        
        socketConnection.start()
        
        socketConnection.registerHandler(data => {
            log.debug('Publish data ' + JSON.stringify(data))
            
            messagingClient.publish(data)
        })
    }
    const handler = message => {
        log.debug('Incomming message ' + JSON.stringify(message))
        
        if(!validateMessage(message)) {
            log.error('Invalid message ' + JSON.stringify(message))
            
            error('Invalid message')
            return
        }

        if(isStartMessage(message)) {
            log.debug('Start message received')
            startConnection()
        }
        log.debug('Write data ' + JSON.stringify(message))
        
        socketConnection.publish(message)
    }
    return {
        start: () => messagingClient.registerHandler(handler),
    }
}

export default PhevManager