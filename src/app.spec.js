import chai from 'chai';
import sinon from 'sinon';
import App from './app'

const assert = chai.assert;
const messagingClient = {}
messagingClient.registerHandler = sinon.stub()

messagingClient.start = sinon.stub()
messagingClient.start.returns(Promise.resolve())
describe('App', () => {
    let sut 
    beforeEach(() => {
        sut = App({ messaging: messagingClient })
    })
    it('Should bootstrap', () => {

        App({ messaging: messagingClient })
    })
    it('Should start messaging', () => {

        assert(messagingClient.start.called)
    })
})