import net from 'net'
import { log } from 'phev-utils'

const SocketConnection = ({ client = new net.Socket(), host, port } = {}) => ({
    publish: data => client.writable ? client.write(data) : undefined,
    start: () => new Promise((resolve, reject) => {
        client.on('error', err => {
            log.error(err)
            reject(err)
        })
        client.connect(port, host)
    }),
    registerHandler: handler => client.on('data', handler),
})

export default SocketConnection