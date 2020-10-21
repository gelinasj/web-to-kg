import React from "react";
import Circle from "./shapes/Circle.js";
import Rect from "./shapes/Rect.js";
import Arrow from "./shapes/Arrow.js";
import Entity from "./graph/Entity.js";
import Literal from "./graph/Literal.js";
import Connection from "./graph/Connection.js";
import DragAction from "./drag-actions/DragAction.js";
import { sortGraph } from "./auxillary.js";

class SubGraphEditor extends React.Component {

    constructor() {
        super();
        this.subgraph = {};
        this.menuItems = [];
        this.dragAction = null;

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
        this.bounds = null;
        this.proximateConnector = null;
        this.focus = null;
    }

    getCanvas() {
        const canvas = document.getElementById("SubGraphEditorCanvas");
        let ctx = canvas.getContext("2d");
        return {canvas, ctx};
    }

    initializeCanvasConstants() {
        const { canvas } = this.getCanvas();
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
        this.bounds = {minX:0+2, minY: this.menuHeight+2, maxX: this.canvasWidth-2, maxY: this.canvasHeight-2};
    }

    createMenuItems() {
        // General constants
        this.menuItemCount = 3;
        this.menuItemWidth = .75 * this.menuHeight;
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

    getProximityIndicator(x, y) {
        const radius = 30;
        return new Circle(y - radius, x - radius, radius*2, undefined, "black", true);
    }

    getProximateConnector() {
        if(this.dragAction === null) {return null};
        const draggedGraphItem = this.subgraph[this.dragAction.itemId];
        return Object.entries(draggedGraphItem.connectors).reduce((foundConnector, [connectorId, {x, y, accepts, provides}]) => {
            if(foundConnector !== undefined) {return foundConnector};
            const tmpProximityIndicator = this.getProximityIndicator(x, y);
            return Object.entries(this.subgraph).reduce((foundConnector, [itemId, graphItem]) => {
                if(foundConnector !== undefined || parseInt(itemId) === parseInt(this.dragAction.itemId)) {return foundConnector};
                return Object.entries(graphItem.connectors).reduce((foundConnector, [thatconnectorId, {x:thatX, y:thatY, accepts:thatAccepts, provides:thatProvides}]) => {
                    if(foundConnector !== undefined) {return foundConnector};
                    const isFound = tmpProximityIndicator.containsPoint(thatX, thatY) &&
                    draggedGraphItem.join(graphItem, connectorId, thatconnectorId, false);
                    if(isFound) {
                        return {
                            draggedConnector: connectorId,
                            draggedItem: parseInt(this.dragAction.itemId),
                            nondraggedConnector: thatconnectorId,
                            nondraggedItem: parseInt(itemId)
                        };
                    } else {
                        return undefined;
                    }
                }, undefined);
            }, undefined)
        }, undefined) || null;
    }

    setFocus() {
        if(this.dragAction === null) {
            if(this.focus !== null) {
                this.subgraph[this.focus] === undefined || this.subgraph[this.focus].unfocus();
                this.focus = null;
            }
        } else {
            this.subgraph[this.dragAction.itemId].focus();
            this.focus = this.dragAction.itemId;
        }
    }

    draw() {
        const { ctx } = this.getCanvas();
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        new Rect(0, 0, this.menuWidth, this.menuHeight, this.menuColor).draw(ctx);
        new Rect(this.menuHeight, 0, this.editorWidth, this.editorHeight, this.editorColor).draw(ctx);
        this.menuItems.forEach((menuItem) => menuItem.shape.draw(ctx));
        Object.entries(this.subgraph).forEach(([itemId, graphItem]) => graphItem.shouldDrawConnectors());
        sortGraph(this.subgraph).forEach(([itemId, graphItem]) => graphItem.draw(ctx));
        if(this.proximateConnector !== null) {
            const {nondraggedItem, nondraggedConnector} = this.proximateConnector;
            const info = this.subgraph[nondraggedItem].connectors[nondraggedConnector];
            this.getProximityIndicator(info.x, info.y).draw(ctx);
        }
    }

    initializeListeners() {
        window.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mousemove", this.onMouseMove);
    }

    componentDidMount() {
        this.initializeListeners();
        this.initializeCanvasConstants();
        this.createMenuItems();
        this.draw();
    }

    getCanvasPosn(e) {
        return [e.clientX - this.canvasLeft, e.clientY - this.canvasTop];
    }

    onMouseDown(e) {
        const [mouseX, mouseY] = this.getCanvasPosn(e);
        this.dragAction = DragAction.onMouseDown(this.menuItems, this.subgraph, mouseX, mouseY);
        this.proximateConnector = this.getProximateConnector();
        this.setFocus();
        this.draw();
    }

    onMouseUp(e) {
        if(this.dragAction === null) {return;}
        const [mouseX, mouseY] = this.getCanvasPosn(e);
        this.dragAction.onMouseUp(this.subgraph, mouseX, mouseY, this.getProximateConnector(), this.bounds);
        this.dragAction = null;
        this.proximateConnector = null;
        this.setFocus();
        this.draw();
    }

    onMouseMove(e) {
        const [mouseX, mouseY] = this.getCanvasPosn(e);
        if(this.dragAction !== null) {
            this.dragAction.onMouseMove(this.subgraph, mouseX, mouseY, this.bounds);
            this.proximateConnector = this.getProximateConnector();
        }
        this.setFocus();
        this.draw();
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
