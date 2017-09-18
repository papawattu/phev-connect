import chai from 'chai';
import sinon from 'sinon';
import App from './app'
import EventEmitter from 'events'

const assert = chai.assert;

const config = {}
const mqtt = {}
const client = new EventEmitter()

client.subscribe = sinon.stub()
client.publish = (topic, message) => client.emit('message', topic, message)
client.end = sinon.stub()
mqtt.connect = sinon.stub()
mqtt.connect.returns(client)

config.mqtt = mqtt
config.vin = '1234'
config.mqttUri = 'mqtt://localhost'

describe('App', () => {

    it('Should bootstrap', () => {

        const sut = App(config)

        assert.isObject(sut)
    })
    it('Should throw error if VIN not in config', () => {
        const config = {}
        config.mqttUri = 'mqtt://localhost'

        assert.throws(() => App(config), 'Config Error - Missing VIN')
    })
    it('Should throw error if MQTT URI not in config', () => {
        const config = {}
        config.vin = ''

        assert.throws(() => App(config), 'Config Error - Missing MQTT Uri')
    })
})
describe('isConnected', () => {
    it('Should be false at startup', done => {
        const { isConnected, stop } = App(config)

        const sub = isConnected(connected => {
            assert(!connected)
            done()
        })
        sub.unsubscribe()
    })
    it('Should be true when connect message received', done => {
        const { isConnected } = App(config)
        let count = 0
        const sub = isConnected(connected => {
            if (count > 0) {
                assert(connected)
                sub.unsubscribe()
                done()
            }
            count++
        })

        client.emit('message', 'phev/connect/1234', true)
    })
    it('Should be false when disconnect message received', done => {
        let count = 0
        const { isConnected } = App(config)

        const sub = isConnected(connected => {
            if (count > 1) {
                assert.isFalse(connected)
                sub.unsubscribe()
                done()
            }
            count++
        })
        client.emit('message', 'phev/connect/1234', true)
        client.emit('message', 'phev/connect/1234', false)
    })
    it('Should be handle more than one subscription', done => {
        let count = 0
        const { isConnected } = App(config)

        const sub = isConnected(connected => {
            if (count > 1) {
                assert.isTrue(connected)
                sub.unsubscribe()
            }
            count++
        })
        const sub2 = isConnected(connected => {
            if (count > 1) {
                assert.isTrue(connected)
                sub2.unsubscribe()
                done()
            }
            count++
        })
        client.emit('message', 'phev/connect/1234', true)

    })
    it('Should be called once when two disconnects received', done => {
        let count = 0
        const { isConnected } = App(config)

        const sub = isConnected(connected => {
            if (count > 0) {
                assert.isFalse(connected)
                sub.unsubscribe()
                done()
            }
            count++
        })
        client.emit('message', 'phev/connect/1234', false)
        client.emit('message', 'phev/connect/1234', false)
    })
    it('Should be called once when multiple connects received', done => {
        let count = 0
        const { isConnected } = App(config)

        const sub = isConnected(connected => {
            if (count > 0) {
                assert.isTrue(connected)
                sub.unsubscribe()
                done()
            }
            count++
        })
        client.emit('message', 'phev/connect/1234', true)
        client.emit('message', 'phev/connect/1234', true)
        client.emit('message', 'phev/connect/1234', true)
    })
})