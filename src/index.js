const messaging = process.env.TRANSPORT === 'mqtt' 
    ? require('./mqtt-client').default() 
    : require('./google-pubsub-client').default()
console.log('Messaging is ' + (process.env.TRANSPORT === 'mqtt' ? 'MQTT' : 'Google PubSub'))
require('./app').default({messaging})