import React from "react";
import EntityComponent from "./EntityComponent.js";
import LiteralComponent from "./LiteralComponent.js";
import Entity from "../graph/Entity.js"
import Literal from "../graph/Literal.js";
import "../style-sheets/SubGraphEditor.css"

const GRAPH_ITEM_CONSTRUCTORS = {
    Entity: () => new Entity(),
    Literal: () => new Literal()
};

class SubGraphEditor extends React.Component {

    constructor() {
        super();
        this.state = {subgraph: {}};
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDragStart(event) {
        const { x, y } = event.target.getBoundingClientRect();
        const dragItemData = {
            xOffset: event.clientX - x,
            yOffset: event.clientY - y,
            id: event.target.id,
            key: null
        };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragItemData));
    }

    onDragOver(event) {
        event.preventDefault();
    }

    getItemPostion(position, size, min, max) {
        const distToMin = position - min;
        const distToMax = max - (position + size);
        let offset = 0;
        offset += distToMin < 0 ? distToMin : 0;
        offset -= distToMax < 0 ? distToMax : 0;
        return position - offset;
    }

    generateKey(state) {
        const { subgraph } = state;
        return JSON.stringify(Object.keys(subgraph).length);
    }

    updateSubgraph(id, key, x, y) {
        this.setState((state) => {
            let subgraph;
            if (key === null) {
                subgraph = {
                    [this.generateKey(state)]: {graphItem: GRAPH_ITEM_CONSTRUCTORS[id](), x, y },
                    ...state.subgraph
                };
            } else {
                const { [key]: itemToUpdate, ...rest } = state.subgraph;
                const { graphItem } = itemToUpdate;
                subgraph = {
                    [key]: {graphItem, x, y},
                    ...rest
                };
            }
            return {subgraph};
        });
    }

    onDrop(event) {
        event.preventDefault();
        const { xOffset, yOffset, id, key } = JSON.parse(event.dataTransfer.getData("text/plain"));
        const { x: left, y: top, right, bottom } = document.getElementById("SubGraphCanvas").getBoundingClientRect();
        const { width, height } = document.getElementById(id).getBoundingClientRect();
        const x = this.getItemPostion(event.clientX - xOffset, width, left, right);
        const y = this.getItemPostion(event.clientY - yOffset, height, top, bottom);
        this.updateSubgraph(id, key, x, y);
    }

    getMenuOptions() {
        return Object.keys(GRAPH_ITEM_CONSTRUCTORS).map((graphItem) => {
            return (
                <th key={graphItem}>
                    <span id={`${graphItem}`} draggable={true} onDragStart={this.onDragStart}>
                        <p>{graphItem}</p>
                    </span>
                </th>
            );
        });
    }

    getSubGraph() {
        const { subgraph } = this.state;
        return Object.keys(subgraph).map(function(itemKey) {
            const { graphItem, x, y } = subgraph[itemKey];
            if (graphItem instanceof Entity) {
                return <EntityComponent key={itemKey} id={itemKey} x={x} y={y}/>;
            } else if (graphItem instanceof Literal) {
                return <LiteralComponent key={itemKey} id={itemKey} x={x} y={y}/>;
            } else {return null;}
        });
    }

    render() {
        return (
            <div id="SubGraphEditor">
                {/*///////////////// Menu of graph items ///////////////*/}
                <div id="GraphItemMenu">
                    <table id="MenuOptions">
                        <thead><tr>{this.getMenuOptions()}</tr></thead>
                    </table>
                </div>

                {/*///////////////// Canvas to build subgraph ///////////////*/}
                <div id="SubGraphCanvas" onDrop={this.onDrop} onDragOver={this.onDragOver}>
                    {this.getSubGraph()}
                </div>
            </div>
        );
    }

}

export { SubGraphEditor };
