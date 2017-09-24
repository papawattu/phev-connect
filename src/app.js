import PubSub from '@google-cloud/pubsub'
import net from 'net'
import SocketConnection from './socket-connection'

const App = ({ port = 8080, host = '192.168.8.46' } = {}) => {

    const client = new net.Socket()

    const { connect, send } = SocketConnection({ client })
    
}

export default App