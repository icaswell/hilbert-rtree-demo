var RTreeRectangle = (function () {
    function RTreeRectangle(x, y, width, height, data) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.data = data;
        this.children = [];
    }
    RTreeRectangle.generateEmptyNode = function () {
        return new RTreeRectangle(Infinity, Infinity, 0, 0, null);
    };
    RTreeRectangle.prototype.overlaps = function (anotherRect) {
        return this.x < anotherRect.x + anotherRect.width && this.x + this.width > anotherRect.x && this.y + this.height > anotherRect.y && anotherRect.y + anotherRect.height > this.y;
    };
    RTreeRectangle.prototype.contains = function (anotherRect) {
        return this.x <= anotherRect.x && this.x + this.width >= anotherRect.x + anotherRect.width && this.y <= anotherRect.y && this.y + this.height >= anotherRect.y + anotherRect.height;
    };
    RTreeRectangle.prototype.growRectangleToFit = function (anotherRect) {
        if (this.x === Infinity) {
            this.height = anotherRect.height;
            this.width = anotherRect.width;
            this.x = anotherRect.x;
            this.y = anotherRect.y;
        }
        else {
            this.height = Math.max(this.y + this.height, anotherRect.y + anotherRect.height) - Math.min(this.y, anotherRect.y);
            this.width = Math.max(this.x + this.width, anotherRect.x + anotherRect.width) - Math.min(this.x, anotherRect.x);
            this.x = Math.min(this.x, anotherRect.x);
            this.y = Math.min(this.y, anotherRect.y);
        }
    };
    RTreeRectangle.prototype.areaIfGrownBy = function (anotherRect) {
        if (this.x === Infinity) {
            return anotherRect.height * anotherRect.width;
        }
        else {
            return (Math.max(this.y + this.height, anotherRect.y + anotherRect.height) - Math.min(this.y, anotherRect.y)) * (Math.max(this.x + this.width, anotherRect.x + anotherRect.width) - Math.min(this.x, anotherRect.x)) - this.getArea();
        }
    };
    RTreeRectangle.prototype.getArea = function () {
        return this.height * this.width;
    };
    RTreeRectangle.prototype.splitIntoSiblings = function () {
        var pivot = Math.floor(this.children.length / 2);
        var sibling1 = RTreeRectangle.generateEmptyNode();
        var sibling2 = RTreeRectangle.generateEmptyNode();
        var maxCoordinate = -Infinity;
        var minCoordinate = Infinity;
        var coordX, coordY;
        _.each(this.children, function (rect) {
            coordX = Math.ceil(rect.x + rect.width * 0.5);
            coordY = Math.ceil(rect.y + rect.height * 0.5);
            maxCoordinate = Math.max(maxCoordinate, Math.max(coordX, coordY));
            minCoordinate = Math.min(minCoordinate, Math.min(coordX, coordY));
        });
        var sorted = _.sortBy(this.children, function (rect) {
            if (this.distanceMetric == "hilbert"){
                return HilbertCurves.toHilbertCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);
            } else if (this.distanceMetric == "z-order"){
                return HilbertCurves.toZCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);                
            } else if (this.distanceMetric == "row-major"){
                return HilbertCurves.toRowMajorCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);                
            } else if (this.distanceMetric == "random"){
                return HilbertCurves.toRandomCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);                
            } else {
                alert("kyaghjsldf");
            }
        });
        _.each(sorted, function (rect, i) {
            if (i <= pivot) {
                sibling1.insertChildRectangle(rect);
            }
            else {
                sibling2.insertChildRectangle(rect);
            }
        });
        this.children.length = 0;
        sorted.length = 0;
        return [sibling1, sibling2];
    };
    RTreeRectangle.prototype.numberOfChildren = function () {
        return this.children.length;
    };
    RTreeRectangle.prototype.isLeafNode = function () {
        return this.children.length === 0;
    };
    RTreeRectangle.prototype.hasLeafNodes = function () {
        return this.isLeafNode() || this.children[0].isLeafNode();
    };
    RTreeRectangle.prototype.insertChildRectangle = function (insertRect) {
        insertRect.parent = this;
        this.children.push(insertRect);
        this.growRectangleToFit(insertRect);
    };
    RTreeRectangle.prototype.removeChildRectangle = function (removeRect) {
        this.children.splice(_.indexOf(this.children, removeRect), 1);
    };
    RTreeRectangle.prototype.getSubtreeData = function () {
        if (this.children.length === 0) {
            return [this.data];
        }
        return _.chain(this.children)
            .map(_.method("getSubtreeData"))
            .thru(fastFlattenArray)
            .value();
    };
    return RTreeRectangle;
}());
var RTree = (function () {
    function RTree(maxNodes, distanceMetric) {
        this.distanceMetric = distanceMetric;
        this.maxNodes = maxNodes;
        this.root = RTreeRectangle.generateEmptyNode();
        this.recursiveSearchIterations = 0;
    }
    RTree.prototype._recursiveSeach = function (searchRect, node) {
        this.recursiveSearchIterations++;
        var _this = this;
        if (searchRect.contains(node) || node.isLeafNode()) {
            return node.getSubtreeData();
        }
        else {
            return _.chain(node.children)
                .filter(_.method("overlaps", searchRect))
                .map(function (iterateNode) {
                return _this._recursiveSeach(searchRect, iterateNode);
            })
                .flatten()
                .value();
        }
    };
    RTree.prototype.search = function (searchBoundary) {
        var searchRect = new RTreeRectangle(searchBoundary.x, searchBoundary.y, searchBoundary.width, searchBoundary.height, null);
        return this._recursiveSeach(searchRect, this.root);
    };
    RTree.prototype.insert = function (dataPoint) {
        var insertRect = new RTreeRectangle(dataPoint.x, dataPoint.y, dataPoint.width, dataPoint.height, dataPoint.data);
        var currentNode = this.root;
        while (!currentNode.hasLeafNodes()) {
            currentNode.growRectangleToFit(insertRect);
            currentNode = _.minBy(currentNode.children, _.method("areaIfGrownBy", insertRect));
        }
        currentNode.insertChildRectangle(insertRect);
        this.balanceTreePath(insertRect);
    };
    RTree.prototype._recursiveTreeLayer = function (listOfRectangles, level) {
        if (level === void 0) { level = 1; }
        var numberOfParents = Math.ceil(listOfRectangles.length / this.maxNodes);
        var nodeLevel = [];
        var childCount = 0;
        var parent;
        for (var i = 0; i < numberOfParents; i++) {
            parent = RTreeRectangle.generateEmptyNode();
            childCount = Math.min(this.maxNodes, listOfRectangles.length);
            for (var y = 0; y < childCount; y++) {
                parent.insertChildRectangle(listOfRectangles.pop());
            }
            nodeLevel.push(parent);
        }
        if (numberOfParents > 1) {
            return this._recursiveTreeLayer(nodeLevel, level + 1);
        }
        else {
            return nodeLevel;
        }
    };
    RTree.prototype.batchInsert = function (listOfData) {
        var listOfRectangles = _.map(listOfData, function (dataPoint) {
            return new RTreeRectangle(dataPoint.x, dataPoint.y, dataPoint.width, dataPoint.height, dataPoint.data);
        });
        var maxCoordinate = -Infinity;
        var minCoordinate = Infinity;
        var coordX, coordY;
        _.each(listOfRectangles, function (rect) {
            coordX = Math.ceil(rect.x + rect.width * 0.5);
            coordY = Math.ceil(rect.y + rect.height * 0.5);
            maxCoordinate = Math.max(maxCoordinate, Math.max(coordX, coordY));
            minCoordinate = Math.min(minCoordinate, Math.min(coordX, coordY));
        });
        var distanceMetric = this.distanceMetric;
        var sorted = _.sortBy(listOfRectangles, function (rect) {
            if (distanceMetric=="hilbert"){
                return HilbertCurves.toHilbertCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);
            } else if (distanceMetric=="z-order") {
                return HilbertCurves.toZCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);                
            } else if (distanceMetric=="row-major") {
                return HilbertCurves.toRowMajorCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);                
            } else if (distanceMetric=="random") {
                return HilbertCurves.toRandomCoordinates(maxCoordinate - minCoordinate, Math.ceil(rect.x + rect.width * 0.5) - minCoordinate, Math.ceil(rect.y + rect.height * 0.5) - minCoordinate);                
            } else {
                alert(this.root + "|\n" + arguments.callee.caller.toString() + "|\n" + arguments.callee.caller.caller.toString() + "|\n" + this.distanceMetric);
            }
        });
        listOfRectangles.length = 0;
        this.root = this._recursiveTreeLayer(sorted)[0];
    };
    RTree.prototype.balanceTreePath = function (leafRectangle) {
        var currentNode = leafRectangle;
        while (!_.isUndefined(currentNode.parent) && currentNode.parent.numberOfChildren() > this.maxNodes) {
            var currentNode = currentNode.parent;
            if (currentNode != this.root) {
                currentNode.parent.removeChildRectangle(currentNode);
                _.forEach(currentNode.splitIntoSiblings(), function (insertRect) {
                    currentNode.parent.insertChildRectangle(insertRect);
                });
            }
            else if (currentNode == this.root) {
                _.forEach(currentNode.splitIntoSiblings(), function (insertRect) {
                    currentNode.insertChildRectangle(insertRect);
                });
            }
        }
    };
    return RTree;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoici10cmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsici10cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBO0lBSUMsd0JBQW1CLENBQVMsRUFDTixDQUFTLEVBQ1QsS0FBYSxFQUNiLE1BQWMsRUFDZCxJQUFTO1FBSlosTUFBQyxHQUFELENBQUMsQ0FBUTtRQUNOLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFDVCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQUs7UUFQeEIsYUFBUSxHQUF5QixFQUFFLENBQUM7SUFReEMsQ0FBQztJQUVhLGdDQUFpQixHQUEvQjtRQUNDLE1BQU0sQ0FBQyxJQUFJLGNBQWMsQ0FBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFFLENBQUM7SUFDN0QsQ0FBQztJQUVNLGlDQUFRLEdBQWYsVUFBaUIsV0FBMkI7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3BMLENBQUM7SUFFTSxpQ0FBUSxHQUFmLFVBQWlCLFdBQTJCO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssSUFBSSxJQUFJLENB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