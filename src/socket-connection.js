
const SocketConnection = ({ client, publish }) => ({
    send: data => {
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
})

export default SocketConnection