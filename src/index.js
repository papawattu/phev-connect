const messaging = process.env.TRANSPORT === 'mqtt' 
    ? require('./mqtt-client').default() 
    : require('./google-pubsub-client').default()

require('./app').default({messaging})