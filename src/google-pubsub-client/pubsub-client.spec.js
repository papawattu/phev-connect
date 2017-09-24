import chai from 'chai'
import sinon from 'sinon'
import PubSubClient from './pubsub-client'
import EventEmitter from 'events'

const assert = chai.assert;
const topic = {}
const publisher = {}
const subscription = {}
subscription.on = sinon.stub()
topic.publisher = sinon.stub()
topic.publisher.returns(publisher)

const pubSub = {}

pubSub.subscription = sinon.stub()
pubSub.subscription.returns(subscription)
pubSub.topic = sinon.stub()
pubSub.topic.returns(topic)

const client = {}
client.send = sinon.stub()
client.connect = sinon.stub()
client.on = sinon.stub()
client.writeable = true

const handler = sinon.stub()
const send = sinon.stub()

describe('Pub Sub connect', () => {
    let sut = null
    beforeEach(() => {
        sut = PubSubClient({ pubSub, send })
    })

    it('Should specify topic', () => {
        sut.start()
        assert(pubSub.topic.calledWith('receive'))
    })
    it('Should subscribe', () => {
        sut.start()
        sut.registerHandler(handler)
        assert(pubSub.subscription.calledWith('send'))
    })
    it('Should listen on message', () => {

        sut.start()
        
        assert(subscription.on.calledWith('message'))
    })
    it('Should listen on message', () => {
        sut.start()
        
        assert(subscription.on.calledWith('message'))
    })
    it('Should acknowledge message', () => {
        sut.start()
        
        const message = {
            data: Buffer.from([0]),
            ack: sinon.stub()
        }

        subscription.on.yield(message)
        assert(message.ack.called)
    })
    it('Should call handler on incoming message', () => {

        const message = {
            data: Buffer.from([0]),
            ack: sinon.stub()
        }
        sut.start()
        sut.registerHandler(handler)
        
        subscription.on.yield(message)
        assert(handler.calledWith(Buffer.from([0])))
    })
})