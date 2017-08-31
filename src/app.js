import { startPing } from './car_service'
import { Observable } from 'rxjs'

const pingSub = startPing(3000, 5000)
.retryWhen(errors => errors
    //log error message
    .do(err => console.log('Ping ' + err + ' restarting in 5 seconds'))
    //restart in 5 seconds
    .delayWhen(val => Observable.timer(5000))
)
.subscribe(x => {
    x.subscribe(y => console.log('+++' + y), err => {
        console.log('Error1 ' + err)
        pingSub.unsubscribe()
    })
})