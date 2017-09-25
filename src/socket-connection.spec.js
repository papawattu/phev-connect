import chai from 'chai';
import sinon from 'sinon';
import SocketConnection from './socket-connection'

const assert = chai.assert;

const client = {}
client.connect = sinon.stub()
client.write = sinon.stub()
client.writable = true
client.on = sinon.stub()
const handler = sinon.stub()

describe('Socket Connection', () => {
    let sut = null
    beforeEach(() => {
        client.write.reset()
        client.connect.reset()
        handler.reset()        
        sut = SocketConnection({ client, host: '192.168.8.46', port: 8080 })
    })
    it('Should bootstrap', () => {

        assert.isNotNull(sut)
    })
    it('Should start', () => {

        sut.start()
        assert(client.connect.calledWith(8080, '192.168.8.46'))
    })
    it('Should write', () => {
        client.writable = true
        
        sut.write(Buffer.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]))
        assert(client.write.calledWith(Buffer.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff])))
    })
    it('Should not write if socket closed', () => {
        client.writable = false
        sut.write(Buffer.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0]))
        assert(client.write.notCalled)
    })
    it('Should set up handler', () => {
        const handler = () => undefined
        
        sut.handleData(handler)
        assert(client.on.calledWith('data', handler))
    })
    it('Should call handler on incoming data', () => {
        client.on.yields(Buffer.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0]))
        
        sut.handleData(handler)
        
        assert(handler.calledWith(Buffer.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0])))
    })
})