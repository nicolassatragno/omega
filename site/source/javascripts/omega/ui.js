/* Omega Javascript Interface
 *
 * Copyright (C) 2013 Mohammed Morsi <mo@morsi.org>
 *  Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt
 */

//= require "vendor/jquery-ui-1.7.1.min"
//= require "vendor/three"
//= require "vendor/mousehold"
//= require "vendor/utf8_encode"
//= require "vendor/md5"

/* Instantiate and return a new UI
 */
function UI(){
  // at some point might want to parameterize
  // which components are instantiated
  this.dialog              = new Dialog();
  this.nav_container       = new NavContainer();
  this.chat_container      = new ChatContainer();
  this.status_indicator    = new StatusIndicator();
  this.canvas              = new Canvas();
  this.entity_container    = new EntityContainer();

  this.locations_container = new EntitiesContainer();
  this.locations_container.div_id = '#locations_list ul'
  this.locations_container.sort = function(a,b){ a.item.json_class < b.item.json_class }

  this.entities_container  = new EntitiesContainer();
  this.entities_container.div_id = '#entities_list ul'
  this.entities_container.sort = function(a,b){ a.item.json_class < b.item.json_class }

  this.missions_button     = new UIComponent();
  this.missions_button.div_id = '#missions_button';

  this.account_info = new AccountInfoContainer();

  return this;
}


/* UI Resources registry.
 *
 * Implements singleton pattern
 */
function UIResources(){
  if ( arguments.callee._singletonInstance )
    return arguments.callee._singletonInstance;
  arguments.callee._singletonInstance = this;

  $.extend(this, new Registry());

  // to render textures
  var texture_placeholder = document.createElement( 'canvas' );

  // to load mesh geometries
  var loader = new THREE.JSONLoader();

  /* Path to images directory
   */
  this.images_path = $omega_config['prefix'] + $omega_config['images_path'];

  /* Load a remote texture resource from the specified path
   */
  this.load_texture = function(path){
    var texture  = new THREE.Texture( texture_placeholder );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

    var image = new Image();
    image.onload = function () {
      texture.needsUpdate = true;
      material.map.image = this;
//$omega_scene.animate(); animation needed?
    };
    image.src = path;
    return material;
  }

  /* Load a remote mesh geometry resource from the specified path
   * and invoke callback when it is loaded
   */
  this.load_geometry = function(path, cb){
    loader.load(path, function(geometry){
      geometry.computeTangents();
      cb.apply(null, [geometry]);
    });
  }

  return this;
}

/* UI component base class.
 *
 * Subclasses should set 'id' attribut to css id of div corresponding
 * to component. Setting to null inidicates this component has no div
 *
 * Subclasses may define the 'toggle_control_id' to reference
 * a checkable page element controlling the display of the
 * component on the canvas
 */
function UIComponent(args){
  $.extend(this, new EventTracker());

  this.subcomponents = [];

  /* Overload callback registration to track page events
   */
  this.old_on = this.on;
  this.on = function(cb_id, cb){
    this.old_on(cb_id, cb);

    var comp = this;
    if(cb_id == 'resize'){
      comp.component().resizable();
      comp.component().resize(function(e){
        comp.raise_event('resize', e);
      });

    }else if(cb_id == "click"){
      this.component().live('click', function(e){
        comp.raise_event('click', e);
      });

    }else if(cb_id == "mousemove"){
      this.component().live('mousemove', function(e){
        comp.raise_event('mousemove', e);
      });

    }else if(cb_id == "mousedown"){
      this.component().live('mousedown', function(e){
        comp.raise_event('mousedown', e);
      });

    }else if(cb_id == "mouseup"){
      this.component().live('mouseup', function(e){
        comp.raise_event('mouseup', e);
      });
    }

  }

  /* Return the page component corresponding to this entity
   */
  this.component = function(){
    return $(this.div_id);
  }

  /* Append content to the component
   */
  this.append = function(content){
    this.component().append(content);
  }

  /* Return the page component corresponding to the toggle control
   */
  this.toggle_control = function(){
    return $(this.toggle_control_id)
  }

  /* Show the omega component
   */
  this.show = function(){
    if(this.component())
      this.component().show();
    for(var cmp in this.subcomponents)
      this.subcomponent.show();
    this.raise_event('show');
  }

  /* Hide the component
   */
  this.hide = function(){
    if(this.component())
      this.component().hide();
    for(var cmp in this.subcomponents)
      this.subcomponent.hide();
    this.raise_event('hide');
  }

  /* Toggle showing/hiding the component in on the page based
   * on checked attribute of the toggle_control input
   */
  this.toggle = function(){
    var to_toggle = $(this.toggle_control_id);
    if(to_toggle){
      if(to_toggle.is(':checked'))
        this.show();
      else
        this.hide();
    }
    this.scene.animate();
  }

  /* Set component size
   */
  this.set_size = function(w, h){
    // resize to specified width/height
    this.component().height(h);
    this.component().width(w);
    this.component().trigger('resize');
  }

  /* Return coordiantes on component corresponding
   * to absolute screen coordinates.
   *
   * Pass x,y position of click event relative to screen/window
   */
  this.click_coords = function(x,y){
    var nx = Math.floor(x-this.component().offset().left);
    var ny = Math.floor(y-this.component().offset().top);
    nx =   nx / this.component().width() * 2 - 1;
    ny = - ny / this.component().height() * 2 + 1;
    return [nx, ny];
  }


  /* Lock component in place. Client should specify sides to lock
   */
  this.lock = function(sides){
    var comp = this.component();
    if(!comp) return;
    comp.css({position: 'absolute'});
    if(typeof sides === "str")
      sides = [sides];
    for(var side in sides){
      if(sides[side] == 'top')
        comp.css({top : comp.position().top});
      else if(sides[side] == 'left')
        comp.css({left: $("#omega_canvas").position().left});
      else if(sides[side] == 'right')
        comp.css({right: $(document).width() - comp.offset().left - comp.width()});
        //comp.css({right: comp.position().right});
      //else if(sides[side] == 'bottom')
    }
  }
}

