import chai from 'chai'
import sinon from 'sinon'
import PhevConnect from './phev-connect'
import EventEmitter from 'events'
import { Observable } from 'rxjs'

const assert = chai.assert;

const config = {}
const mqtt = {}
const client = new EventEmitter()

client.subscribe = sinon.stub()
client.publish = sinon.stub()
mqtt.connect = sinon.stub()
mqtt.connect.returns(client)

config.mqtt = mqtt
config.vin = '1234'
config.mqttUri = 'mqtt://localhost'

const observableMqtt = sinon.stub()

const ret = { 
    send : sinon.stub(),
    messages: () => Observable.of('1234')
}

observableMqtt.returns(ret)
    
describe('PHEV connect', () => {
    
    it('Should bootstrap', () => {
        
        const sut = PhevConnect({ observableMqtt })
        
        assert(sut)
    })
})