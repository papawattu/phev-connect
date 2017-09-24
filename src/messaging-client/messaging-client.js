const MessagingClient = client => ({
    start: client.start,
    registerHandler: client.registerHandler,
    publish: client.publish
})

export default MessagingClient