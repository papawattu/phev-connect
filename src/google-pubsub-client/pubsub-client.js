import PubSub from '@google-cloud/pubsub'

const PubSubClient = ({ pubSub = PubSub(), topicName = 'receive', subscriptionName = 'send' }) => {

    let topic, publisher

    const start = () => {

        topic = pubSub.topic(topicName)
        publisher = topic.publisher();

    }
    const publish = message => publisher.publish(message)
        .then((results) => results[0])

    const registerHandler = handler => {

        const subscription = pubSub.subscription(subscriptionName)

        subscription.on('message', message => { 
            handler(message.data)
            message.ack()
        })
    }
    return { 
        start: start,
        publish: publish,
        registerHandler: registerHandler,
    }

}

export default PubSubClient