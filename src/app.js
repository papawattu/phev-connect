import PubSub from '@google-cloud/pubsub'
import net from 'net'
import PubSubConnection from './pubsub-connection'

const App = ({ port = 8080, host = '192.168.8.46' } = {}) => {

    const client = new net.Socket()

    const send = data => {
        if (client.writable) {
            client.write(data)
        } else {
            client.connect(port, host, () => {
                client.on('data', data => {
                    publish(data)
                })
                client.write(data)
            })
        }
    }

    const { publish } = PubSubConnection({
        pubSub: PubSub(),
        send: send
    })
}

export default App