/* UI List Component
 *
 * Imposes no additional restrictions on subclasses
 */
function UIListComponent(args){
  $.extend(this, new UIComponent(args));

  /* Each item should be an object containing
   * 'item', 'id', and 'text' attributes
   */
  this.items = [];

  /* Function used to sort list before refreshing
   */
  this.sort = function(a,b){ return -1; };

  /* Clear items in the list
   */
  this.clear = function(){
    this.items = [];
  }

  /* Add item to this list
   */
  this.add_item = function(items){
    for(var i in items){
      var item = items[i];
      this.items.push(item);

      // wire up clicked handler
      // XXX probably should go into 'on' function
      // as in UIComponent callbacks, but this is
      // simple/clean/works for now
      $('#' + item.id).live('click', function(e){
        this.raise_event('click_item', item, e);
      })
    }

    this.refresh();
  }

  this.refresh = function(){
    if(!this.component()) return;
    this.component().html('');
    var text = '';
    this.items.sort(this.sort);
    for(var i in this.items)
      text += '<span id="' + this.items[i].id + '">' + this.items[i].text + '</span>';
    this.component().html(text);
  }
}

/* Canvas component base class
 *
 * Imposes no additional restrictions on subclasses, though
 * they may add items to the 'components' array to automatically
 * load canvas elements.
 *
 * Subclasses may define the 'toggle_canvas_id' proerty to reference
 * a checkable page element controlling the display of the
 * component in the scene specified by the 'scene' property
 */
function CanvasComponent(args){
  $.extend(this, new EventTracker());

  var showing = false;

  this.scene = args['scene'];

  this.components = [];

  /* Return toggle canvas page component
   */
  this.toggle_canvas = function(){
    return $(this.toggle_canvas_id)
  }

  /* Return boolean indicating if component is showing
   */
  this.is_showing = function(){
    return showing;
  }

  /* Hide the Component in the scene
   */
  this.shide = function(){
    for(var component in this.components){
      this.scene.remove_component(this.components[component]);
    }
    showing = false;
    this.toggle_canvas().attr(':checked', false)
  }

  /* Show the Component in the scene
   */
  this.sshow = function(){
    showing = true;
    this.toggle_canvas().attr(':checked', true)
    for(var component in this.components){
      this.scene.add_component(this.components[component]);
    }
  }

  /* Toggle showing/hiding the component in the scene based
   * on checked attribute of the toggle_canvas input
   */
  this.toggle = function(){
    var to_toggle = this.toggle_canvas();
    if(to_toggle){
      if(to_toggle.is(':checked'))
        this.sshow();
      else
        this.shide();
    }
    this.scene.animate();
  }

  /* Wire up the controls to the page
   */
  this.wire_up = function(){
    // wire up axis controls
    this.toggle_canvas().live('click', function(e){ this.stoggle(); });
    this.toggle_canvas().attr('checked', false);
  }
}


/* Canvas through which entities may be rendered
 */
