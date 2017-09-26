import SocketConnection from './socket-connection'
import PhevManager from './phev-manager'
import MessagingClient from './messaging-client'
import { log } from 'phev-utils'

const App = ({ messaging, port, host } = {}) => {

    log.info('Starting PHEV connect')
    const socketConnection = MessagingClient({ messaging: SocketConnection({ port, host })})
    const messagingClient = MessagingClient({ messaging })

    PhevManager({ incoming: messagingClient, outgoing: socketConnection, error: err => log.error(err)}).start()
}

export default App