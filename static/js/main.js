function recursiveDrawRectangles(canv, rect, level, color) {
    if (color === void 0) { color = undefined; }
    var ctx = canv.getContext("2d");
    if (rect.children.length == 0) {
        // ctx.strokeStyle = color || "#FF0000"; //?
        // ctx.setLineDash([3, 3]); //sets dashed lines of leaf nodes
        ctx.fillStyle ="#FF0000"; //colors the numbers red
        ctx.globalAlpha=0.8;
        if (rect.data == null){
            ctx.fillStyle = "#66ff33"
            ctx.globalAlpha=0.5;
        }

        ctx.fillRect(rect.x, canv.height - rect.y, rect.width, -rect.height); //makes rectangle
        // ctx.setLineDash([]); //?
        // ctx.fillStyle = color || "#FF0000"; //colors the numbers red
        ctx.font = "20px serif";
        if (document.getElementById("NumberInput").value=="1"){
            ctx.globalAlpha=1.0;
           ctx.fillText(rect.data != null ? rect.data : "query", rect.x + rect.width / 2, canv.height - rect.y - rect.height / 2);
        }
    }
    else if (rect.children.length > 0) {
        //internal node/rectangle
        // ctx.strokeStyle = "#000000"; //sets strokes to black

        // var level_color = {
        //         0: "#000000", //
        //         1: "#000099", //dark blue
        //         2: "#0000e6", //lighter blue
        //         3: "#6666ff", //lighter lighter blue
        //         4: "#66b3ff", 
        //         5: "#b3d9ff", 
        //         // 1: "#FF0066", //pink
        //         // 2: "#990099", //lavender
        //         // 3: "#3333cc", //blue
        //         // 4: "#000066", //dark blue
        //         // 5: "#000000", //black                
        //         // 1: "#000000", //black
        //         // 2: "#cc00ff", //lavender
        //         // 3: "#ff0066", //bright magenta
        //         // 4: "#ff3300", //red
        //         // 5: "#ffa31a", //orange              
        //         6: "#ffff00", //yellow
        //         7: "#000000",
        //         8: "#000000",
        //         9: "#000000",
        //         10: "#000000",
        //         11: "#000000",
        //         12: "#000000",
        // }[6-level]; //sets strokes to black
        // ctx.fillStyle = level_color;
        ctx.fillStyle = "#000000";        
        // ctx.fillStyle = "#000099";        
        // ctx.setLineDash([15, 15]); //sets dashedness
        ctx.globalAlpha=0.1;
        ctx.fillRect(rect.x, canv.height - rect.y, rect.width, -rect.height);
        // ctx.setLineDash([]);//??
        ctx.font = "20px serif"; //??
        // ctx.fillStyle = "#000000"; //makes numbers black
        if (document.getElementById("NumberInput").value=="1"){
            ctx.globalAlpha=1.0;
            ctx.fillText(level.toString(), rect.x + rect.width - 20, canv.height - rect.y - rect.height + 20);
        }
        _.forEach(rect.children, function (r) {
            recursiveDrawRectangles(canv, r, level + 1);
        });
    }   
}
function createTree(maxNodes, numberOfNodes, canvas, batchCreate, renderConstruction, distanceMetric, seed=0) {
    /*distanceMetric can be "hilbert" or "z-order" or "row-major" or "random"
    */
    if (seed == 0){
        seed = Math.random();
    }
    function pseudoRandom() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    var tree = new RTree(maxNodes, distanceMetric);
    var maxX = (canvas.width - 100);
    var maxY = (canvas.height - 100);
    var minWidth = 10;
    var minHeight = 10;
    var maxWidth = minWidth + 10;
    var maxHeight = minHeight + 10;
    var randX = pseudoRandom();
    var randY = pseudoRandom();
    var locality = document.getElementById("LocalityInput").value;
    var clusterJumpProb = document.getElementById("ClusterInput").value;
    var nodes = _.map(_.range(numberOfNodes), function (i) {
        var data = {};
        randX = (1-locality)*pseudoRandom() + locality*randX;
        randY = (1-locality)*pseudoRandom() + locality*randY;
        if (pseudoRandom() < clusterJumpProb){
            randX = pseudoRandom();
            randY = pseudoRandom();
        }
        data.x = Math.floor(randX * (maxX - minWidth));
        data.y = Math.floor(randY * (maxY - minHeight));
        data.width = Math.min(maxWidth, Math.floor(pseudoRandom() * (maxX - data.x)) + minWidth);
        data.height = Math.min(maxHeight, Math.floor(pseudoRandom() * (maxY - data.y)) + minHeight);
        data.data = i;
        return data;
    });
    var ctx = canvas.getContext("2d");
    if (batchCreate) {
        tree.batchInsert(nodes);
    }
    else {
        if (renderConstruction) {
            for (var i = 0; i < nodes.length; i++) {
                setTimeout(function (i) {
                    tree.insert(nodes[i]);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    recursiveDrawRectangles(canvas, tree.root, 1);
                }, 100 * i, i);
            }
        }
        else {
            for (var i = 0; i < nodes.length; i++) {
                tree.insert(nodes[i]);
            }
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recursiveDrawRectangles(canvas, tree.root, 1);
    return tree;
}

function showCurve(maxNodes, numberOfNodesPerSide, canvas, batchCreate, renderConstruction, distanceMetric, seed=0) {
    /*distanceMetric can be "hilbert" or "z-order" or "row-major" or "random"
    */
    var tree = new RTree(maxNodes, distanceMetric);
    var maxX = (canvas.width - 100);
    var maxY = (canvas.height - 100);
    var minWidth = 10;
    var minHeight = 10;
    var maxWidth = minWidth + 10;
    var maxHeight = minHeight + 10;
    var nodes = _.map(_.range(numberOfNodesPerSide*numberOfNodesPerSide), function (i) {
        var data = {};

        ii = (Math.floor(i/numberOfNodesPerSide))/numberOfNodesPerSide;
        jj = (i%numberOfNodesPerSide)/numberOfNodesPerSide;
        alert(i + " " + ii + " " + jj + " ");
        data.x = Math.floor(ii * (maxX - minWidth));
        data.y = Math.floor(jj * (maxY - minHeight));
        alert(i + " " + data.y + " " + data.x + " ");
        data.width = 10;
        data.height = 10;

        var minCoordinate = 0;
        var maxCoordinate = maxX - minWidth;
        var x_centroid = data.x;//Math.ceil(data.x + data.width * 0.5) - minCoordinate;
        var y_centroid = data.y;//Math.ceil(data.y + data.height * 0.5) - minCoordinate;

        var orderNumber = 0;

        if (distanceMetric == "hilbert"){
                orderNumber = HilbertCurves.toHilbertCoordinates(numberOfNodesPerSide, ii*numberOfNodesPerSide, jj*numberOfNodesPerSide);
            } else if (distanceMetric == "z-order"){
                orderNumber = HilbertCurves.toZCoordinates(numberOfNodesPerSide, ii*numberOfNodesPerSide, jj*numberOfNodesPerSide);                
            } else if (distanceMetric == "row-major"){
                orderNumber = HilbertCurves.toRowMajorCoordinates(numberOfNodesPerSide, ii*numberOfNodesPerSide, jj*numberOfNodesPerSide);                
            } else if (distanceMetric == "scan"){
                orderNumber = HilbertCurves.toScanCoordinates(numberOfNodesPerSide, ii*numberOfNodesPerSide, jj*numberOfNodesPerSide);                
            } else if (distanceMetric == "random"){
                orderNumber = HilbertCurves.toRandomCoordinates(numberOfNodesPerSide, ii*numberOfNodesPerSide, jj*numberOfNodesPerSide);                
            } else {
                alert("kyaghjsldf");
            }
        data.data = orderNumber;
        return data;
    });
    var ctx = canvas.getContext("2d");
    if (batchCreate) {
        tree.batchInsert(nodes);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recursiveDrawRectangles(canvas, tree.root, 1);
    return tree;
}

function searchTree(tree, x, y, width, height, canvas, viewModel, logResults=1) {
    var searchRect = {
        x: x,
        y: y,
        width: width,
        height: height
    };
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recursiveDrawRectangles(canvas, tree.root, 1);
    recursiveDrawRectangles(canvas, new RTreeRectangle(x, y, width, height, null), 1, "#0000ff");
    var results = tree.search(searchRect);
    if (logResults){
        viewModel.searchResults.removeAll();
        _.forEach(results, function (id) {
            viewModel.searchResults.push(id);
        });
    }
    return results;
}
$(document).ready(function () {
    var canvas = document.getElementById("canvas");
    var canvas2 = document.getElementById("canvas2");
    var $overlay = $(canvas);
    $overlay.attr("width", $overlay.parent().outerWidth() - 10);
    $overlay.attr("height", $overlay.parent().outerHeight() - 10);
    var tree = null;
    var myViewModel = {
        searchResults: ko.observableArray(),
        iterationResults: ko.observableArray(),
        batchConstruct: ko.observable(true),
        intermediateRender: ko.observable(false),
        showHilbert: function () {
            tree = showCurve(1000, 8, canvas, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "hilbert");
            tree = showCurve(1000, 8, canvas2, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "z-order");
            tree = showCurve(1000, 8, canvas3, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "row-major");
            tree = showCurve(1000, 8, canvas4, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "scan");
            tree = showCurve(1000, 8, canvas5, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "random");
        },
        createNewTree: function () {
            var maxNodes = document.getElementById("MaxNodesInput").value;
            var numberOfNodes = document.getElementById("NNodesInput").value;
            tree = createTree(maxNodes, numberOfNodes, canvas, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "z-order");
        },        
        queryTree: function () {
            x=canvas.width * Math.random()/2;
            y=canvas.height * Math.random()/2; 
            w=canvas.width * Math.random()/2;
            h=canvas.height * Math.random()/2;
            searchTree(tree, x, y, w, h, canvas, myViewModel, 1);
        },
        compareOrderings: function (){

            var maxNodes = document.getElementById("MaxNodesInput").value;
            var numberOfNodes = document.getElementById("NNodesInput").value;
            var nTrials = document.getElementById("NTrialsInput").value;

            var seed = Number(document.getElementById("SeedInput").value);
            if (seed==0){
                seed=Math.floor(Math.random()*1000);
            }

            HilbertTree = createTree(maxNodes, numberOfNodes, canvas, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "hilbert", seed);
            ZTree = createTree(maxNodes, numberOfNodes, canvas2, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "z-order", seed);
            RowMajorTree = createTree(maxNodes, numberOfNodes, canvas3, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "row-major", seed);            
            ScanTree = createTree(maxNodes, numberOfNodes, canvas4, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "scan", seed);            
            RandomTree = createTree(maxNodes, numberOfNodes, canvas5, myViewModel.batchConstruct(), myViewModel.intermediateRender(), "random", seed);            

            var queryRectangles = [];
            function pseudoRandom() {
                var x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            }


            for (var i = 0; i < nTrials; i++){
                queryRectangles.push([canvas.width * pseudoRandom()/2, 
                                 canvas.height * pseudoRandom()/2, 
                                 canvas.width * pseudoRandom()/4, 
                                 canvas.height * pseudoRandom()/4]);
            }

            // var d = new Date();
            // var HilbertStartTime = d.getTime();
            var HilbertTimeTotal = 0;
            var ZTimeTotal = 0;
            var RowMajorTimeTotal = 0;
            var ScanTimeTotal = 0;
            var RandomTimeTotal = 0;
            for (var i = 0; i < nTrials; i++){
                var x = queryRectangles[i][0];
                var y = queryRectangles[i][1];                
                var w = queryRectangles[i][2];
                var h = queryRectangles[i][3];  
                //===========================================================    
                var d = new Date();
                var HilbertStartTime = d.getTime();                                          
                searchTree(HilbertTree, x, y, w, h, canvas, myViewModel, 0);
                d = new Date();
                HilbertTimeTotal += d.getTime() - HilbertStartTime;   
                //===========================================================   
                var d = new Date();
                var ZStartTime = d.getTime();                                          
                searchTree(ZTree, x, y, w, h, canvas2, myViewModel, 0);
                d = new Date();
                ZTimeTotal += d.getTime() - ZStartTime;  
                //===========================================================   
                var d = new Date();
                var RowMajorStartTime = d.getTime();                                          
                searchTree(RowMajorTree, x, y, w, h, canvas3, myViewModel, 0);
                d = new Date();
                RowMajorTimeTotal += d.getTime() - RowMajorStartTime; 
                //===========================================================   
                var d = new Date();
                var ScanStartTime = d.getTime();                                          
                searchTree(ScanTree, x, y, w, h, canvas4, myViewModel, 0);
                d = new Date();
                ScanTimeTotal += d.getTime() - ScanStartTime;                 
                //===========================================================   
                var d = new Date();
                var RandomStartTime = d.getTime();                                          
                searchTree(RandomTree, x, y, w, h, canvas5, myViewModel, 0);
                d = new Date();
                RandomTimeTotal += d.getTime() - RandomStartTime;                                                           
            }

            var cpu_time = [[HilbertTimeTotal, "Hilbert"], [ZTimeTotal, "Z-Order"], [RowMajorTimeTotal, "Row-Major"],[ScanTimeTotal, "Scan"], [RandomTimeTotal, "Random"]].sort();
            // for(var i = 0; i < cpu_time.length; i++){
            //     myViewModel.searchResults.push(cpu_time[i][1] + ": \t" + cpu_time[i][0] + " ms");
            // }
            var search_its = [[HilbertTree.recursiveSearchIterations/nTrials, "Hilbert"], [ZTree.recursiveSearchIterations/nTrials, "Z-Order"], [RowMajorTree.recursiveSearchIterations/nTrials, "Row-Major"],  [ScanTree.recursiveSearchIterations/nTrials, "Scan"], [RandomTree.recursiveSearchIterations/nTrials, "Random"]].sort();
            for(var i = 0; i < search_its.length; i++){
                myViewModel.iterationResults.push(search_its[i][1] + ": \t" + search_its[i][0] + " calls");
            }


            HilbertTree.recursiveSearchIterations = 0;
            ZTree.recursiveSearchIterations = 0;
            RowMajorTree.recursiveSearchIterations = 0;
            ScanTree.recursiveSearchIterations = 0;
            RandomTree.recursiveSearchIterations = 0;
            // alert(HilbertTimeTotal + "/" +  ZTimeTotal)
        }
    };
    ko.applyBindings(myViewModel);
    myViewModel.createNewTree();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsaUNBQWtDLElBQXVCLEVBQUUsSUFBb0IsRUFBRSxLQUFhLEVBQUUsS0FBc0I7SUFBdEIscUJBQXNCLEdBQXRCLGlCQUFzQjtJQUNySCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWhDLEVBQUUsQ0FBQSxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUUsQ0FBQyxDQUFBLENBQUM7UUFDL0IsR0FBRyxDQUFDLFdBQVcsR0FBRSxLQUFLLElBQUksU0FBUyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQixHQUFHLENBQUMsU0FBUyxHQUFFLEtBQUssSUFBSSxTQUFTLENBQUM7UUFDbEMsR0FBRyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7UUFDdkIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pILENBQUM7SUFDRCxJQUFJLENBQUMsRUFB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