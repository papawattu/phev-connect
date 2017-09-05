import chai from 'chai';
import sinon from 'sinon';
import App from './app'

const assert = chai.assert;

describe('App', () => {
    
    it('Should bootstrap', () => {
        
        const sut = App()
        
        assert(sut.start)
        assert(sut.stop)
    })
})