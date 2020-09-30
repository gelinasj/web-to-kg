import React from 'react';
import GraphComponent from "./graph-component.js"

const GRAPH_COMPONENT_TYPES = {
    "entity": "Entity",
    "property": "Property",
    "qualifier": "Qualifier",
    "literal": "Literal"
};

class GraphEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {graphComponents: []}
        this.handleEntityClick = this.handleClick.bind(this, GRAPH_COMPONENT_TYPES.entity);
        this.handlePropertyClick = this.handleClick.bind(this, GRAPH_COMPONENT_TYPES.property);
        this.handleQualifierClick = this.handleClick.bind(this, GRAPH_COMPONENT_TYPES.qualifier);
        this.handleLiteralClick = this.handleClick.bind(this, GRAPH_COMPONENT_TYPES.literal);
        this.handleGraphComponentChange = this.handleGraphComponentChange.bind(this);
    }

    handleClick(componentType) {
        const newGraphComponent = {
            type: componentType,
            value: ""
        };
        this.setState(function(state) {
            return {graphComponents: [...state.graphComponents, newGraphComponent]};
        });
    }

    handleGraphComponentChange(key, e) {
        const value = e.target.value;
        this.setState(function(state) {
            const graphComponents = [...state.graphComponents];
            graphComponents[key].value = value;
            return {graphComponents};
        });
    }


    getGraphComponents() {
        const { graphComponents } = this.state;
        return graphComponents.map((comp, index) =>
            (<GraphComponent
            key={index}
            id={index}
            type={comp.type}
            value={comp.value}
            onChange={this.handleGraphComponentChange}
            />));
    }

    render() {
        return (
            <div id="GraphEditor">
                <button onClick={this.handleEntityClick}>Entity +</button>
                <button onClick={this.handlePropertyClick}>Property +</button>
                <button onClick={this.handleQualifierClick}>Qualifier +</button>
                <button onClick={this.handleLiteralClick}>Literal +</button>
                {this.getGraphComponents()}
            </div>
        );
    }
}

export default GraphEditor;
