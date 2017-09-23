const PubSubConnection = ({ pubSub, send, topicName = 'receive', subscriptionName = 'send' }) => {

    const topic = pubSub.topic(topicName)

    const publisher = topic.publisher();

    const publish = message => publisher.publish(message)
        .then((results) => results[0])

    const subscription = pubSub.subscription(subscriptionName)
    
    subscription.on('message', message => {

        message.ack()
        
        send(message.data)
    })
    return {
        publish: publish,

    }
}

export default PubSubConnection