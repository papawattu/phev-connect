import chai from 'chai';
import sinon from 'sinon';
import SocketConnection from './socket-connection'

const assert = chai.assert;

const client = {}

describe('Socket Connection', () => {

    it('Should bootstrap', () => {

        SocketConnection({ client })
    })
})