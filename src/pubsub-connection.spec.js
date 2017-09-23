import chai from 'chai'
import sinon from 'sinon'
import PubSubConnection from './pubsub-connection'
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

const send = sinon.stub()

describe('PHEV connect', () => {
    beforeEach(() => {
        PubSubConnection({ pubSub, send })
    })

    it('Should specify topic', () => {

        assert(pubSub.topic.calledWith('receive'))
    })
    it('Should subscribe', () => {

        assert(pubSub.subscription.calledWith('send'))
    })
    it('Should listen on message', () => {

        assert(subscription.on.calledWith('message'))
    })
    it('Should listen on message', () => {

        assert(subscription.on.calledWith('message'))
    })
    it('Should acknowledge message', () => {

        const message = {
            data: Buffer.from([0]),
            ack: sinon.stub()
        }

        subscription.on.yield(message)
        assert(message.ack.called)
    })
    it('Should call send on incoming message', () => {

        const message = {
            data: Buffer.from([0]),
            ack: sinon.stub()
        }

        subscription.on.yield(message)
        assert(send.calledWith(Buffer.from([0])))
    })
})