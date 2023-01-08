import {
    WC,
    winCFG,
    ctx,
    Path2D,
    fireEvent,
    whenEvent,
    ElementDescriptor,
    Location,
    WidgetSize,
    View
} from '../deps.ts'
import { UpdateButton, ButtonTouched } from '../ViewModels/constants.ts'

// 
/** A virtual Button view class */
export default class ButtonWidget implements View {

    id = 0
    activeView = true
    index = -1
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
    textLeft = 0
    textTop = 0
    text = ""

    /** ctor that instantiates a new vitual Button view */
    constructor(el: ElementDescriptor) {
        this.name = el.id
        this.zOrder = 0
        this.position = el.position
        const { left, top } = el.position

        this.size = el.size || { width: 50, height: 30 }
        const { width, height } = this.size

        this.enabled = true
        this.path = this.buildPath(el.radius || 10)
        this.color = el.color || 'green'
        this.textColor = 'white'
        this.text = el.text || "??"

        this.textLeft = left + width * 0.5
        this.textTop = top + 32

        this.render()

        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                         bind events                       \\
        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        // the controller will emit this event whenever it needs to update this view
        whenEvent(UpdateButton + this.name,
            () => {
                this.render()
            })
    }
    /** build the Path2D */
    buildPath(radius: number) {
        const path = new Path2D
        path.roundRect(
            this.position.left, this.position.top,
            this.size.width, this.size.height, radius
        )
        return path
    }

    /** called from Surface.canvasEvents 
        when this element is touched */
    touched() {
        if (this.enabled) {
            fireEvent(ButtonTouched + this.name, {})
        }
    }

    /** updates and renders this view 
     *  called from Surface.canvasEvents (hover test) */
    update() {
        this.render()
    }

    /** render this Button view onto the canvas */
    render() {
        ctx.save()
        ctx.lineWidth = 5
        ctx.strokeStyle = (this.hovered) ? 'orange' : 'black'
        ctx.stroke(this.path)
        ctx.fillStyle = this.color
        ctx.fill(this.path)
        ctx.fillStyle = 'white'
        ctx.fillText(" " + this.text + " ", this.textLeft, this.textTop)
        ctx.restore()
        WC.dirty()
    }
}
