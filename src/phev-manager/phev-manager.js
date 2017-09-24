import { log, validate } from 'phev-utils'

const PhevManager = ({ messagingClient, socketConnection, error }) => {
    const client = messagingClient.start()

    const isStartMessage = message => message[0] === 0xf2

    const validateMessage = validate

    const startConnection = () => {
        log.debug('Starting connection')
        if(!socketConnection.connected) {
            socketConnection.start()
        }
        socketConnection.handleData(data => {
            log.debug('Publish data ' + JSON.stringify(data))
            
            messagingClient.publish(data)
        })
    }
    const handler = message => {
        if(!validateMessage(message)) {
            log.error('Invalid message ' + JSON.stringify(message))
            
            error('Invalid message')
            return
        }

        if(isStartMessage(message)) {
            startConnection()
        }
        log.debug('Write data ' + JSON.stringify(message))
        
        socketConnection.write(message)
    }
    return {
        start: () => messagingClient.registerHandler(handler),
    }
}

export default PhevManager