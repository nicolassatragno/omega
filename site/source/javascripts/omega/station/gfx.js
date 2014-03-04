/* Omega Station Graphics
 *
 * Copyright (C) 2014 Mohammed Morsi <mo@morsi.org>
 *  Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt
 */

//= require 'omega/station/mesh'
//= require 'omega/station/highlight'
//= require 'omega/station/lamps'
//= require 'omega/station/construction_bar'
//= require 'omega/station/construction_audio'

// Station GFX Mixin
Omega.StationGfx = {
  async_gfx : 2,

  load_gfx : function(config, event_cb){
    if(typeof(Omega.Station.gfx)            === 'undefined') Omega.Station.gfx = {};
    if(typeof(Omega.Station.gfx[this.type]) !== 'undefined') return;

    var gfx = {};
    Omega.Station.gfx[this.type] = gfx;
    gfx.mesh_material    = new Omega.StationMeshMaterial(config, this.type, event_cb);
    gfx.highlight        = new Omega.StationHighlightEffects();
    gfx.lamps            = new Omega.StationLamps(config, this.type);
    gfx.construction_bar = new Omega.StationConstructionBar();
    gfx.construction_audio = new Omega.StationConstructionAudioEffect(config);

    Omega.StationMesh.load_template(config, this.type, function(mesh){
      gfx.mesh = mesh;
      if(event_cb) event_cb();
    });
  },

  init_gfx : function(config, event_cb){
    if(this.components.length > 0) return; /// return if already initialized
    this.load_gfx(config, event_cb);

    this.components = [];

    var _this = this;
    Omega.StationMesh.load(this.type, function(mesh){
      _this.mesh = mesh;
      _this.mesh.omega_entity = _this;
      _this.components.push(_this.mesh.tmesh);
      _this.update_gfx();
      _this.loaded_resource('mesh', _this.mesh);
    });

    this.highlight = Omega.Station.gfx[this.type].highlight.clone();
    this.highlight.omega_entity = this;
    this.components.push(this.highlight.mesh);

    this.lamps = Omega.Station.gfx[this.type].lamps.clone();
    this.lamps.omega_entity = this;
    for(var l = 0; l < this.lamps.olamps.length; l++){
      this.lamps.olamps[l].init_gfx();
      this.components.push(this.lamps.olamps[l].component);
    }

    this.construction_bar = Omega.Station.gfx[this.type].construction_bar.clone();
    this.construction_bar.omega_entity = this;
    this.construction_bar.bar.init_gfx(config, event_cb);

    this.construction_audio = Omega.Station.gfx[this.type].construction_audio;

    this.update_gfx();
  },

  cp_gfx : function(from){
    /// return if not initialized
    if(!from.components || from.components.length == 0) return;
    this.components        = from.components;
    this.shader_components = from.shader_components;
    this.mesh              = from.mesh;
    this.highlight         = from.highlight;
    this.lamps             = from.lamps;
    this.construction_bar  = from.construction_bar;
    this.construction_audio = from.construction_audio;
  },

  update_gfx : function(){
    if(!this.location)        return;
    if(this.mesh)             this.mesh.update();
    if(this.highlight)        this.highlight.update();
    if(this.lamps)            this.lamps.update();
    if(this.construction_bar) this.construction_bar.update();

    if(this.location.is_stopped()){
      if(this._has_orbit_line())
        this._rm_orbit_line();
    }else if(!this._has_orbit_line()){
      this._calc_orbit();
      this._add_orbit_line(0x99CCEE);
    }
  },

  _run_movement_effects : function(){
    var now = new Date();
    if(!this.last_moved || this.location.is_stopped()){
      this.last_moved = now;
      return;
    }

    var elapsed = now - this.last_moved;
    var dist = this.location.movement_strategy.speed * elapsed / 1000;

    var angle = this._current_orbit_angle();
    var new_angle = dist + angle;
    this._set_orbit_angle(new_angle);
    this.last_moved = now;
    this.update_gfx();
  },

  run_effects : function(){
    this.lamps.run_effects();
    this._run_movement_effects();
  },

  /// TODO move these to omega/station/construction_bar.js (helper module ?)
  _has_construction_bar : function(){
    return this.components.indexOf(this.construction_bar.bar.components[0]) != -1;
  },

  _add_construction_bar : function(){
    for(var c = 0; c < this.construction_bar.bar.components.length; c++)
      this.components.push(this.construction_bar.bar.components[c]);
  },

  _rm_construction_bar : function(){
    for(var c = 0; c < this.construction_bar.bar.components.length; c++){
      var i = this.components.indexOf(this.construction_bar.bar.components[c]);
      this.components.splice(i, 1);
    }
  }
};

