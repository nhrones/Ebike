
## To highlight selected text
```js
    // get the location of end of the text - we'll start there!
    let newLeft = this.position.left + ctx.measureText(this.trimmedLeft).width
    ctx.fillStyle = 'Gainsboro'
    ctx.fillRect ( // fill with the highlight color above
        newLeft , 
        this.position.top, 
        ctx.measureText(this.trimmedRight).width, 
        this.size.height
    )
    ctx.fillStyle = this.textColor
        this.position.left + ctx.measureText(this.trimmedLeft).width,
        this.position.top + 35
```
### right arrow
left -> cursor -> selected -> right

### left arrow
left -> selected -> cursor -> right


## LiveText

LiveText needs to Handle/Track/Send-To-Widget:

    RawText,            // raw text to be edited
    TextInView          // the text that is currently in view
    boxCharLength,      // number of chars box-size can hold (dictates TextInView.length)
    cursorIndex,        // the cursor index within the textInView (Widget Rendered)
    selectedRawStart,   // the index of the start(left) of selection(raw)
        selectedText may not be in-view when ctrl+X (delete selected)
    selectedRawEnd      // the index of the end(right) of selection(raw)
        selectedText may not be in-view when ctrl+X (delete selected)
    selectedInViewStart // for highlighting by the Widget    
    selectedInViewEnd   // for highlighting by the Widget    

## Widget
            
Widget Needs to Handle/Manage/Render:

Recieves update event with:
    textInView          // should split for cursor display
    cursorIndex         // index into textInView - used to split above
    selectedInViewStart // used to highlight selected chars in view
    selectedInViewEnd   // used to highlight selected chars in view

Will split `inView` 
    first, on selected: 
        left-selected-right     // selection inside view
        0-selected-right        // selection at start of view
        left-selected-0         // selection at start of view
        
    next, on cursorIndex(C):    // cursorIndex = 0 to boxCharLength)  
        left-0-C                // no selection cursor=length (index = 0 to Len)                
        left-C-selected-right   // selection moving left  
        left-selected-C-right   // selection moving right
        left-C-Right            // cursor IN text  
        0-C-Right               // cursor at start text 
         
        We won't expect a cursor inside a selection
        
## LiveText fix
```js
case LeftArrow:
    if (this.fullText.length > 1) {
        if (shiftKey) {
            console.log('   SHIFTING SELECTION LEFT!')
            TODO HANDLE SELECTED HERE
} else {} // do normal shift
```
