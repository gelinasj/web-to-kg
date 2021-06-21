import GraphItem from "./GraphItem.js";
import Rect from "../shapes/Rect.js";
import { INPUT_TYPES } from "../components/LiteralInput.js";
import { getClone } from "../auxillary/auxillary.js";

class Literal extends GraphItem {
    constructor(top, left, width, height, color, borderColor, initializeEmpty=false) {
        super(initializeEmpty ? undefined : new Rect(top, left, width, height, color, borderColor), initializeEmpty);
        this.connectedItem = null;
        this.connector = null;
    }

    getRawData() {
      return this.kgInfo;
    }

    generalize(tableData, filters) {
      const rowBindings = Object.keys(this.bindings);
      if(rowBindings.length !== 0) {
        if(this.kgInfo === null) {
          this.kgInfo = {literalInputType: INPUT_TYPES.string};
        }
        if(this.kgInfo.literalInputType === INPUT_TYPES.quantity) {
          this.kgInfo.value.data = tableData[rowBindings[0]];
        } else {
          this.kgInfo.value = tableData[rowBindings[0]];
        }
      }
    }

    clone(alreadyCloned) {
      let clone = getClone(this, alreadyCloned);
      if(clone === undefined) {
        clone = new Literal(undefined, undefined, undefined, undefined, undefined, undefined, true);
        super.clone(clone, alreadyCloned);
        alreadyCloned.push([this, clone]);
        clone.connector = this.connector;
        clone.connectedItem = this.connectedItem && this.connectedItem.clone(alreadyCloned);
      }
      return clone;
    }

    draw(ctx) {
      let text;
      if(this.kgInfo) {
        switch(this.kgInfo.literalInputType) {
          case INPUT_TYPES.string:
            text = `${this.kgInfo.value}`; break;
          case INPUT_TYPES.quantity:
            text = `${this.kgInfo.value.data || ""} ${this.kgInfo.value.unit?.label || ""}`; break;
          case INPUT_TYPES.date:
            text = `${this.kgInfo.value}`; break;
          case INPUT_TYPES.url:
            text = `${this.kgInfo.value}`; break;
          default:
            break;
        }
      }
      this.shape.draw(ctx, text);
    }

    updateKGInfo(kgInfo) {
      if(kgInfo.literalInputType === INPUT_TYPES.quantity) {
        if(this.kgInfo === null) {this.kgInfo = {};}
        if(this.kgInfo?.literalInputType !== INPUT_TYPES.quantity) {
          this.kgInfo.value = {};
        }
        this.kgInfo.value[kgInfo.value.type] = kgInfo.value.value;
        this.kgInfo.literalInputType = kgInfo.literalInputType;
      } else {
        super.updateKGInfo(kgInfo);
      }
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
