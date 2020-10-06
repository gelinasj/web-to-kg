import React from 'react';

class EntityComponent extends React.Component {

    // props are x, y, id
    constructor(props) {
        super(props);
        this.onDragStart = this.onDragStart.bind(this);
    }

    onDragStart(event) {
        const { x, y } = event.target.getBoundingClientRect();
        const dragItemData = {
            xOffset: event.clientX - x,
            yOffset: event.clientY - y,
            id: event.target.id,
            key: this.props.id
        };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragItemData));
    }

    render() {
        const { x, y, id } = this.props;
        let style = {position: "absolute", left: x, top:y};
        return (
            <span id={`Entity-${id}`} className="SubgraphEntity" style={style} draggable={true} onDragStart={this.onDragStart}>
                <p>Subgraph Entity</p>
            </span>
        );
    }
}

export default EntityComponent;
