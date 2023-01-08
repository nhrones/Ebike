import { fireEvent, whenEvent } from '../deps.ts'
import { HidePopup, PopupTouched } from './constants.ts'
import * as counterLabel from './counter.ts'
import * as minusButton from './minusButton.ts'
import * as plusButton from './plusButton.ts'
import * as textBox from './textbox.ts'

/** singleton App instance */
export let appInstance: App

/** The main viewmodel for this application */
export class App {

    /** DiceGame private instance, exposed by init() */
    private static _instance: App

    /** singleton App initialization */
    static init() {
        if (!App._instance) {
            App._instance = new App()
            appInstance = App._instance
        }
    }

    /** a private constructor, called from init() */
    private constructor() {

        ///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //            instantiate autonomous viewmodels               \\
        ///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        plusButton.init('addbutton')        // counter incrementer viewmodel
        minusButton.init('subtractbutton')  // counter decrementer viewmodel
        counterLabel.init('counter')        // our counter viewmodel
        textBox.init('textbox1')            // our textBox viewmodel
        
        ///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                       bind events                          \\
        ///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        // an open popup was touched; close it
        whenEvent(PopupTouched, () => {
            fireEvent(HidePopup, {})
        })

    }
}
