import SocketConnection from './socket-connection'
import PhevManager from './phev-manager'
import MessagingClient from './messaging-client'
import { log } from 'phev-utils'

const App = ({ messaging } = {}) => {

    log.info('Starting PHEV connect')
    const socketConnection = SocketConnection()
    const messagingClient = MessagingClient({ messaging })

    PhevManager({messagingClient, socketConnection}).start()
}

export default App