function Canvas(args){
  $.extend(this, new UIComponent(args));

  var nargs       = $.extend({canvas : this}, args);

  this.div_id         = '#omega_canvas';
  this.toggle_control_id = '#toggle_canvas';
  this.scene      = new Scene(nargs);
  this.select_box = new SelectBox(nargs);
  this.subcomponents.push(this.scene)
  this.subcomponents.push(this.select_box)

  this.canvas_component = function(){
    return $(this.div_id + ' canvas');
  };

  //this.width  = $omega_config.canvas_width;
  //this.height = $omega_config.canvas_height;
  this.width  = $(document).width()  - this.component().offset().left - 50;
  this.height = $(document).height() - this.component().offset().top  - 50;
  this.scene.set_size(this.width, this.height);

  this.on('show', function(c){ this.toggle_control().html('Hide'); });
  this.on('hide', function(c){ this.toggle_control().html('Show'); });

  this.on('resize', function(c, e){
    this.width  = this.component().width() - 3;
    this.height = this.component().height() - 5;
    this.scene.set_size(this.width, this.height);
    this.scene.animate();
  });

  this.on('click', function(c, e){
    var coords = this.click_coords(e.pageX, e.pageY)
    var x = coords[0]; var y = coords[1];
    this.scene.clicked(x, y)
  });

  // XXX need to trigger mouse movement events on canvas itself, not
  // the container as that should respond to resize events,
  // temporarily store and set to canvas to wire up callbacks before restoring
  var old_component = this.component;
  this.component    = this.canvas_component;

  // delegate move movement events to select box
  var delegate_to_select = function(c, e){
    e.target = this.select_box.component()[0];
    this.select_box.component().trigger(e);
  }
  this.on('mousemove', delegate_to_select);
  this.on('mousedown', delegate_to_select);
  this.on('mouseup', delegate_to_select);

  this.component    = old_component;
}

/* Scene containing entities to render and renderer
 */
function Scene(args){
  /////////////////////////////////////// public data
  $.extend(this, new UIComponent(args));

  this.div_id = null;
  var entities = {};
  var root = null;

  this._scene    = new THREE.Scene();

  var nargs   = $.extend({scene : this}, args);
  this.canvas = nargs['canvas'];

  //this.selection = new SceneSelection(nargs);
  this.camera = new Camera(nargs);
  this.skybox = new Skybox(nargs);
  this.axis   = new Axis(nargs);
  this.grid   = new Grid(nargs);
  this.subcomponents.push(this.camera)
  this.subcomponents.push(this.axis)
  this.subcomponents.push(this.grid)

  //this.renderer = new THREE.CanvasRenderer({canvas: _canvas});
  this.renderer = new THREE.WebGLRenderer();
  this.canvas.component().append(this.renderer.domElement);

  /* override set size to map canvas resizing to renderer resizing
   */
  this.set_size = function(w, h){
    this.renderer.setSize(w, h);
    this.camera.set_size(w, h);
    this.camera.reset();
  }

  /* Add specified entity to scene
   */
  this.add_entity = function(entity){
    entities[entity.id] = entity;
    for(var comp in entity.components)
      this._scene.add_component(entity.components[comp]);
    entity.added_to(this);
  }

  /* Remove the entity specifed by entity_id from the scene.
   */
  this.remove_entity = function(entity_id){
    var entity = entities[entity_id];
    if(entity == null) return;

    for(var comp in entity.components)
      this.remove_component(entity.components[comp]);
    entity.removed_from(this);
  }

  /* Remove / readd entity to scene
   */
  this.reload_entity = function(entity){
    var oentity = entities[entity.id];
    if(!oentity) return;

    this.remove_entity(entity.id);
    this.add_entity(entity);
    this.animate();
  }

  /* Return boolean indicating in current scene
   * has the specified entity
   */
  this.has = function(entity_id){
    return entities[entity_id] != null;
  }

  /* Clear all entities tracked by scene
   */
  this.clear_entities = function(){
    for(var entity_id in entities){
      this.remove_entity(entity_id);
      //for(var comp in entity.components)
        //this.remove(comp);
    }
    entities = [];
  }

  /* Add specified component to backend three.js scene
   *
   * XXX would like to remove this or mark private
   */
  this.add_component = function(component){
    this._scene.add(component);
  }

  /* Remove specified component from backend three.js scene
   *
   * XXX would like to remove this or mark private
   */
  this.remove_component = function(component){
    this._scene.remove(component);
  }

  /* Set root entity of the scene.
   */
  this.set = function(entity){
    root = entity;

    var children = entity.children();
    for(var child in children){
      child = children[child];
      if(child)
        this.add_entity(child);
    }

    this.raise_event('set');
    this.animate();
  }

  /* Return root entity of the scene
   */
  this.get = function(){
    return root;
  }

  /* Refresh entities in the current scene
   */
  this.refresh = function(){
    this.set_root(root_entity);
  }

  /* handle canvas clicked event
   */
  this.clicked = function(x, y){
    var clicked_on_entity = false;

    var projector = new THREE.Projector();
    var ray = projector.pickingRay(new THREE.Vector3(x, y, 0.5),
                                   this.camera._camera);
    var intersects = ray.intersectObjects(this._scene.__objects);

    if(intersects.length > 0){
      var entities = this.get().children();
      for(var entity in entities){
        entity = entities[entity];
        if(entity.clickable_obj == intersects[0].object){
          clicked_on_entity = true;
          entity.clicked_in(this);
          entity.raise_event('click', this);
          break;
        }
      }
    }

    //if(!clicked_on_entity) controls.clicked_space(x, y);
  }

  /* unselect entity specified by id entity
   */
  this.unselect = function(entity_id){
    var entity = entities[entity_id];
    if(entity == null) return;
    entity.unselected_in(this);
    entity.raise_event('unselected', this);
  }

  /* Request animation frame
   */
  this.animate = function(){
    requestAnimationFrame(this.render);
  }

  /* Internal helper to render scene.
   *
   * !private shouldn't be called by end user!
   */
  var _this = this;
  this.render = function(){
    _this.renderer.render(_this._scene, _this.camera._camera);
  }

  /* Return the position of the backend scene
   *
   * XXX camera requries access to scene position
   */
  this.position = function(){
    return this._scene.position;
  }
}

