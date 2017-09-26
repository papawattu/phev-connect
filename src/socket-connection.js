import net from 'net'

const SocketConnection = ({ client = new net.Socket(), host, port } = {}) => ({
    publish: data => client.writable ? client.write(data) : undefined,
    start: () => client.connect(port, host),
    registerHandler: handler => client.on('data', handler),
})

export default SocketConnection