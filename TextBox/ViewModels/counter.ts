import { fireEvent, whenEvent } from '../deps.ts'
import {
    IncrementCount,
    DecrementCount,
    ShowPopup,
    UpdateLabel
} from './constants.ts'

// used to recognize events from our (decoupled) view
let thisID: string;

/** The count that is mutated / displayed by the UI */
let count = 0

/**  called from the `app` viewmodel ctor */
export const init = (id: string) => {

    thisID = id

    whenEvent(IncrementCount, () => {
        count += 1

        if (count > 2) {
            fireEvent(ShowPopup, { message: 'Oh Nooo, Too High' + '\n' + '  Click anywhere!' })
            count = 0
        }

        let thiscolor = (count < 0) ? "red" : "green"
        if (count === 0) thiscolor = "snow"

        // update the `count` label                   
        fireEvent(UpdateLabel + thisID,
            {
                state: 0,
                color: thiscolor,
                textColor: (count === 0) ? "black" : "white",
                text: count + ""
            }
        )
    })

    whenEvent(DecrementCount, () => {
        count -= 1

        if (count < -2) {
            fireEvent(ShowPopup, { message: 'Oh Nooo, Too Low' + '\n' + '  Click anywhere!' })
            count = 0
        }

        let thiscolor = (count < 0) ? "red" : "green"
        if (count === 0) thiscolor = "snow"

        // update the `count` label                   
        fireEvent(UpdateLabel + thisID,
            {
                state: 0,
                color: thiscolor,
                textColor: (count === 0) ? "black" : "white",
                text: count + ""
            }
        )
    })
}