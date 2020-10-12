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
        this.onMouseUp = this.onMouseUp.bind(this);
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
        const entityColor = "#f48168";
        const entityBorderColor = "black";
        this.menuItems.push({
            shape: new Circle(entityTop, entityLeft, entityDiameter, entityColor, entityBorderColor),
            createGraphItem: () => new Entity(entityTop, entityLeft, entityDiameter, entityColor, entityBorderColor)
        });

        // Literal
        const literalHeight = this.menuItemWidth * .65;
        const literalTop = (this.menuHeight - literalHeight)/2;
        const literalLeft = this.menuStartX + this.menuItemWidth + this.menuItemSpacing;
        const literalWidth = this.menuItemWidth;
        const literalColor = "#8acff4";
        const literalBorderColor = "black";
        this.menuItems.push({
            shape: new Rect(literalTop, literalLeft, literalWidth, literalHeight, literalColor, literalBorderColor),
            createGraphItem: () => new Literal(literalTop, literalLeft, literalWidth, literalHeight, literalColor, literalBorderColor)
        });

        // Connection
        const connectionWidth = this.menuItemWidth * .2;
        const connectionStartX = this.menuStartX + this.menuItemWidth * 2 + this.menuItemSpacing * 2;
        const connectionStartY = (this.menuHeight - connectionWidth)/2 + connectionWidth/2;
        const connectionEndX = connectionStartX + this.menuItemWidth;
        const connectionEndY = connectionStartY;
        const connectionColor = "white";
        const connectionBorderColor = "black"
        this.menuItems.push({
            shape: new Arrow(connectionWidth, connectionStartX, connectionStartY, connectionEndX, connectionEndY, connectionColor, connectionBorderColor),
            createGraphItem: () => new Connection(connectionWidth, connectionStartX, connectionStartY, connectionEndX, connectionEndY, connectionColor, connectionBorderColor)
        });
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawBackground(ctx);
        this.menuItems.forEach((menuItem) => menuItem.shape.draw(ctx));
        this.sortGraph(this.subgraph).forEach(([itemId, graphItem]) => graphItem.draw(ctx));
    }

    redraw() {
        const { ctx } = this.getCanvas();
        this.draw(ctx);
    }

    initializeListeners() {
        window.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mousemove", this.onMouseMove);
    }

    componentDidMount() {
        this.initializeListeners();
        const { canvas, ctx } = this.getCanvas();
        this.initializeCanvasConstants(canvas);
        this.createMenuItems();
        this.draw(ctx);
    }

    sortGraph(graph) {
        let graphPairs = Object.entries(graph);
        graphPairs.sort(([itemId1, graphItem1], [itemId2, graphItem2]) => {
            return graphItem1.lastUpdated - graphItem2.lastUpdated;
        });
        return graphPairs;
    }

    // @TODO: clean up
    onMouseDown(e) {
        const canvasX = e.clientX - this.canvasLeft;
        const canvasY = e.clientY - this.canvasTop;
        const clickedMenuItem = this.menuItems.find(
            (menuItem) => menuItem.shape.containsPoint(canvasX, canvasY));
        let newGraphItem, itemId, firstDrag;
        if(clickedMenuItem !== undefined) {
            newGraphItem = clickedMenuItem.createGraphItem();
            itemId = this.addToSubgraph(newGraphItem);
            firstDrag = true;
        } else {
            const sortedClickedGraphItems = this.sortGraph(this.subgraph).filter(([itemId, graphItem]) => {
                return graphItem.containsPoint(canvasX, canvasY);
            });
            if(sortedClickedGraphItems.length === 0) {return;}
            [itemId, newGraphItem] = sortedClickedGraphItems[sortedClickedGraphItems.length - 1];
            firstDrag = false;
        }
        newGraphItem.updateTime();
        this.draggedItem = {
            itemId, firstDrag,
            xOffset: newGraphItem.getXOffset(canvasX),
            yOffset: newGraphItem.getYOffset(canvasY),
        };
        this.redraw();
    }

    onMouseUp(e) {
        if(this.draggedItem !== null) {
            const { itemId, firstDrag, xOffset, yOffset } = this.draggedItem
            this.draggedItem = null;
            if(firstDrag) {
                if(e.clientY - this.canvasTop < this.menuHeight) {
                    delete this.subgraph[itemId];
                }
            }
        }
        this.redraw();
    }

    onMouseMove(e) {
        const canvasX = e.clientX - this.canvasLeft;
        const canvasY = e.clientY - this.canvasTop;
        if(this.draggedItem !== null) {
            const { itemId, firstDrag, xOffset, yOffset } = this.draggedItem;
            const draggedGraphItem = this.subgraph[itemId];
            draggedGraphItem.setLocation(canvasX - xOffset, canvasY - yOffset);
        }
        this.redraw()
    }

    render() {
        return (
            <div id="SubGraphEditor" style={{padding:"10px"}}>
                <canvas
                id="SubGraphEditorCanvas"
                width={700}
                height={700}
                />
            </div>
        );
    }

}

export { SubGraphEditor };
