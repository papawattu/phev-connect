import chai from 'chai';
import sinon from 'sinon';
import { Observable } from 'rxjs'
import { send, messages, subscribe, unsubscribe } from './mqtt_client'
import {
    pingInterval, pingMessage, reply, sendMessage, receivedMessages, splitMessages,
    decodedMessages, expectedResponse, generateChecksum, generateChecksum2, startPing,
    pingResponseMessages
} from './car_service'

const assert = chai.assert;

describe('Car service', () => {
    it('Should send message', () => {

        const sub = messages('phev/send')
        subscribe('phev/send')

        const s = sub.subscribe(x => {
            assert.deepEqual(x.message, Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00]))
            s.unsubscribe()
            unsubscribe('phev/send')
        })
        sendMessage(Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00]))


    })
    it('Should receive message', (done) => {
        const sub = receivedMessages()
        const s = sub.subscribe(x => {
            assert.deepEqual(x, Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x76]))
            s.unsubscribe()
            done()
        })

        send('phev/receive', Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x76]))

    })
    it('Should receive split up messages', (done) => {
        const sub = splitMessages()
        let times = 0
        const s = sub.subscribe(x => {
            times++
            if (times == 1) assert.deepEqual(x, Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x76]))
            if (times == 2) {
                assert.deepEqual(x, Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x78]))
                s.unsubscribe()
                done()
            }
        })

        send('phev/receive', Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x76, 0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x78]))

    })
    it('Should receive decoded messages', (done) => {
        const sub = decodedMessages()
        const s = sub.subscribe(x => {
            assert.deepEqual(x,
                {
                    command: 0xf6,
                    length: 5,
                    type: 0,
                    register: 1,
                    data: Buffer.from([1, 0]),
                    checksum: 0x76
                })
            s.unsubscribe()
            done()
        })

        send('phev/receive', Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x76, 0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x78]))

    })
    it('Should send and wait for response', (done) => {
        const sub = decodedMessages()
        const s = sub.subscribe(x => {
            assert.deepEqual(x,
                {
                    command: 0xf6,
                    length: 5,
                    type: 0,
                    register: 1,
                    data: Buffer.from([1, 0]),
                    checksum: 0x76
                })
            s.unsubscribe()
            done()
        })

        send('phev/receive', Buffer.from([0xf6, 0x05, 0x00, 0x01, 0x01, 0x00, 0x76]))

    })
    it('Should return response', (done) => {
        const sub = reply({
            command: 0xf6,
            length: 4,
            type: 0,
            register: 1,
            data: Buffer.from([0]),
            checksum: 0x76
        }, 2000)
        const s = sub.subscribe(x => {
            assert.deepEqual(x,
                {
                    command: 0x6f,
                    length: 4,
                    type: 1,
                    register: 1,
                    data: Buffer.from([0]),
                    checksum: 0x76
                })
            s.unsubscribe()
            done()
        })

        send('phev/receive', Buffer.from([0x6f, 0x04, 0x01, 0x01, 0x00, 0x76]))

    })
    it('Should timeout response', (done) => {
        const sub = reply({
            command: 0xf6,
            length: 4,
            type: 0,
            register: 1,
            data: Buffer.from([0]),
            checksum: 0x76
        }, 50)
        const s = sub.subscribe(
            x => assert.fail()
            , err => {
                done()
                sub.unsubscribe()
            })

    })
    it('Should create expected reponse', () => {

        const sut = expectedResponse(
            {
                command: 0xf6,
                length: 4,
                type: 0,
                register: 1,
                data: Buffer.from([0]),
            })

        assert.deepEqual(sut,
            {
                command: 0x6f,
                length: 4,
                type: 1,
                register: 1,
                data: Buffer.from([0]),
            })
    })
    it('Should start pinging then timeout ', (done) => {

        const sub = startPing(10, 1000).subscribe(x => {
            assert.fail('Should not get here')
            done()
        },()=> {
            done()
        },() => {
            assert.fail('Should not get here')
            console.log('Complete')
            done()
        })

        const test = new Observable.interval(10)
            .delay(10)
            .map(x => x % 100)
            .take(101)
            .subscribe(x => {
                send('phev/receive', Buffer.from([0x9f, 0x04, 0x01, x, 0x06, 0xaa]))
            })
    })
    it('Should return ping respone', (done) => {

        const sub = pingResponseMessages(0).subscribe(x => {
            sub.unsubscribe()
            done()
        })

        send('phev/receive', Buffer.from([0x9f, 0x04, 0x01, 0x00, 0x06, 0xaa]))

    })
    it('Should return ping respone', (done) => {

        const sub = pingInterval(100)
            .take(1)
            .subscribe(x => {
                assert(x === 0)
            })
        const sub2 = pingResponseMessages()
            .subscribe(x => {
                assert(x === 0)
                done()
            })

        send('phev/receive', Buffer.from([0x9f, 0x04, 0x01, 0x00, 0x06, 0xaa]))

    })
})