class Bubble{

    constructor(ctx, axisX, axisY, color, size){
        this.ctx = ctx
        this.axisX = axisX
        this.axisY = axisY
        this.color = color
        this.size = size
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
    }

    draw(){
        this.ctx.beginPath()
        this.ctx.arc(this.axisX, this.axisY, this.size, 0, Math.PI * 2)
        this.ctx.fillStyle = this.color
        this.ctx.fill()
    }

    update_position(){
        this.axisX += this.speedX
        this.axisY += this.speedY
        if(this.size > 0.1) this.size -= 0.1
    }

    new_color(value){
        this.color = value
    }
}

class GeneratorBase{
    constructor(canvas, axisXDiff, axisYDiff, size){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.bubbleColor = '#fff'
        this.bubbleSize = size
        this.axisXDiff = axisXDiff
        this.axisYDiff = axisYDiff
    }

    initialize(){
        this.addListeners()
    }

    setCoordinates(e){
        this.axisX = e.clientX - this.axisXDiff
        this.axisY = e.clientY - this.axisYDiff
    }

    addListeners(){
        this.canvas.addEventListener('mousemove', e => this.setCoordinates(e))
    }

    drawBubble(){
        let bubble = new Bubble(this.ctx, this.axisX, this.axisY, this.bubbleColor, this.bubbleSize)
        bubble.draw()
    }
}

class CursorTracker extends GeneratorBase{

    constructor(canvas, axisXDiff, axisYDiff, size){
        super(canvas, axisXDiff, axisYDiff, size)
        this.animate = this.animate.bind(this)
    }

    initialize(){
        super.initialize()
        this.animate()
    }

    animate(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBubble()
        requestAnimationFrame(this.animate)
    }
}

class PathMaker extends GeneratorBase{
    constructor(canvas, axisXDiff, axisYDiff, size){
        super(canvas, axisXDiff, axisYDiff, size)
    }

    setCoordinates(e){
        super.setCoordinates(e)

        this.drawBubble()
    }

    clearPath(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    set bubble_size(value){
        this.bubbleSize = value
    }
}

class SimpleBubbleFx extends GeneratorBase{

    constructor(canvas, axisXDiff, axisYDiff, size){
        super(canvas, axisXDiff, axisYDiff, size)
        this.animate = this.animate.bind(this)
        this.bubblesArray = []
    }

    initialize(){
        super.initialize()
        this.animate()
    }

    setCoordinates(e){
        super.setCoordinates(e)
        this.bubblesArray.push( new Bubble(this.ctx, this.axisX, this.axisY, this.bubbleColor, this.bubbleSize))
    }

    handleBubbles(){
        this.bubblesArray.forEach((bubble, ind) => {
            bubble.update_position()
            bubble.draw()
            if(bubble.size <= 0.3){
                this.bubblesArray.splice(ind, 1)
            }
        })
    }

    animate(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.handleBubbles()
        requestAnimationFrame(this.animate)
    }
}

class BubbleFreeze extends SimpleBubbleFx{
    
    constructor(canvas, axisXDiff, axisYDiff, size){
        super(canvas, axisXDiff, axisYDiff, size)
        this.colorVariation = 1
        this.colorActive = false
    }

    handleBubbles(){
        let bubble_color = this.colorActive 
                            ? `hsl(${ this.colorVariation }, 100%, 50%)`
                            :  '#fff'
        this.bubblesArray.forEach((bubble, ind) => {
            bubble.update_position()
            bubble.new_color(bubble_color)
            bubble.draw()
            if(bubble.size <= 0.3){
                this.bubblesArray.splice(ind, 1)
            }
        })
    }

    animate(){
        this.handleBubbles()
        requestAnimationFrame(this.animate)
        this.colorVariation += 0.45
    }

    set color(val){
        this.colorActive = val 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Cursor tracker instance
    const cnvsCursrTracker = document.querySelector('#canvasCursorTracker'),
        cursorTracker = new CursorTracker(cnvsCursrTracker, 15, 10, 15)
    cursorTracker.initialize()


    // Path maker instance
    const cnvsMakePath = document.querySelector('#canvasMakePaths'),
        pathMaker = new PathMaker(cnvsMakePath, window.innerWidth / 2 + 15, 10, 8),
        btnClear = document.querySelector('#clearPath'),
        btnSizeHandler = document.querySelector('#handlerBubbleSize');
    pathMaker.initialize()
    btnClear.addEventListener('click', () => pathMaker.clearPath())
    btnSizeHandler.addEventListener('change', e => {
        pathMaker.bubbleSize = e.target.value
    })


    // Simple bubble FX instance
    const cnvsSmplBubbleFx = document.querySelector('#simpleBubblesFx'),
        smplBubbleFx = new SimpleBubbleFx(cnvsSmplBubbleFx,  15, window.innerHeight / 2 + 10, 8)
    smplBubbleFx.initialize()


    // Bubble Freeze with colors instance
    const cnvsBubblesFx = document.querySelector('#bubblesFx'),
        bubblesFx = new BubbleFreeze(cnvsBubblesFx, window.innerWidth / 2 + 15, window.innerHeight / 2 + 10, 8),
        handlerColorBtn = document.querySelector('#activeColorBtn');

    bubblesFx.initialize()
    handlerColorBtn.addEventListener('click', e => {
        bubblesFx.color = !bubblesFx.colorActive
    })
})

