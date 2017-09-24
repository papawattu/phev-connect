import { validate } from 'phev-utils'

const PhevManager = ({ messagingClient, socketConnection, error }) => {
    const client = messagingClient.start()

    const isStartMessage = message => message[0] === 0xf2

    const validateMessage = validate

    const handler = message => {
        if(!validateMessage(message)) {
            error('Invalid message')
            return
        }

        if(isStartMessage(message)) {
            if(!socketConnection.connected) {
                socketConnection.start()
            }
        }

        socketConnection.write(message)
    }
    return {
        start: () => messagingClient.registerHandler({
            handler: handler
        }),
        publish: message => messagingClient.publish(message)
    }
}

export default PhevManager