var HilbertCurves;
(function (HilbertCurves) {
    function toHilbertCoordinates(maxCoordinate, x, y, scale=1.0) {
        var r = maxCoordinate;
        x *= scale;
        var mask = (1 << r) - 1;
        var hodd = 0;
        var heven = x ^ y;
        var notx = ~x & mask;
        var noty = ~y & mask;
        var tmp = notx ^ y;
        var v0 = 0;
        var v1 = 0;
        for (var k = 1; k < r; k++) {
            v1 = ((v1 & heven) | ((v0 ^ noty) & tmp)) >> 1;
            v0 = ((v0 & (v1 ^ notx)) | (~v0 & (v1 ^ noty))) >> 1;
        }
        hodd = (~v0 & (v1 ^ x)) | (v0 & (v1 ^ noty));
        return hilbertInterleaveBits(hodd, heven);
    }
    HilbertCurves.toHilbertCoordinates = toHilbertCoordinates;
    function toZCoordinates(maxCoordinate, x, y) {
        return hilbertInterleaveBits(x, y);
    }
    HilbertCurves.toZCoordinates = toZCoordinates;


    function toRowMajorCoordinates(maxCoordinate, x, y) {
        return Number(y.toString() + x.toString());
    }   
    HilbertCurves.toRowMajorCoordinates = toRowMajorCoordinates;

    function toScanCoordinates(maxCoordinate, x, y) {
        xcoord = y%2? maxCoordinate-x : x;
        return ((y)*maxCoordinate) + xcoord;
    }   
    HilbertCurves.toScanCoordinates = toScanCoordinates;    


    function toRandomCoordinates(maxCoordinate, x, y) {
        return Math.floor(Math.random()*2*maxCoordinate);
    }   
    HilbertCurves.toRandomCoordinates = toRandomCoordinates;    

    function hilbertInterleaveBits(odd, even) {
        var val = 0;
        var max = Math.max(odd, even);
        var n = 0;
        while (max > 0) {
            n++;
            max >>= 1;
        }
        for (var i = 0; i < n; i++) {
            var mask = 1 << i;
            var a = (even & mask) > 0 ? (1 << (2 * i)) : 0;
            var b = (odd & mask) > 0 ? (1 << (2 * i + 1)) : 0;
            val += a + b;
        }
        return val;
    }
})(HilbertCurves || (HilbertCurves = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGlsYmVydEN1cnZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhpbGJlcnRDdXJ2ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxhQUFhLENBd0NuQjtBQXhDRCxXQUFPLGFBQWEsRUFBQSxDQUFDO0lBQ3BCLDhCQUFzQyxhQUFxQixFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ2hGLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRXJCLElBQUksR0FBRyxHQUFHLElBQUksR0FBRSxDQUFDLENBQUM7UUFFbEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsR0FBRyxDQUFBLENBQUUsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQixFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRCxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFN0MsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBbkJlLGtDQUFvQix1QkFtQm5DLENBQUE7SUFFRCwrQkFBZ0MsR0FBVyxFQUFFLElBQVc7UUFDdkQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDaEIsQ0FBQyxFQUFFLENBQUM7WUFDRixHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUVELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDNUIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ1osQ0FBQztBQUNGLENBQUMsRUF4Q00sYUFBYSxLQUFiLGFBQWEsUUF3Q25CIn0=