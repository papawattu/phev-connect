import net from 'net'
import SocketConnection from './socket-connection'
import PhevManager from './phev-manager'
import MessagingClient from './messaging-client'
import { log } from 'phev-utils'

const App = ({ messaging, client = new net.Socket(), port = 8080, host = '192.168.8.46' } = {}) => {

    log.info('Starting PHEV connect')
    const socketConnection = SocketConnection({ client })
    const messagingClient = MessagingClient({ messaging })

    PhevManager({messagingClient, socketConnection}).start()
}

export default App