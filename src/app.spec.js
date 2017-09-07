import chai from 'chai';
import sinon from 'sinon';
import App from './app'
import { stub_mqtt } from 'phev-mqtt'

const assert = chai.assert;

describe('App', () => {
    
    it('Should bootstrap', () => {
        const sut = App()
        
        assert(sut.start)
        assert(sut.stop)
    })
    it('Should bootstrap with mqtt passed', () => {
        const sut = App({mqtt : stub_mqtt})
        
        assert(sut.start)
        assert(sut.stop)
    })
})