/* Instantiate and return a new Camera
 */
function Camera(args){
  /////////////////////////////////////// public data
  $.extend(this, new UIComponent(args));

  this.scene = args['scene'];

  this.div_id = '#camera_controls';
  this.control_ids = { reset        : '#cam_reset',
                       pan_right    : '#cam_pan_right',
                       pan_left     : '#cam_pan_left',
                       pan_up       : '#cam_pan_up',
                       pan_down     : '#cam_pan_down',
                       rotate_right : '#cam_rotate_right',
                       rotate_left  : '#cam_rotate_left',
                       rotate_up    : '#cam_rotate_up',
                       rotate_down  : '#cam_rotate_down',
                       zoom_in      : '#cam_zoom_in',
                       zoom_out     : '#cam_zoom_out' };

  /////////////////////////////////////// private data

  var _width  = this.scene.canvas.width;
  var _height = this.scene.canvas.height;

  // private initializer
  var new_cam = function(){
    return new THREE.PerspectiveCamera(75, _width / _height, 1, 42000 );
    // new THREE.OrthographicCamera(-500, 500, 500, -500, -1000, 1000);
  }

  this._camera = new_cam();
  var looking_at = null;

  /////////////////////////////////////// public methods

  /* Set the size of the camera
   */
  this.set_size = function(width, height){
    _width = width; _height = height
    this._camera = new_cam();
  }

  /* Set camera to its default position
   */
  this.reset = function(){
    var z = (20 * Math.sqrt(_width) + 20 * Math.sqrt(_height));
    this.position({x : 0, y : 0, z : z});
    this.focus(this.scene.position());
    this.scene.animate();
  }

  /* Set/get the point the camera is looking at
   */
  this.focus = function(focus){
    if(looking_at == null){
      var pos = this.scene.position();
      looking_at = {x : pos.x, y : pos.y, z : pos.z};
    }
    if(focus != null){
      if(typeof focus.x !== "undefined")
        looking_at.x = focus.x;
      if(typeof focus.y !== "undefined")
        looking_at.y = focus.y;
      if(typeof focus.z !== "undefined")
        looking_at.z = focus.z;
    }
    this._camera.lookAt(looking_at);
    return looking_at;
  }

  /* Set/get the camera position.
   *
   * Takes option position param to set camera position
   * before returning current camera position.
   */
  this.position = function(position){
    if(typeof position !== "undefined"){
      if(typeof position.x !== "undefined")
        this._camera.position.x = position.x;

      if(typeof position.y !== "undefined")
        this._camera.position.y = position.y;

      if(typeof position.z !== "undefined")
        this._camera.position.z = position.z;
    }

    return {x : this._camera.position.x,
            y : this._camera.position.y,
            z : this._camera.position.z};
  }

  /* Zoom the Camera the specified distance from its
   * current position along the axis indicated by its focus
   */
  this.zoom = function(distance){
    var focus = this.focus();

    var x = this._camera.position.x,
        y = this._camera.position.y,
        z = this._camera.position.z;
    var dx = x - focus.x,
        dy = y - focus.y,
        dz = z - focus.z;
    var dist  = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
    var phi = Math.atan2(dx,dz);
    var theta   = Math.acos(dy/dist);

    if((dist + distance) <= 0) return;
    dist += distance;

    dz = dist * Math.sin(theta) * Math.cos(phi);
    dx = dist * Math.sin(theta) * Math.sin(phi);
    dy = dist * Math.cos(theta);

    this._camera.position.x = dx + focus.x;
    this._camera.position.y = dy + focus.y;
    this._camera.position.z = dz + focus.z;

    this.focus();
  }

  /* Rotate the camera using a spherical coordiante system.
   * Specify the number of theta and phi degrees to rotate
   * the camera from its current position
   */
  this.rotate = function(theta_distance, phi_distance){
    var focus = this.focus();

    var x = this._camera.position.x,
        y = this._camera.position.y,
        z = this._camera.position.z;
    var dx = x - focus.x,
        dy = y - focus.y,
        dz = z - focus.z;
    var dist  = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
    var phi = Math.atan2(dx,dz);
    var theta   = Math.acos(dy/dist);
    if(dz < 0) theta = 2 * Math.PI - theta; // adjust for acos loss

    theta += theta_distance;
    phi   += phi_distance;

    if(dz < 0) theta = 2 * Math.PI - theta; // readjust for acos loss

    // prevent camera from going too far up / down
    if(theta < 0.5)
      theta = 0.5;
    else if(theta > (Math.PI - 0.5))
      theta = Math.PI - 0.5;

    dz = dist * Math.sin(theta) * Math.cos(phi);
    dx = dist * Math.sin(theta) * Math.sin(phi);
    dy = dist * Math.cos(theta);

    this._camera.position.x = dx + focus.x;
    this._camera.position.y = dy + focus.y;
    this._camera.position.z = dz + focus.z;

    this.focus();
  }

  // Pan the camera along its own X/Y axis
  this.pan = function(x, y){
    var pos   = this.position();
    var focus = this.focus();

    var mat = this._camera.matrix;
    this._camera.position.x += mat.elements[0] * x;
    this._camera.position.y += mat.elements[1] * x;
    this._camera.position.z += mat.elements[2] * x;
    this._camera.position.x += mat.elements[4] * y;
    this._camera.position.y += mat.elements[5] * y;
    this._camera.position.z += mat.elements[6] * y;

    var npos   = this.position();
    this.focus({x : focus.x + (npos.x - pos.x),
                y : focus.y + (npos.y - pos.y),
                z : focus.z + (npos.z - pos.z)});
  }

  /* Wire up the camera to the page
   */
  this.wire_up = function(){
    // wire up camera controls

    if(jQuery.fn.mousehold){
      var _cam = this;

      $(this.control_ids['reset']).click(function(e){
        _cam.reset();
      });

      $(this.control_ids['pan_right']).click(function(e){
        _cam.pan(50, 0);
        _cam.scene.animate();
      });

      $(this.control_ids['pan_right']).mousehold(function(e, ctr){
        _cam.pan(50, 0);
        _cam.scene.animate();
      });

      $(this.control_ids['pan_left']).click(function(e){
        _cam.pan(-50, 0);
        _cam.scene.animate();
      });

      $(this.control_ids['pan_left']).mousehold(function(e, ctr){
        _cam.pan(-50, 0);
        _cam.scene.animate();
      });

      $(this.control_ids['pan_up']).click(function(e){
        _cam.pan(0, 50);
        _cam.scene.animate();
      });

      $(this.control_ids['pan_up']).mousehold(function(e, ctr){
        _cam.pan(0, 50);
        _cam.scene.animate();
      });

      $(this.control_ids['pan_down']).click(function(e){
        _cam.pan(0, -50);
        _cam.scene.animate();
      });

      $(this.control_ids['pan_down']).mousehold(function(e, ctr){
        _cam.pan(0, -50);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_right']).click(function(e){
        _cam.rotate(0.0, 0.2);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_right']).mousehold(function(e, ctr){
        _cam.rotate(0.0, 0.2);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_left']).click(function(e){
        _cam.rotate(0.0, -0.2);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_left']).mousehold(function(e, ctr){
        _cam.rotate(0.0, -0.2);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_up']).click(function(e){
        _cam.rotate(-0.2, 0.0);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_up']).mousehold(function(e, ctr){
        _cam.rotate(-0.2, 0.0);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_down']).click(function(e){
        _cam.rotate(0.2, 0.0);
        _cam.scene.animate();
      });

      $(this.control_ids['rotate_down']).mousehold(function(e, ctr){
        _cam.rotate(0.2, 0.0);
        _cam.scene.animate();
      });

      $(this.control_ids['zoom_out']).click(function(e){
        _cam.zoom(20);
        _cam.scene.animate();
      });

      $(this.control_ids['zoom_out']).mousehold(function(e, ctr){
        _cam.zoom(20);
        _cam.scene.animate();
      });

      $(this.control_ids['zoom_in']).click(function(e){
        _cam.zoom(-20);
        _cam.scene.animate();
      });

      $(this.control_ids['zoom_in']).mousehold(function(e, ctr){
        _cam.zoom(-20);
        _cam.scene.animate();
      });
    }
  }

}

