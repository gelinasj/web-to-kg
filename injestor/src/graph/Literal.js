import GraphItem from "./GraphItem.js";
import Rect from "../shapes/Rect.js";
import { INPUT_TYPES } from "../components/LiteralInput.js";

class Literal extends GraphItem {
    constructor(top, left, width, height, color, borderColor) {
        super(new Rect(top, left, width, height, color, borderColor));
        this.connectedItem = null;
        this.connector = null;
    }

    draw(ctx) {
      let text;
      if(this.kgInfo) {
        switch(this.kgInfo.literalInputType) {
          case INPUT_TYPES.string:
            text = `${this.kgInfo.value}`; break;
          case INPUT_TYPES.quantity:
            text = "quantity TODO"; break;
          case INPUT_TYPES.date:
            text = `${this.kgInfo.value}`; break;
          case INPUT_TYPES.url:
            text = "url TODO"; break;
          default:
            break;
        }
      }
      this.shape.draw(ctx, text);
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.updateTime();
        this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
        if(this.connectedItem !== null) {
            const {x:xOffset, y:yOffset} = this.connectedItem.resizers["end"];
            const {x, y} = this.connectors[this.connector];
            this.connectedItem.resize("end", x - this.connectedItem.getXOffset(xOffset), y - this.connectedItem.getYOffset(yOffset), undefined, true);
        }
    }

    join(that, thisConnector, thatConnector, mutate=true) {
        return that.joinLiteral(this, thatConnector, thisConnector, mutate);
    }

    joinConnection(connection, thisConnector, connectionConnector, mutate) {
        return super.joinLiteralAndConnection(this, connection, thisConnector, connectionConnector, mutate);
    }

    disjoin() {
      this.connectedItem === null || this.connectedItem.disjoinThat(this);
      this.connectedItem = null;
      this.connector = null;
    }

    disjoinThat(that) {
      if(that === this.connectedItem) {
        this.connectedItem = null;
        this.connector = null;
      }
    }
}

export default Literal;
