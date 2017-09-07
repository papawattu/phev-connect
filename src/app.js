import PhevConnect from './phev_connect'

const App = (config) => {

    const phevConnect = PhevConnect(config)
    
    const start = () => {
        phevConnect.connect()
    }
    const stop = () => undefined
    
    return {
        start: start,
        stop: stop
    }
}

export default App