/* Instantiate and return a new Skybox
 */
function Skybox(args){
  /////////////////////////////////////// public data
  $.extend(this, new CanvasComponent(args));

  /////////////////////////////////////// private data
  var skybox_bg  = null;

  var skyboxMesh = null;

  var size = 32768;

  /////////////////////////////////////// public methods

  this.background = function(new_background){
    if(new_background){
      this.background = new_background;

      var format = 'png';
      var path   = UIResources().images_path +
                   '/skybox' + this_background + '/';
      var materials = [
        UIResources().load_texture(path + 'px.' + format),
        UIResources().load_texture(path + 'nx.' + format),
        UIResources().load_texture(path + 'pz.' + format),
        UIResources().load_texture(path + 'nz.' + format),
        UIResources().load_texture(path + 'py.' + format),
        UIResources().load_texture(path + 'ny.' + format)
      ];

      var skybox_mesh =
        UIResources().cached('skybox_mesh',
          function(i){
            var skyboxMesh =
              new THREE.Mesh(new THREE.CubeGeometry( size, size, size,
                                                     7, 7, 7, materials ),
                             new THREE.MeshFaceMaterial());
            skyboxMesh.scale.x = - 1;
            return skyboxMesh;
          });
      this.components.push(skybox_mesh);
    }
    return this.background;
  }
}

