import React from "react";
import Circle from "./shapes/Circle.js";
import Rect from "./shapes/Rect.js";
import Arrow from "./shapes/Arrow.js";
import Entity from "./graph/Entity.js";
import Literal from "./graph/Literal.js";
import Connection from "./graph/Connection.js";

class SubGraphEditor extends React.Component {

    constructor() {
        super();
        this.subgraph = {};
        this.menuItems = [];
        this.draggedItem = null;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        this.menuWidth = null;
        this.menuHeight = null;
        this.editorWidth = null;
        this.editorHeight = null;
        this.canvasLeft = null;
        this.canvasTop = null;
        this.canvasWidth = null;
        this.canvasHeight = null;
        this.menuItemCount = null;
        this.menuItemWidth = null;
        this.menuItemSpacing = null;
    }

    addToSubgraph(graphItem) {
        const subgraphKeys = Object.keys(this.subgraph);
        const itemId = subgraphKeys.length && (Math.max(...subgraphKeys) + 1);
        this.subgraph[itemId] = graphItem;
        return itemId;
    }

    getCanvas() {
        const canvas = document.getElementById("SubGraphEditorCanvas");
        let ctx = canvas.getContext("2d");
        return {canvas, ctx};
    }

    initializeCanvasConstants(canvas) {
        const { x, y } = canvas.getBoundingClientRect();
        const { width, height } = canvas;
        this.canvasLeft = x;
        this.canvasTop = y;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.menuColor = "#d5d5d5";
        this.menuWidth = this.canvasWidth;
        this.menuHeight = this.canvasHeight * (1/5);
        this.editorColor = "#e4eeb2";
        this.editorWidth = this.canvasWidth;
        this.editorHeight = this.canvasHeight - this.menuHeight;
    }

    drawBackground(ctx) {
        ctx.fillStyle = this.menuColor;
        ctx.fillRect(0, 0, this.menuWidth, this.menuHeight);
        ctx.fillStyle = this.editorColor;
        ctx.fillRect(0, this.menuHeight, this.editorWidth, this.editorHeight, this.editorColor);
    }

    createMenuItems() {
        // General constants
        this.menuItemCount = 3;
        this.menuItemWidth = .8 * this.menuHeight;
        this.menuItemSpacing = this.menuItemWidth * .2;
        this.menuStartX = (this.menuWidth - this.menuItemWidth * this.menuItemCount - (this.menuItemCount - 1) * this.menuItemSpacing)/2;

        // Entity
        const entityTop = (this.menuHeight - this.menuItemWidth)/2;
        const entityLeft = this.menuStartX;
        const entityDiameter = this.menuItemWidth;
        const entityColor = "#c22121";
        this.menuItems.push({
            shape: new Circle(entityTop, entityLeft, entityDiameter, entityColor),
            createGraphItem: () => new Entity(entityTop, entityLeft, entityDiameter, entityColor)
        });

        // Literal
        const literalHeight = this.menuItemWidth * .65;
        const literalTop = (this.menuHeight - literalHeight)/2;
        const literalLeft = this.menuStartX + this.menuItemWidth + this.menuItemSpacing;
        const literalWidth = this.menuItemWidth;
        const literalColor = "#2424d1";
        this.menuItems.push({
            shape: new Rect(literalTop, literalLeft, literalWidth, literalHeight, literalColor),
            createGraphItem: () => new Entity(entityTop, entityLeft, entityDiameter, entityColor)
        });

        // Connection
        const connectionWidth = this.menuItemWidth * .3;
        const connectionStartX = this.menuStartX + this.menuItemWidth * 2 + this.menuItemSpacing * 2;
        const connectionStartY = (this.menuHeight - connectionWidth)/2 + connectionWidth/2;
        const connectionEndX = connectionStartX + this.menuItemWidth;
        const connectionEndY = connectionStartY;
        const connectionColor = "black";
        this.menuItems.push({
            shape: new Arrow(connectionWidth, connectionStartX, connectionStartY, connectionEndX, connectionEndY, connectionColor),
            createGraphItem: () => new Entity(connectionWidth, connectionStartX, connectionStartY, connectionEndX, connectionEndY, connectionColor)
        });
    }

    drawGraph(ctx){}

    draw(ctx) {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawBackground(ctx);
        this.menuItems.map((menuItem) => menuItem.shape.draw(ctx));
        this.drawGraph(ctx);
    }

    componentDidMount() {
        const {canvas, ctx} = this.getCanvas();
        this.initializeCanvasConstants(canvas);
        this.createMenuItems();
        this.draw(ctx);
    }

    onMouseDown(e) {
        const clickedMenuItem = this.menuItems.find(
            (menuItem) => menuItem.shape.containsPoint(
                e.clientX - this.canvasLeft,
                e.clientY - this.canvasTop)
        );
        if(clickedMenuItem !== undefined) {
            const newGraphItem = clickedMenuItem.createGraphItem();
            const itemId = this.addToSubgraph(newGraphItem);
            this.draggedItem = {itemId, firstDrag: true};
            console.log(`${clickedMenuItem.shape.constructor.name} clicked`);
            console.log(itemId);
        } else {
            console.log("Nothing clicked");
        }
    }

    onMouseMove(e) {
        //console.log(e.clientX, e.clientY);
    }

    render() {
        return (
            <div id="SubGraphEditor" style={{padding:"10px"}}>
                <canvas
                id="SubGraphEditorCanvas"
                width={700}
                height={700}
                onMouseMove={this.onMouseMove}
                onMouseDown={this.onMouseDown}
                />
            </div>
        );
    }

}

export { SubGraphEditor };
