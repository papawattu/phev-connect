import PhevManager from './phev-manager'
import { MessagingClient, SocketClient } from 'phev-messaging'
import { log } from 'phev-utils'

import net from 'net'

const App = ({ messaging, port, host } = {}) => {

    log.info('Starting PHEV connect')
    const socketConnection = MessagingClient(
        { 
            messaging: SocketClient({ port, host })
        })
    const messagingClient = MessagingClient(
        { 
            messaging 
        })

    PhevManager({ 
        incoming: messagingClient, 
        outgoing: socketConnection, 
        error: err => log.error(err)
    }).start()
}

export default App