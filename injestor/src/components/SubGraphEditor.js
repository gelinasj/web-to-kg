import React from 'react';
import "../style-sheets/SubGraphEditor.css"

class SubGraphEditor extends React.Component {

    constructor() {
        super();
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDragStart(event) {
        console.log("START", event);
        var style = window.getComputedStyle(event.target, null);
        event.dataTransfer.setData("text/plain", event.target.id);
    }

    onDrop(event) {
        event.preventDefault();
        console.log("END", event);
        console.log(event.dataTransfer.getData("text/plain"));
    }

    render() {
        return (
            <div id="SubGraphEditor">
                <div id="DraggableMenu">
                    <table id="MenuOptions">
                        <tr>
                            <th><span id="Entity" draggable={true} onDragStart={this.onDragStart}></span></th>
                            <th><span id="Property" draggable={true} onDragStart={this.onDragStart}></span></th>
                            <th><span id="Literal" draggable={true} onDragStart={this.onDragStart}></span></th>
                            <th><span id="Qualifier" draggable={true} onDragStart={this.onDragStart}></span></th>
                        </tr>
                    </table>
                </div>
                <div id="DroppableCanvas" onDrop={this.onDrop} onDragOver={this.onDragOver}></div>
            </div>
        );
    }

}

export { SubGraphEditor };
