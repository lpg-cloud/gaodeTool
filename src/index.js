import "./maps_with_mouseTool"

class layer {
  constructor() {
    this.markers = [];
    this.lines = [];
    this.polygons = [];
  }
  add(obj) {
    switch (obj.CLASS_NAME) {
      case "AMap.Marker":
        this.markers.push(obj);
        break;
      case "AMap.Polyline":
        this.lines.push(obj);
        break;
      case "AMap.Polygon":
        this.polygons.push(obj);
        break;
    }
  }
  remove(obj) {
    switch (obj.CLASS_NAME) {
      case "AMap.Marker":
        this.markers.remove(obj);
        break;
      case "AMap.Polyline":
        this.lines.remove(obj);
        break;
      case "AMap.Polygon":
        this.polygons.remove(obj);
        break;
    }
  }
}

let layer_ = new layer();
const defaultOptions = {
  map: null,
  markerStyle: {},
  polylineStyle: {
    strokeColor: "#3366FF",
    strokeOpacity: 1,
    strokeWeight: 2,
    // 线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    // strokeDasharray: [10, 5],
  },
  polygonStyle: null,
  layer: layer_,
}
export default class tools {
  constructor(mapobj, options = {}) {
    let that=this;
    Object.assign(this, defaultOptions, options);
    this.map = mapobj;
    this.mouseTool = new AMap.MouseTool(this.map);

    AMap.event.addListener(this.mouseTool, 'draw', function (e) {

      that.layer.add(e.obj);
      that.mouseTool.close();
    });
  }
  measure(type) {
    switch (type) {
      case 'line': {
        let that = this;
        this.mouseTool.rule();
        AMap.event.addListener(mouseTool, 'draw', function (e) {
          //console.log(e.obj,e.obj.getPath());//获取路径/范围
          that.mouseTool.close();
        });
        break;
      }
      case 'area': {
        let that = this;
        this.mouseTool.measureArea({
          strokeColor: '#80d8ff',
          fillColor: '#80d8ff',
          fillOpacity: 0.3
          //同 Polygon 的 Option 设置
        });

        AMap.event.addListener(this.mouseTool, 'draw', function (e) {
          //console.log(e.obj,e.obj.getPath());//获取路径/范围
          that.mouseTool.close();
        });
        break;
      }
    }
  }
  clearAll() {
    this.map.clearMap();
    this.layer = new layer();
  }
  draw(type) {
    let that = this;
    switch (type) {

      case "marker":

        this.map.on("click", addMarker);

        function addMarker(e) {
          let marker = new AMap.Marker({
            position: e.lnglat,
            draggable: false,
          });
          this.add(marker);
          that.layer.add(marker);
          this.off('click', addMarker);
        }
        break;
      case "line":
        this.mouseTool.polyline(this.polylineStyle);
        //虽然是draw，但是是画完线后的回调事件
        let mouseTool = this.mouseTool;
        
        break;
      case "polygon":
        this.mouseTool.polygon(this.polygonStyle);
        //虽然是draw，但是是画完线后的回调事件
        
    }
  }
  getMap() {
    return this.map();
  }
  getGeoJSON() {
    let json = {
      type: "FeatureCollection",
      features: []
    };
    for (var item in this.layer) {
      let featureList = this.layer[item];
      for (var j in featureList) {
        json.features.push(featureList[j].toGeoJSON());
      }
    }
    return json;
  }
  getLayer() {
    return this.layer;
  }
}



if (window) window.Tools = tools;