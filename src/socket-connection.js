
const SocketConnection = ({ client, publish }) => ({
    send: data => {
        if (client.writable) {
            client.write(data)
        } else {
            
        }
    },
    connect: () => {
        new Promise ((resolve, reject) => client.connect(port, host, () => {
                client.on('data', data => {
                    publish(data)
                })
                client.on('error', err => reject(err))
                resolve(client)
            })
        )
    }
})

export default SocketConnection