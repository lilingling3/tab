
    var map = new AMap.Map('mapContainer', {
        // 设置中心点
        center:[113.371,23.05],
        // 设置缩放级别
        zoom: 16
    });
    //地图中添加地图操作ToolBar插件
    map.plugin(["AMap.ToolBar"],function() {
        var toolBar = new AMap.ToolBar();
        map.addControl(toolBar);
    });
    addMarker(113.371,23.05);


function addMarker(lng,lat){
    var markers = [];
    marker = new AMap.Marker({
        icon:"images/map-icon.png",
        position:new AMap.LngLat(lng,lat)
    });
    marker.setMap(map);  //在地图上添加点
    markers.push(marker);
}



