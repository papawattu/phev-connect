const log = require('phev-utils').log

const port      = process.env.PORT || 8080
const host      = process.env.HOST || '192.168.8.46'
const mqttUri   = process.env.MQTTURI || 'mqtt://secure.wattu.com'

const isMqtt    = process.env.TRANSPORT === 'mqtt'
const messaging = isMqtt ? require('./mqtt-client').default({mqttUri}) : require('./google-pubsub-client').default()

log.info('Messaging is ' + (process.env.TRANSPORT || 'Google PubSub'))
log.info('Server host is ' + host)
log.info('Server port is ' + port)
log.info(isMqtt ? 'MQTT URI is ' + mqttUri : '')

require('./app').default({ messaging, port, host, mqttUri })