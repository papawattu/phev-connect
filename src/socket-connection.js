
const SocketConnection = ({ client, port = 8080, host = '192.168.8.46' }) => ({
    write: data => client.writable ? client.write(data) : undefined,
    start: () => client.connect(port, host),
    handleData: handler => client.on('data', handler),
    connected: client.writable
})

export default SocketConnection