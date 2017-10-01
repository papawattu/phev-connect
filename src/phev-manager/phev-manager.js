import { log, validate } from 'phev-utils'

const PhevManager = ({ incoming: messaging, outgoing: socketConnection, error }) => {

    const isStartMessage = message => message[0] === 0xf2

    const socketHandler = data => {
        log.debug('Publish response data ' + JSON.stringify(data))

        messaging.publish(data)
    }

    const startConnection = () => {
        log.debug('Starting connection')

        socketConnection.start(message)
            .then(() => {
                socketConnection.registerHandler(socketHandler)
                log.debug('Write data ' + JSON.stringify(message))

                socketConnection.publish(message)
            })
    }
    const handler = message => {
        log.debug('Incomming message ' + JSON.stringify(message))

        if (!validate(message)) {
            log.error('Invalid message ' + JSON.stringify(message))

            error('Invalid message')
            return
        }

        if (isStartMessage(message)) {
            log.debug('Start message received')
            startConnection(message)
        } else {
            log.debug('Write data ' + JSON.stringify(message))

            socketConnection.publish(message)
        }
    }
    return {
        start: () => {
            messaging.start()
                .then(() => {
                    messaging.registerHandler(handler)
                })
        },
    }
}

export default PhevManager