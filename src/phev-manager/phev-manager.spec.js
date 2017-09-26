import chai from 'chai';
import sinon from 'sinon';
import PhevManager from './phev-manager'

const assert = chai.assert;

const messagingClient = {}
messagingClient.start = sinon.stub()
messagingClient.registerHandler = sinon.stub()
messagingClient.publish = sinon.stub()

const socketConnection = {}
socketConnection.start = sinon.stub()
socketConnection.connected = false
socketConnection.publish = sinon.stub()
socketConnection.registerHandler = sinon.stub()

const error = sinon.stub()

describe('Phev Manager', () => {
    let sut = null
    beforeEach(() => {
        sut = PhevManager({
            incoming: messagingClient,
            outgoing: socketConnection,
            error,
        })

    })
    it('Should start messaging client', () => {        
        sut.start()
        assert(messagingClient.start.calledOnce, 'Expected messaging client start to be called')
    })
    it('Should register message handler', () => {        
        sut.start()
        assert(messagingClient.registerHandler.called, 'Expected register handler to be called')
    })
    it('Should reject invalid message ', () => {        
        messagingClient.registerHandler.yields(Buffer.from([0x00]))
        sut.start()
        assert(error.calledWith('Invalid message'), 'Expected error handler to be called')
        assert(socketConnection.publish.notCalled)
    })
    it('Should start connect to host when start message received', () => {        
        messagingClient.registerHandler.yields(Buffer.from([0xf2,0x0a,0x00,0x01,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0xff]))
        sut.start()
        assert(socketConnection.start.called, 'Expected socket client to be called')
    })
    it('Should send valid message to client', () => {        
        const message = Buffer.from([0xf2,0x0a,0x00,0x01,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0xff])

        messagingClient.registerHandler.yields(message)
        sut.start()
        assert(socketConnection.publish.calledWith(message), 'Expected write to be called')
    })
})