/* Instantiate and return a new Axis
 */
function Axis(args){
  /////////////////////////////////////// public data
  $.extend(this, new UIComponent(args));
  $.extend(this, new CanvasComponent(args));

  this.div_id = '#toggle_axis_canvas';
  this.toggle_canvas_id = this.div_id;

  this.num_markers = 3; // should be set to number of
                        // elements in distance_geometries

  /////////////////////////////////////// private data
  var size = 250;

  var step = 100;

  var line_geometry =
    UIResources().cached('axis_geometry',
      function(i) {
        var geo = new THREE.Geometry();
        geo.vertices.push( new THREE.Vector3( 0, 0, -4096 ) );
        geo.vertices.push( new THREE.Vector3( 0, 0,  4096 ) );

        geo.vertices.push( new THREE.Vector3( 0, -4096, 0 ) );
        geo.vertices.push( new THREE.Vector3( 0,  4096, 0 ) );

        geo.vertices.push( new THREE.Vector3( -4096, 0, 0 ) );
        geo.vertices.push( new THREE.Vector3(  4096, 0, 0 ) );

        return geo;
      });

  var line_material =
    UIResources().cached('axis_material',
      function(i) {
        return new THREE.LineBasicMaterial( { color: 0xcccccc,
                                              opacity: 0.4 } );
      })

  var distance_geometries =
    UIResources().cached('axis_distance_geometries',
      function(i) {
        return [new THREE.TorusGeometry(3000, 5, 40, 40),
                new THREE.TorusGeometry(2000, 5, 20, 20),
                new THREE.TorusGeometry(1000, 5, 20, 20)];
      });

  var distance_material =
    UIResources().cached('axis_distance_material',
      function(i) {
        return new THREE.MeshBasicMaterial({color: 0xcccccc });
      });

  var line =
    UIResources().cached('axis_line',
      function(i){
        return new THREE.Line(line_geometry, line_material,
                              THREE.LinePieces );
      });
  this.subcomponents.push(line);

  var distance_markers =
    UIResources().cached('axis_distance_markers',
      function(i){
        var dm = [];
        for(var geometry in distance_geometries){
          var mesh = new THREE.Mesh(distance_geometries[geometry],
                                    distance_material);
          mesh.position.x = 0;
          mesh.position.y = 0;
          mesh.position.z = 0;
          mesh.rotation.x = 1.57;
          dm.push(mesh);
        }

        return dm
      });
  for(var dm in distance_markers)
    this.components.push(distance_markers[dm]);
}

/* Instantiate and return a new Grid
 */
function Grid(args){
  /////////////////////////////////////// public data
  $.extend(this, new UIComponent(args));
  $.extend(this, new CanvasComponent(args));

  this.div_id = '#toggle_grid_canvas';
  this.toggle_canvas_id = this.div_id;

  /////////////////////////////////////// private data
  var size = 1000;

  var step = 250;

  var line_geometry =
    UIResources().cached('grid_geometry',
                         function(i) {
                           var geo = new THREE.Geometry();

                           // create line representing entire grid
                           for ( var i = - size; i <= size; i += step ) {
                             for ( var j = - size; j <= size; j += step ) {
                               geo.vertices.push( new THREE.Vector3( - size, j, i ) );
                               geo.vertices.push( new THREE.Vector3(   size, j, i ) );

                               geo.vertices.push( new THREE.Vector3( i, j, - size ) );
                               geo.vertices.push( new THREE.Vector3( i, j,   size ) );

                               geo.vertices.push( new THREE.Vector3( i, -size, j ) );
                               geo.vertices.push( new THREE.Vector3( i, size,  j ) );
                             }
                           }

                           return geo;
                         });

  var line_material =
    UIResources().cached('grid_material',
      function(i) {
        return new THREE.LineBasicMaterial( { color: 0xcccccc,
                                              opacity: 0.4 } );
      })

  var grid_line =
    UIResources().cached('grid_line',
      function(i){
        return new THREE.Line(line_geometry, line_material,
                              THREE.LinePieces );
      });
  this.components.push(grid_line);
}

