
import { whenEvent } from '../deps.ts'
import { TextBoxTouched, Focused } from './constants.ts'
import { LiveText } from './liveText.ts'

// used to recognize events from our (decoupled) view
let thisID: string;
let liveText: LiveText

/**  called from `app` viewmodel ctor */
export const init = (id: string) => {

    thisID = id;

    liveText = new LiveText(thisID)

    // listens for a touch event
    whenEvent(TextBoxTouched + thisID, () => {
        //focused = true
        liveText.updateText(true)
    })

    whenEvent(Focused + thisID, (hasFocus: boolean) => {
        //focused = hasFocus
        liveText.updateText(hasFocus)
    })

}
