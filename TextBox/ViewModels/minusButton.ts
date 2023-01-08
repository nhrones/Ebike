import { fireEvent, whenEvent} from '../deps.ts'
import { ButtonTouched, DecrementCount } from './constants.ts'

// used to recognize events from our (decoupled) view
let thisID: string;

 /**  called from `app` viewmodel ctor */ 
export const init = (id: string) => {
    
    thisID = id
    
    // listens for a touch event from a buttom named 'subtractbutton'
    whenEvent(`${ButtonTouched}${thisID}`, () => {   
        // fire an event to decrement the counter
        // counterLabel-viewmodel listens for this event
        fireEvent(DecrementCount, {} )
    })
}
