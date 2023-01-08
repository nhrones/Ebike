import {
    ctx,
    Path2D,
    fireEvent,
    whenEvent,
    ElementDescriptor,
    Location,
    tickCount,
    WidgetSize,
    View
} from '../deps.ts'

import {
    HAIRSPACE,
    CURSORBAR,
    TextBoxTouched,
    CharacterLength,
    UpdateText,
} from '../ViewModels/constants.ts'

let cursorChar = HAIRSPACE
const placeholder = 'text'

export default class TextWidget implements View {

    id = 0
    activeView = true
    index = 1
    zOrder = 0
    name = ''
    enabled = true
    hovered = false
    focused = false
    path: Path2D
    size: WidgetSize
    position: Location
    color: string
    textColor: string
    text = ""
    trimmedText = ""
    trimmedLeft = ""
    trimmedRight = ''
    cursorPosition = 0
    selectedStart = 0
    selectedEnd = 0
    /** the number of characters that will fit in this width  */
    numOfCharsThatFit = 0
    showPlaceholder = true

    constructor(el: ElementDescriptor) {
        this.name = el.id
        this.position = el.position
        this.size = el.size || { width: 100, height: 40 }
        this.color = el.color || 'white'
        this.textColor = 'black'
        this.path = new Path2D
        this.path.rect(
            this.position.left,
            this.position.top,
            this.size.width,
            this.size.height
        )
 
        // calc the fit - ~ 16px per char
        this.numOfCharsThatFit = (this.size.width / 16) | 0
        fireEvent(CharacterLength + this.name, this.numOfCharsThatFit)
        
        // the VM will emit this event whenever it needs to update text            
        whenEvent(UpdateText + this.name, (data) => {         
            let { viewport, focused, cursorPosition, selectedStart, selectedEnd} = data
            this.cursorPosition = cursorPosition
            this.selectedStart = selectedStart
            this.selectedEnd = selectedEnd
            this.focused = focused
            this.text = viewport
            this.trimmedText = this.text
            this.showPlaceholder = (this.text.length === 0)
            if (this.focused === true) {
                cursorChar = CURSORBAR
                while (this.getUnusedSpace() < 18) { // pixel space remaining in textbox
                    this.trimmedText = this.trimmedText.substring(1)
                }
            } else { // just show text right trimmed
                this.trimmedText = this.text.substring(0, this.numOfCharsThatFit)
            }
            // track and move the curser position 
            this.positionCursor()
            this.render()
        })

        this.render() // initial render

    }

    getUnusedSpace() {
        return this.size.width - ctx.measureText(this.trimmedText).width;
    }

    positionCursor() {
        let { trimmedText: tt, cursorPosition: co } = this

        // set cursorPosition
        this.trimmedLeft = tt.substring(0, co);
        this.trimmedRight = tt.substring(co);

    }

    touched() {
        fireEvent(TextBoxTouched + this.name, {})
    }

    update() {
        this.render()
    }

    render() {
        // blink the cursor
        if (this.focused === true) {
            if (tickCount === 30) cursorChar = HAIRSPACE
            if (tickCount === 0) cursorChar = CURSORBAR
        } else {
            cursorChar = ' '
        }

        ctx.save()
        ctx.lineWidth = 2
        if (this.focused === false) {
            ctx.strokeStyle = (this.hovered) ? 'orange' : 'black'
            ctx.fillStyle = this.color
        } else {
            ctx.strokeStyle = 'blue'
            ctx.fillStyle = "white"
        }
        ctx.stroke(this.path)
        ctx.fill(this.path)
        ctx.restore()
        ctx.textAlign = 'left'
        if (this.showPlaceholder && this.focused === false) {
            ctx.fillStyle = 'Gray'
            ctx.fillText(placeholder, this.position.left + 5, this.position.top + 35)
        } else {
            ctx.fillStyle = this.textColor
            ctx.fillText(
                this.trimmedLeft + cursorChar + this.trimmedRight,
                this.position.left + 5, //padding
                this.position.top + 35
            )
        }
        ctx.textAlign = 'center'
        ctx.restore()
    }
}