/* Instantiate and return a new SelectBox
 */
function SelectBox(args){
  $.extend(this, new UIComponent(args));

  this.div_id = '#canvas_select_box';

  this.canvas = args['canvas'];

  /* disable explicity show / hide
   */
  this.show = this.hide = this.toggle = null;

  /* start showing the select box at the specified coords
   */
  var start_showing = function(x,y){
    this.dx = x; this.dy = y;
    this.component().show();
  }

  /* stop showing and hide the select box
   */
  var stop_showing = function(){
    var comp = this.component();
    comp.css('left', 0);
    comp.css('top',  0);
    comp.css('min-width',  0);
    comp.css('min-height', 0);
    comp.hide();
  }

  /* update the select box
   */
  var update_area = function(x,y){
    var comp = this.component();
    if(!comp.is(":visible")) return;
    var tlx = comp.css('left');
    var tly = comp.css('top');
    var brx = comp.css('left') + comp.css('min-width');
    var bry = comp.css('top')  + comp.css('min-height');

    var downX = this.dx; var downY = this.dy;
    var currX = x; var currY = y;

    if(currX < downX){ tlx = currX; brx = downX; }
    else             { tlx = downX; brx = currX; }

    if(currY < downY){ tly = currY; bry = downY; }
    else             { tly = downY; bry = currY; }

    var width  = brx - tlx;
    var height = bry - tly;

    var left = this.canvas.component().position().left + tlx;
    var top  = this.canvas.component().position().top + tly;

    this.component().css('left', left);
    this.component().css('top',   top);
    this.component().css('min-width',  width);
    this.component().css('min-height', height);
  }

  this.on('mousemove', function(sb, e){
    var x = e.pageX - this.canvas.component().offset().left;
    var y = e.pageY - this.canvas.component().offset().top;
    update_area.apply(this, [x, y])
  });

  this.on('mousedown', function(sb, e){
    var x = e.pageX - this.canvas.component().offset().left;
    var y = e.pageY - this.canvas.component().offset().top;
    start_showing.apply(this, [x, y]);
  });

  this.on('mouseup', function(sb, e){
    stop_showing.apply(this);
  });

}

/* Instantiate and return a new Entity Container
 */
function EntityContainer(args){
  $.extend(this, new UIComponent(args));

  this.div_id = '#omega_entity_container';

  //var nargs       = $.extend({container : this}, args);
  this.contents    = new UIListComponent();
  this.contents.div_id = '#entity_container_contents';
  this.subcomponents.push(this.contents);

  this.close_id = '#entity_container_close';

  /* Wire up the controls to the page
   */
  this.wire_up = function(){
    var container = this;
    $(this.close_id).live('click', function(e){
      container.hide();
    })
  }
}

/* Instantiate and return a new Dialog
 */
function Dialog(args){
  $.extend(this, new UIComponent(args));

  this.div_id = '#omega_dialog';

  if(args){
    // title to assign to dialog
    this.title = args['title'];

    // selector of div to populate dialog content from
    this.selector = args['selector'];

    // additional text to add to dialog
    this.text = args['text'];
  }

  /* Show the dialog
   *
   * @overloaded
   */
  this.show = function(){
    var content = $(this.selector).html();
    if(content == null) content = "";
    if(this.text == null) this.text = "";
    this.component().html(content + text).
                     dialog({title: title, width: '450px'}).
                     dialog('option', 'title', title).
                     dialog('open');
  };

  /* Hide omega dialog
   *
   * @overloaded
   */
  this.hide = function(){
    this.component().dialog('close');
  };
}

/* Instantiate and return a new Entities Container
 */
function EntitiesContainer(args){
  $.extend(this, new UIListComponent(args));

  if(args){
    this.div_id = args['id'];
  }
}

EntitiesContainer.hide_all = function(){
  var cl = '.entities_container';
  $(cl).hide();

  // XXX we also hide the missions button
  $('#missions_button').hide();
}

/* Instantiate and return a new Status Indicator
 */
function StatusIndicator(args){
  $.extend(this, new UIComponent(args));

  this.div_id       = '#status_icon';

  // stack of states which are currently set
  var states =  [];

  // Helper set icon background
  var set_bg = function(bg){
    if(bg == null){
      icon.css('background', '');
      return;
    }

    this.component().
         css('background',
             'url(' + $omega_config['host'] +
                      $omega_config['prefix'] +
                      '"/images/status/' + bg + '.png") no-repeat');
  }

  /* Return boolean indicating if state is currently represented locally
   */
  this.has_state = function(state){
    for(var s in states)
      if(states[s] == state)
        return true;
    return false;
  }

  /* Return boolean indicating if topmost state on stack is the specified state
   */
  this.is_state = function(state){
    if(states.length == 0) return false;
    return states[states.length-1] == state;
  };

  /* Push a new state onto the stack, this updates the status icon background
   */
  this.push_state = function(state){
    states.push(state);
    set_bg.apply(this, [state]);
  }

  /* Pop a new state of the stack, this updates the status icon background
   */
  this.pop_state = function(){
    states.pop();
    if(states.length > 0){
      set_bg.apply(this, [states[states.length-1]])

    }else{
      set_bg.apply(this, [null]);
    }
  }
}

