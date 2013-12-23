/* Omega JS Resource Loader
 *
 * Copyright (C) 2013 Mohammed Morsi <mo@morsi.org>
 *  Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt
 */

Omega.UI.Loader = {
  status_indicator : null,

  preload : function(){
    if(Omega.UI.Loader.preloaded) return;
    Omega.UI.Loader.preloaded = true;

    if(this.status_indicator) this.status_indicator.push_state('loading_resource');
    var config = Omega.Config;

    /// pop state when all resources finish loading
    var _this = this;
    this.async_events  = 0;
    this.event_counter = 0;
    var event_cb = this.status_indicator ?
      function(){
        _this.event_counter += 1;
        if(_this.event_counter == _this.async_events)
          _this.status_indicator.pop_state();
      } : function(){};

    this.preload_resources(config, event_cb);
    this.preload_skybox(config, event_cb);
    /// TODO load cosmos entities/heirarchies ?
  },

  _entities_to_preload : function(config){
    var entities = [
      new Omega.SolarSystem(),
      new Omega.Galaxy(),
      new Omega.Star(),
      new Omega.JumpGate(),
    ];

    var processed_planets = [];
    for(var r in config.resources){
      if(r.substr(0,6) == 'planet'){
        var planet = new Omega.Planet({color: "00000" + r[6]});
        if(processed_planets.indexOf(planet.colori()) == -1){
          entities.push(planet);
          processed_planets.push(planet.colori());
        }
      }
    }

    for(var s in config.resources.ships)
      entities.push(new Omega.Ship({type : s}));
    for(var s in config.resources.stations)
      entities.push(new Omega.Station({type : s}));

    return entities;
  },

  /// preload entity meshes and gfx to be cloned later
  preload_resources : function(config, event_cb){
    var entities = this._entities_to_preload(config);
    for(var e = 0; e < entities.length; e++){
      var entity = entities[e];
      if(entity.async_gfx) this.async_events += entity.async_gfx;
      entities[e].load_gfx(config, event_cb);
    }
  },

  /// preload skybox backgrounds
  preload_skybox : function(config, event_cb){
    var skybox = new Omega.UI.CanvasSkybox();
    skybox.init_gfx();
    var num = Omega._num_backgrounds;
    this.async_events += num;
    for(var b = 1; b <= num; b++){
      skybox.set(b, config, event_cb);
    }
  },

  json : function(){
    if(!Omega.UI.Loader.json_loader)
      Omega.UI.Loader.json_loader = new THREE.JSONLoader();
    return Omega.UI.Loader.json_loader;
  }
};
