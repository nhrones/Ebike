import {
    winCFG,
    fontColor,
    ctx,
    Path2D,
    whenEvent,
    Location,
    WidgetSize,
    View,
    ElementDescriptor
} from '../deps.ts'

import { UpdateLabel } from '../ViewModels/constants.ts'

const LabelState = {
    Normal: 0,
    Hovered: 1,
    HoveredOwned: 2,
    Reset: 3
}

/** A virtual Label view class */
export default class LabelWidget implements View {

    id = 0 // assigned by activeViews.add()
    activeView = false
    enabled = false
    hovered = false
    focused = false
    path = new Path2D()
    index = 0
    zOrder = 0 // assigned by activeViews.add()
    name: string
    size: WidgetSize
    position: Location
    textLeft: number
    textTop: number
    strokeColor = "black"
    fillColor: string
    fontColor: string
    text: string
    lastText: string

    /** ctor that instantiates a new virtual Label view */
    constructor(el: ElementDescriptor) {
        this.name = el.id
        this.index = el.idx
        this.text = el.text || ''
        this.lastText = ''
        this.size = el.size || { width: 30, height: 3 }
        this.position = el.position
        this.fillColor = winCFG.containerColor
        this.fontColor = 'black' //fontColor
        this.textLeft = el.position.left - (this.size.width * 0.5)
        this.textTop = el.position.top - (this.size.height * 0.7)

        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                         bind events                      \\
        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        if (el.bind) {
            whenEvent(UpdateLabel + this.name,
                (data: {
                    state: number
                    color: string,
                    textColor: string,
                    text: string
                }
                ) => {
                    this.fillColor = data.color
                    this.fontColor = data.textColor
                    this.lastText = data.text
                    this.text = data.text
                    this.render()
                })
        }
    }
    /** updates and renders the view */
    update() {
        this.render()
    }

    /** render this Label shape (path) onto the canvas */
    render() {

        ctx.save()
        ctx.fillStyle = this.fillColor
        ctx.fillRect(this.textLeft, this.textTop, this.size.width, this.size.height)
        ctx.lineWidth = 2
        ctx.strokeStyle = "black"
        ctx.strokeRect(this.textLeft, this.textTop, this.size.width, this.size.height)
        ctx.fillStyle = this.fontColor
        ctx.strokeStyle = this.fontColor
        ctx.fillText(this.text + ' ', this.position.left, this.position.top)
        ctx.restore()
    }

    touched() {
        // not implemented - labels are not activeElements
    }
}
