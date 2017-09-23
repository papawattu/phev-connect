import PubSub from '@google-cloud/pubsub'
import net from 'net'
import PubSubConnection from './pubsub-connection'
import SocketConnection from './socket-connection'
import { validate } from 'phev-utils'

const App = ({ port = 8080, host = '192.168.8.46' } = {}) => {

    const client = new net.Socket()

    const socketConnection = SocketConnection({ client, publish })
    const { publish } = PubSubConnection({
        pubSub: PubSub(),
        send: message => {
            if(validate(message)) {
                socketConnection.send(message)
            }
        }
    })
}

export default App