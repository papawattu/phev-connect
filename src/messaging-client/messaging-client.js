const MessagingClient = ({ messaging }) => ({
    start: messaging.start,
    registerHandler: messaging.registerHandler,
    publish: messaging.publish
})

export default MessagingClient