import React from "react";
import Entity from "../graph/Entity.js"
import Literal from "../graph/Literal.js";

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

    drawCircle(ctx, top, left, diameter, color) {
        const radius = diameter/2;
        const x = left + radius;
        const y = top + radius;
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawRect(ctx, top, left, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(top, left, width, height);
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
        // const entitytop = ;
        // const entityleft = ;
        // const entityDiameter = ;
        // const entityColor = ;
        // this.drawCircle(ctx, 0, 0, 100, entityColor);
        // const literaltop = ;
        // const literalleft = ;
        // const literalWidth = ;
        // const literalHeight = ;
        // const literalColor = ;
        // this.drawRect(ctx, literaltop, literalleft, literalWidth, literalHeight, literalColor);
        // const propertyWidth = ;
        // const propertyHeight = ;
        // const propertyStartX = ;
        // const propertyStartY = ;
        // const propertyEndX = ;
        // const propertyEndY = ;
        // const propertyColor = ;
        // this.drawArrow(ctx, propertyWidth, propertyHeight, propertyStartX, propertyStartY, propertyEndX, propertyEndY, propertyColor);
        this.drawArrow(ctx, 50, 70, 170, 130, 80, "black");
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
