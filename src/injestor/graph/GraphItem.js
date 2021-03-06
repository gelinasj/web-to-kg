import {
  requestDataFunc, getEntities
} from "../auxillary/autocomplete.js";
import { max } from "../auxillary/auxillary.js";

class GraphItem {
    constructor(shape, initializeEmpty) {
      if(!initializeEmpty) {
        this.shape = shape;
        this.lastUpdated = 0;
        this.kgInfo = null;
        this.bindings = {};
      }
      this.updateTime();
    }

    getBindingInfo() {
      return undefined;
    }

    generalize(tableData, filters) {
      const rowBindings = Object.keys(this.bindings);
      if(rowBindings !== 0) {
        return requestDataFunc(tableData[rowBindings[0]]).then((arr) => {
          const entityIds = arr.map((searchedEntity) => searchedEntity.id);
          if (entityIds.length === 0) return;
          return getEntities(entityIds).then((entityInfo) => {
            const filteredResults = Object.values(entityInfo).map((entity) => {
              let score = 0;
              const bindingFilters = filters[rowBindings[0]];
              if(bindingFilters !== undefined) {
                bindingFilters.forEach(({value:[pid,vid,c]}) => {
                  const propertyVals = entity.claims[pid];
                  if(propertyVals !== undefined) {
                    score += propertyVals.includes(vid) ? 1 : 0;
                  }
                });
              }
              return [entity.id, score];
            });
            const bestEntity = max(filteredResults,
              ([e1, score1], [e2, score2]) => score1 - score2);
            this.kgInfo = arr.find((entityObj) => entityObj.id === bestEntity[0]);
          });
        });
      }
    }

    clone(clone, alreadyCloned) {
      clone.shape = this.shape.clone();
      clone.lastUpdated = this.lastUpdated;
      clone.kgInfo = this.kgInfo && JSON.parse(JSON.stringify(this.kgInfo));
      clone.bindings = JSON.parse(JSON.stringify(this.bindings));
    }

    getTriples(alreadySeenTriples) {
      return [];
    }

    bindColumn(index, name) {
      this.bindings[index] = name
    }

    updateTime() {
        this.lastUpdated = new Date().getTime();
    }

    updateKGInfo(kgInfo) {
      this.kgInfo = kgInfo;
    }

    shouldDrawConnectors() {
        this.shape.shouldDrawConnectors();
    }

    draw(ctx) {
        this.shape.draw(ctx, this.kgInfo === null ? undefined : `${this.kgInfo.label} (${this.kgInfo.id})`);
    }

    resize(resizerId, pX, pY, bounds) {
        this.shape.resize(resizerId, pX, pY, bounds);
        this.updateTime();
    }

    getXOffset(pX) {
        return this.shape.getXOffset(pX);
    }

    getYOffset(pY) {
        return this.shape.getYOffset(pY);
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
        this.updateTime();
    }

    containsPoint(pX, pY) {
        return this.shape.containsPoint(pX, pY);
    }

    isResizable() {
        return false;
    }

    getClickedResizer(pX, pY) {
        return this.shape.getClickedResizer(pX, pY);
    }

    get connectors() {
        return this.shape.connectors;
    }

    get resizers() {
        return this.shape.resizers;
    }

    focus(backgroundFocus=false) {
        this.shape.focus(backgroundFocus);
    }

    unfocus(backgroundFocus=false) {
        this.shape.unfocus(backgroundFocus);
    }

    joinLiteral(that, thisConnector, thatConnector, mutate) {
        return false;
    }

    joinEnity(that, thisConnector, thatConnector, mutate) {
        return false;
    }

    joinLiteralAndConnection(literal, connection, literalConnector, connectionConnector, mutate) {
        if(literal.connectedItem === null && connectionConnector === "end" && connection.to === null) {
            if(mutate) {
                connection.to = literal;
                literal.connectedItem = connection;
                literal.connector = literalConnector;
            }
            return true;
        } else {
            return false;
        }
    }

    joinEnityAndConnection(entity, connection, entityConnector, connectionConnector, mutate) {
        const connectionType = connectionConnector === "start" ? "from" : connectionConnector === "end" ? "to" : undefined;
        if(connectionType !== undefined && connection[connectionType] === null) {
            if(mutate) {
                const direction = connectionConnector === "start" ? "outgoing" : "incoming";
                entity[direction].push([connection, entityConnector]);
                connection[connectionType] = entity;
            }
            return true;
        } else {
            return false;
        }
    }

    joinConnectionAndConnection(centerConnection, qualifier, mutate) {
        if(qualifier.from === null) {
            if(mutate) {
                qualifier.from = centerConnection;
                centerConnection.qualifiers.push(qualifier);
            }
            return true;
        } else {
            return false
        }
    }

}

export default GraphItem;
