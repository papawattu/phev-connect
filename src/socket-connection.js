import net from 'net'

const SocketConnection = ({ client = new net.Socket() } = {}) => ({
    write: data => client.writable ? client.write(data) : undefined,
    start: () => client.connect(port, host),
    handleData: handler => client.on('data', handler),
    connected: client.writable
})

export default SocketConnection