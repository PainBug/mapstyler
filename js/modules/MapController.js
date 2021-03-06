define([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/VectorTileLayer",
    "esri/views/layers/LayerView",
    "esri/widgets/Search",
    "modules/Utils",
    "dojo/domReady!"
], function(Map, MapView, VectorTileLayer, LayerView, Search, Utils) {

    //Constructor for a new MapController
    var MapController = function (viewDiv){
        this.viewDiv = viewDiv;
    }
    
    //Builds the default map
    MapController.prototype.buildMap = function(){
        var that = this;
        var mapWait = $.Deferred();
        var item = "https://arcgis.com/sharing/rest/content/items/5ad3948260a147a993ef4865e3fad476";
        this.map = new Map();

        this.view = new MapView({
            container: viewDiv,
            map: this.map,
            zoom: 13,
            center: [-0.010557, 51.495997]
        });

        var searchWidget = new Search({
            view: this.view
        });

        this.view.ui.add(searchWidget, {
            position: "top-right",
            index: 0
        });

        var tileLyr = new VectorTileLayer({
            url: item + "/resources/styles/root.json",
            opacity:1
        });
        
        this.map.add(tileLyr);

        tileLyr.on("layerview-create", function (evt) {
            layerView = evt.layerView;
            //Set the original JSON style as a variable. We will need to revert to this each time we update the map's style
            that.originalStyle = JSON.stringify(layerView.layer.styleRepository.styleJSON);
            mapWait.resolve();
        });
        return mapWait.promise();
    }

    //Takes a palette object and applies it to the map
    MapController.prototype.applyPalette = function(palette){
        var array = Utils.getBaseColourArray();
        var style = this.originalStyle;
        var dict = Utils.getColourRamp(palette.colours[0], palette.colours[1]);
         document.body.style.background = palette.colours[0];

        for (var i = 0; i <= array.length; i++) {
            style = Utils.stringReplace(style, '"background-color":"' + array[i] + '"', '"background-color":"' + dict[array[i]] + '"')
            style = Utils.stringReplace(style, '"fill-color":"' + array[i] + '"', '"fill-color":"' + dict[array[i]] + '"');
            style = Utils.stringReplace(style, '"fill-outline-color":"' + array[i] + '"', '"fill-outline-color":"' + dict[array[i]] + '"');
            style = Utils.stringReplace(style, '"text-color":"' + array[i] + '"', '"text-color":"' + palette.colours[3] + '"');
            style = Utils.stringReplace(style, '"text-halo-color":"' + array[i] + '"', '"text-halo-color":"' + palette.colours[4] + '"');
            style = Utils.stringReplace(style, '"line-color":"' + array[i] + '"', '"line-color":"' + palette.colours[2] + '"');
        }
        var newStyle = JSON.parse(style);
        palette.storeStyle(style);

        this.map.layers.items[0].loadStyle(newStyle);
    }

    MapController.prototype.hideMap = function(){

    }
    MapController.prototype.showMap = function(){

    }

    //Stuff to make public
    return {
        MapController: MapController
        
    };
});