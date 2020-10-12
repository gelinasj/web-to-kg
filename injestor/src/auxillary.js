function createLine(x1, y1, x2, y2) {
    const m = (y2 - y1)/(x2 - x1);
    if (Math.abs(m) === Infinity) {
        return undefined;
    }
    return function(x) {
        return m * (x - x1) + y1
    };
}

function lteq(line, x, y) {
    return y <= line(x)
}

function gteq(line, x, y) {
    return y >= line(x)
}

function lineContainsPoint(line, refX, refY, lineX, matchSide, pX, pY) {
    if(line === undefined) {
        if(refX >= lineX) {
            return matchSide ? pX >= lineX : pX <= lineX;
        } else {
            return matchSide ? pX <= lineX : pX >= lineX;
        }
    } else {
        return (gteq(line, refX, refY) ? gteq : lteq)(line, pX, pY);
    }
}

function getPosnWithBounds(p, min=-Infinity, max=Infinity) {
    let out = p > min ? p : min;
    return out < max ? out : max;
}

export { createLine, lteq, gteq, lineContainsPoint, getPosnWithBounds };
