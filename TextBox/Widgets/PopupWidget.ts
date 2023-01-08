import { 
    WC, 
    setHasVisiblePopup, 
    winCFG,
    ctx, 
    fireEvent, 
    whenEvent, 
    ImageData, 
    Path2D,
    ElementDescriptor, 
    Location, 
    WidgetSize, 
    View 
} from '../deps.ts'

import { 
    ShowPopup, 
    HidePopup,
    PopupTouched
} from '../ViewModels/constants.ts'


let left = 1
let top = 1

/** A virtual Popup view class */
export default class Popup implements View {

    id = 0 // assigned by activeViews.add() 
    index = -1
    activeView = true
    zOrder = 100 // assigned by activeViews.add()
    name = ""
    enabled = true
    hovered = false
    focused = false
    path: Path2D
    shownPath: Path2D
    hiddenPath: Path2D
    position: Location
    size: WidgetSize
    color = "black"
    text = ""
    visible = true
    buffer: ImageData | null = null

    /** ctor that instantiates a new vitual Popup view */
    constructor( el: ElementDescriptor ) {

        this.enabled = true
        this.color = 'white'
        this.name = el.id
        this.position = el.position
        this.hiddenPath = new Path2D()
        this.hiddenPath.rect(1, 1, 1, 1)
        this.size = el.size || { width: 300, height: 300 }
        this.shownPath = this.buildPath(el.radius || 30)
        this.path = this.hiddenPath


        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                         bind events                     \\
        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        // Our our counterLabelVM broadcasts this event at count exceeded
        whenEvent(ShowPopup, ( data:{ message: string } ) => {
            this.show(data.message)
        })

        // the app viewmodel watches for a popup touch event and fires this 
        whenEvent(HidePopup, () => {
            this.hide()
        })
        
    }
    /** build a Path2D */
    buildPath(radius: number) {
        const path = new Path2D
        path.roundRect(this.position.left, this.position.top, this.size.width, this.size.height, radius)
        return path
    }
    /** show the virtual Popup view */
    show(msg: string) {
        this.text = msg
        left = this.position.left
        top = this.position.top
        this.path = this.shownPath
        this.visible = true
        this.render()
    }

    /** hide the virtual Popup view */
    hide() {
        if (this.visible) {
            left = 1
            top = 1
            this.path = this.hiddenPath
            this.visible = false
            setHasVisiblePopup(false)
            WC.dirty()
        }
    }

    /** called from Surface::canvasEvents when this element has been touched */
    touched() {
        this.hide()
        fireEvent(PopupTouched, {}) // app watched this
    }

    /** update this virtual Popups view (render it) */
    update() {
        if (this.visible) this.render()
    }

    /** render this virtual Popup view */
    render() {
        ctx.save()
        ctx.shadowColor = '#404040'
        ctx.shadowBlur = 45
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5
        ctx.fillStyle = winCFG.containerColor
        ctx.fill(this.path)
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.lineWidth = 1
        ctx.strokeStyle = (this.hovered) ? 'orange' : 'black'
        ctx.stroke(this.path)
        ctx.strokeStyle = 'black'
        ctx.font = "28px Tahoma, Verdana, sans-serif";
        ctx.strokeText(this.text+' ', left + 300, top + 160)
        ctx.restore()
        this.visible = true
    }

}
