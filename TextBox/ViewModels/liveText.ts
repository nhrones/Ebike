import { fireEvent, whenEvent, WindowKeyboardEvent, WindowInputEvent } from '../deps.ts'
import {
    Backspace, Enter, Delete, LeftArrow, RightArrow,
    UpdateText, Focused, CharacterLength,
    WindowKeyDown, WindowInput
} from './constants.ts'

export class LiveText {

    /** an identifier string usually shared with a widget */
    id = '';

    /** the number of chars this view can show */
    textCapacity = 0;

    /** the current full text */
    fullText = '';

    /** start position of viewport in fullText */
    viewportStart = 0;

    /** the length of characters to be displayed */
    viewportLength = 0;

    /** does the client Widget have the focus? */
    focused = false;

    // char pointers
    cursorPosition = 0;
    selectedStart = 0;
    selectedEnd = 0;

    /** LiveText ctor */
    constructor(id: string) {

        // host VM sets the identity of this instance 
        this.id = id

        // a widget or VM reports the length of characters it can display
        whenEvent(CharacterLength + this.id, (size: number) => {
            console.log(`Host reports capacity of: ${size}`)
            this.textCapacity = size
        })


        // Register an `Input` eventhandler-> data: string
        whenEvent(WindowInput + this.id, (evt: WindowInputEvent) => {
            
            console.log(`---- cursorPosition: ${this.cursorPosition} < this.viewportLength: ${this.getViewportLength()}`)

            if (this.cursorPosition < this.getViewportLength() ) { // insert new char at cursor
                console.log(`---- inserting new char at cursor`)
                let where = this.viewportStart + this.cursorPosition
                let left = this.fullText.substring(0, where);
                let right = this.fullText.substring(where);
                this.fullText = left + evt.data + right
            }
            else { // insert new char at end
                this.fullText += evt.data
                this.cursorPosition++
            }
                console.log(`input - full.length: ${this.fullText.length} capacity: ${this.textCapacity} `)

                if (this.fullText.length >= this.textCapacity) {
                    this.viewportStart++
                    this.cursorPosition--
                }
                this.updateText(this.focused)
            })

        // register a `KeyDown` eventhandler for: enter, backspace, delete, left, right, shiftKey, ctrlKey  
        whenEvent(WindowKeyDown + this.id, (evt: WindowKeyboardEvent) => {

            const { altKey, ctrlKey, shiftKey, } = evt
            this.focused = true

            switch (evt.code) {

                case Backspace: // FIX backspace last char ???
                    let where = this.viewportStart + this.cursorPosition
                    let left = this.fullText.substring(0, where - 1);
                    let right = this.fullText.substring(where)
                    this.fullText = left + right
                    this.cursorPosition--
                    break;
                //TODO fix cursor move after delete, backspace    
                case Delete: {
                    //if (? < 0) {
                    let where = this.viewportStart + this.cursorPosition
                    let left = this.fullText.substring(0, where)
                    let right = this.fullText.substring(1 + where)
                    this.fullText = left + right
                    this.viewportLength--
                    //}
                    break;
                }
                case LeftArrow:
                    if (this.fullText.length > 1) {
                        this.cursorPosition--
                        console.log(`    LeftArrow set cursorPosition: ${this.cursorPosition}`)
                        if (this.cursorPosition < 0) {
                            this.cursorPosition = 0;
                            console.log(`    LeftArrow reset negative cursorPosition: ${this.cursorPosition}`)
                            if (this.viewportLength >= this.textCapacity) {
                                this.viewportStart--;
                                console.log(`    LeftArrow decrement viewportStart: ${this.viewportStart}`)
                            }
                        }
                        //TODO need to slide view when chars are hidden left

                        //if (this.viewportStart = this.cursorPosition) {
                        //    this.viewportStart--
                        //}
                        //console.log(`    LefttArrow set cursorPosition: ${this.cursorPosition}`)
                    }
                    break;

                case RightArrow:
                    if (this.fullText.length > 1) {
                        if (this.viewportStart < 0) {
                            this.viewportStart++
                            this.cursorPosition++
                        } else {
                            this.cursorPosition++
                        }

                        if (this.cursorPosition >= this.textCapacity) {
                            this.viewportStart++
                            console.log('    RightArraow -- cursor > capacity')
                            if (this.getViewportLength() < this.textCapacity) { //fix this
                                this.viewportStart--
                                console.log(`        RightArraow -- ViewportLength ${this.getViewportLength()} < capacity ${this.textCapacity}`)
                            }
                        }
                    }
                    break;

                case Enter:
                    this.focused = false
                    this.cursorPosition = 0
                    break;
                default:
                    break;
            }

            this.updateText(this.focused)
        })
    }
    getViewportLength() {
        return this.fullText.length - this.viewportStart
    }
    // Fire an event to update the hosts text view
    updateText(hasfocus: boolean) {

        this.focused = hasfocus

        const { focused, cursorPosition, selectedStart, selectedEnd } = this
        let viewport = this.fullText.substring(
            this.viewportStart, this.viewportStart + this.textCapacity
        ) || ""
        console.log(`Viewport: ${viewport}, length: ${viewport.length}, viewportStart: ${this.viewportStart}, cursorPosition: ${cursorPosition}`)
        console.log()
        fireEvent(UpdateText + this.id,
            {
                viewport,
                focused,
                cursorPosition,
                selectedStart,
                selectedEnd,
            })
    }

}