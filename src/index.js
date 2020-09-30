import "./maps_with_mouseTool"

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
  polygonStyle: null
}
export default class tools {
  constructor(mapobj, options = {}) {
    Object.assign(this, defaultOptions, options);
    this.map = mapobj;
    this.mouseTool = new AMap.MouseTool(this.map);
  }
  measure(type) {
    switch (type) {
      case 'line': {
        let that= this;
        this.mouseTool.rule();
        AMap.event.addListener(mouseTool, 'draw', function (e) {
          //console.log(e.obj,e.obj.getPath());//获取路径/范围
          that.mouseTool.close();
        });
        break;
      }
      case 'area': {
        let that=this;
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
  }
  draw(type) {
    
    switch (type) {
      
      case "marker":
        this.map.on("click", addMarker);

        function addMarker(e) {
          let marker = new AMap.Marker({
            position: e.lnglat,
            draggable: false,
          });
          this.add(marker);
          this.off('click', addMarker);
        }
        break;
      case "line":
        this.mouseTool.polyline(this.polylineStyle);
        //虽然是draw，但是是画完线后的回调事件
        let mouseTool=this.mouseTool;
        AMap.event.addListener(this.mouseTool, 'draw', function (e) {
          mouseTool.close();
        });
        break;
      case "polygon":
        let that= this;
        this.mouseTool.polygon(this.polygonStyle);
        //虽然是draw，但是是画完线后的回调事件
        AMap.event.addListener(this.mouseTool, 'draw', function (e) {
          that.mouseTool.close();
        });
    }
  }
  getMap() {
    return this.map();
  }
}

if (window) window.Tools = tools;