import { fireEvent, whenEvent} from '../deps.ts'
import { ButtonTouched, IncrementCount } from './constants.ts'

// used to recognize events from our (decoupled) view
let thisID: string;

 /**  called from `app` viewmodel ctor */ 
export const init = (id: string) => {
    
    thisID = id
    
    // listens for a touch event from a buttom named 'addButton
    whenEvent(`${ButtonTouched}${thisID}`, () => {
        // fire an event to increment the counter
        // counterLabel-viewmodel listens for this event
        fireEvent(IncrementCount, {})
    })
}