/* Instantiate and return a new Chat Container
 */
function ChatContainer(args){
  $.extend(this, new UIComponent(args));

  this.div_id       = '#chat_container';

  this.input         = new UIComponent();
  this.input.div_id  = '#chat_input input[type=text]';
  this.input.container = this;

  this.button        = new UIComponent();
  this.button.div_id = '#chat_input input[type=button]';
  this.button.container = this;

  this.output        = new UIComponent();
  this.output.div_id = '#chat_output textarea';
  this.output.container = this;

  this.subcomponents.push(this.input)
  this.subcomponents.push(this.output)
  this.subcomponents.push(this.button)

  this.toggle_control_id = '#toggle_chat';

  this.button.on('click', function(b){ b.attr('value', ''); });
}

/* Instantiate and return a new Nav Container
 */
function NavContainer(args){
  $.extend(this, new UIComponent(args));
  this.div_id = '#navigation';

  // navigation components

  this.register_link = new UIComponent();
  this.register_link.div_id = '#register_link';

  this.login_link = new UIComponent();
  this.login_link.div_id = '#login_link';

  this.logout_link = new UIComponent();
  this.logout_link.div_id = '#logout_link';

  this.account_link = new UIComponent();
  this.account_link.div_id = '#account_link';

  this.subcomponents.push(this.register_link)
  this.subcomponents.push(this.login_link)
  this.subcomponents.push(this.logout_link)
  this.subcomponents.push(this.account_link)

  /* Show login controls, hide logout controls
   */
  this.show_login_controls = function(){
    this.register_link.show();
    this.login_link.show();
    this.account_link.hide();
    this.logout_link.hide();
  }

  /* Show logout controls, hide login controls
   */
  this.show_logout_controls = function(){
    this.account_link.show();
    this.logout_link.show();
    this.register_link.hide();
    this.login_link.hide();
  }
}

/* Instantiate and return a new Account Info Container
 */
function AccountInfoContainer(args){
  $.extend(this, new UIComponent(args));
  this.div_id = '#account_info';

  this.update_button        = new UIComponent();
  this.update_button.div_id = '#account_info_update';
  this.subcomponents.push(this.update_button);

  /* get/set the username element
   */
  this.username = function(new_username){
    var container = $('#account_info_username input');
    if(new_username)
      container.attr('value', new_username);
    return container.attr('value');
  }

  /* get the password element
   */
  this.password = function(){
    var container = $('#user_password');
    return container.attr('value');
  }

  /* get/set the email element
   */
  this.email = function(new_email){
    var container = $('#account_info_email input');
    if(new_email)
      container.attr('value', new_email);
    return container.attr('value');
  }

  /* get/set the gravatar element from the user email
   */
  this.gravatar = function(user_email){
    var container = $('#account_logo');
    if(user_email){
      var gravatar_url = 'http://gravatar.com/avatar/' + md5(user_email) + '?s=175';
      container.html('<img src="'+gravatar_url+'" alt="gravatar" title="gravatar"></img>');
    }
    return container.html();
  }

  /* get/set entities lists
   */
  this.entities = function(entities){
    var ships_container    = $('#account_info_ships');
    var stations_container = $('#account_info_stations');
    for(var e in entities){
      if(entities[e].json_class == 'Manufactured::Ship')
        ships_container.append(entities[e].id + ' ')
      else if(entities[e].json_class == 'Manufactured::Station')
        stations_container.append(entities[e].id + ' ')
    }
  }

  /* return bool indiciating if password matches confirmation
   */
  this.passwords_match = function(){
    var pass1 = this.password();
    var pass2 = $('#user_confirm_password').attr('value');
    return pass1 == pass2;
  }

  /* return user generated from account info
   */
  this.user = function(){
    return new User({id    : this.username(),
                     email : this.email(),
                     password: this.password()});
  }

  /* add a badge to account into page
   */
  this.add_badge = function(id, description, rank){
    var container = $('#account_info_badges');
    // display top n badge
    badges.append("<div class='badge' " +
                  "     style='background: url(\"" + $omega_config.prefix +
                                       "/images/badges/"+ id +".png\");'>"+
                                    description + ': ' + (rank+1)+"</div>");
  }
}