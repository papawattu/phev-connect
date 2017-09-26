const log = require('phev-utils').log

const port = process.env.PORT || 8080
const host = process.env.HOST || '192.168.8.46'
const mqttUri = process.env.MQTTURI || 'mqtt://secure.wattu.com'
const topicName = process.env.TOPIC || 'phev/receive'
const subscriptionName = process.env.SUBSCRIPTION || 'phev/send'

const isMqtt = process.env.TRANSPORT === 'mqtt'
const messaging = isMqtt ? require('phev-messaging').MqttClient({ mqttUri, topicName, subscriptionName }) : require('phev-messaging').PubSubClient()

log.info('Messaging is ' + (process.env.TRANSPORT || 'Google PubSub'))
log.info('Server host is ' + host)
log.info('Server port is ' + port)
log.info('Topic is ' + topicName)
log.info('Subscription name is ' + subscriptionName)
log.info(isMqtt ? 'MQTT URI is ' + mqttUri : '')

require('./app').default({ messaging, port, host })