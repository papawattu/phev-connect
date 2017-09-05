import chai from 'chai'
import sinon from 'sinon'
import EventEmitter from 'events'
import PhevConnect from './phev_connect'
import PhevMqtt from 'phev-mqtt'
const assert = chai.assert;

const mqtt = {} 
const client = new EventEmitter()

client.subscribe = sinon.stub()
mqtt.connect = sinon.stub()
mqtt.connect.returns(client)
mqtt.subscribe = sinon.stub()

describe('phev connect', () => {
    
    it('Should bootstrap', () => {
        
        const sut = PhevConnect({mqtt, uri: ''})
        
        assert(sut.connect)
    })
})