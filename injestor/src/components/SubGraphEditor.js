import React from "react";
// import Entity from "../graph/Entity.js"
// import Literal from "../graph/Literal.js";

class SubGraphEditor extends React.Component {

    constructor() {
        super()
        this.subgraph = {};
    }

    prepareCanvas() {
        const canvas = document.getElementById("SubGraphEditorCanvas");
        const {width, height} = canvas;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        return {ctx, width, height};
    }

    addBackground(ctx, width, height) {
        const menuColor = "#d5d5d5";
        const menuWidth = width;
        const menuHeight = height * (1/6);
        ctx.fillStyle = menuColor;
        ctx.fillRect(0, 0, menuWidth, menuHeight);
        const editorColor = "#e4eeb2";
        const editorWidth = width;
        const editorHeight = height - menuHeight;
        this.drawRect(ctx, 0, menuHeight, editorWidth, editorHeight, editorColor);
        return {menuWidth, menuHeight, editorWidth, editorHeight};
    }

    drawCircle(ctx, left, top, diameter, color) {
        const radius = diameter/2;
        const x = left + radius;
        const y = top + radius;
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawRect(ctx, left, top, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(left, top, width, height);
    }

    drawArrow(ctx, width, startX, startY, endX, endY, color) {
        const headlength = 30;
        const dx = endX - startX;
        const dy = endY - startY;
        const arrowAngle = -1 * Math.atan2(dy, dx);
        const arrowAngleCompl = (Math.PI/2) - arrowAngle;

        // Draw head
        const triBottomX = endX - headlength * Math.cos(arrowAngle)
        const triBottomY = endY + headlength * Math.sin(arrowAngle)
        const triCornerDx = (width/2) * Math.cos(arrowAngleCompl);
        const triCornerDy = (width/2) * Math.sin(arrowAngleCompl);
        const triBottomRightX = triBottomX + triCornerDx;
        const triBottomRightY = triBottomY + triCornerDy;
        const triBottomLeftX = triBottomX - triCornerDx;
        const triBottomLeftY = triBottomY - triCornerDy;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(triBottomRightX, triBottomRightY);
        ctx.lineTo(triBottomLeftX, triBottomLeftY);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw body
        const rectCornerDx = (width/6) * Math.cos(arrowAngleCompl);
        const rectCornerDy = (width/6) * Math.sin(arrowAngleCompl);
        const rectBottomRightX = startX + rectCornerDx;
        const rectBottomRightY = startY + rectCornerDy;
        const rectBottomLeftX = startX - rectCornerDx;
        const rectBottomLeftY = startY - rectCornerDy;
        const rectTopRightX = triBottomX + rectCornerDx;
        const rectTopRightY = triBottomY + rectCornerDy;
        const rectTopLeftX = triBottomX - rectCornerDx;
        const rectTopLeftY = triBottomY - rectCornerDy;
        ctx.beginPath();
        ctx.moveTo(rectBottomRightX, rectBottomRightY);
        ctx.lineTo(rectBottomLeftX, rectBottomLeftY);
        ctx.lineTo(rectTopLeftX, rectTopLeftY);
        ctx.lineTo(rectTopRightX, rectTopRightY);
        ctx.fillStyle = color;
        ctx.fill();
    }

    addMenuItems(ctx, menuWidth, menuHeight) {
        const itemCount = 3;
        const itemWidth = .8 * menuHeight;
        const spacing = itemWidth * .2;

        const entityTop = (menuHeight - itemWidth)/2;
        const entityLeft = (menuWidth - itemWidth * itemCount - (itemCount - 1) * spacing)/2;
        const entityDiameter = itemWidth;
        const entityColor = "#c22121";
        console.log(entityTop, entityLeft, entityDiameter);
        this.drawCircle(ctx, entityLeft, entityTop, entityDiameter, entityColor);

        const literalHeight = itemWidth * .7;
        const literalTop = entityTop + (itemWidth - literalHeight)/2;
        const literalLeft = entityLeft + itemWidth + spacing;
        const literalWidth = itemWidth;
        const literalColor = "#2424d1";
        console.log(literalTop, literalLeft, literalWidth, literalHeight);
        this.drawRect(ctx, literalLeft, literalTop, literalWidth, literalHeight, literalColor);

        const propertyWidth = itemWidth * .4;
        const propertyStartX = entityLeft + itemWidth * 2 + spacing * 2;
        const propertyStartY = entityTop + itemWidth/2;
        const propertyEndX = propertyStartX + itemWidth;
        const propertyEndY = propertyStartY;
        const propertyColor = "black";
        this.drawArrow(ctx, propertyWidth, propertyStartX, propertyStartY, propertyEndX, propertyEndY, propertyColor);
        return {};
    }

    componentDidMount() {
        const {ctx, width, height} = this.prepareCanvas();
        const {menuWidth, menuHeight, editorWidth, editorHeight} = this.addBackground(ctx, width, height);
        this.addMenuItems(ctx, menuWidth, menuHeight);
    }

    render() {
        return (
            <div id="SubGraphEditor">
                <canvas id="SubGraphEditorCanvas" width={800} height={700}></canvas>
            </div>
        );
    }

}

export { SubGraphEditor };
