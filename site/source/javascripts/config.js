/* Omega Javascript Config
 *
 * Copyright (C) 2013 Mohammed Morsi <mo@morsi.org>
 *  Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt
 */

Omega.Config = {
  // uri & paths
  http_host         : 'localhost',
  http_path         : '/omega',
  ws_host           : 'localhost',
  ws_port           :  8080,

  url_prefix        :   '/womega',
  images_path       :   '/images',
  meshes_path       :   '/meshes',
  constraints       :   '/javascripts/constraints.json',

  // users
  anon_user         :      'anon',
  anon_pass         :      'nona',
  recaptcha_enabled :        true,
  recaptcha_pub     : 'change me',

  //autologin : ['user', 'pass'],

  // ui
  //canvas_width      :         900,
  //canvas_height     :         400,
  cam : {position : [2000, 3000, 3000],
         target   : [0,    0,    0]},

  //default_root      : 'random',

  // event tracking
  ship_movement     :          10,
  ship_rotation     :        0.01,
  station_movement  :          50,

  //movement
  movement_offset   : {min : 50, max: 100},
  follow_distance   : 100,

  // stats
  stats             : [['num_of', 'users'], ['users_with_most', 'entities', 10]],

  // gfx
  resources    : {
    'solar_system' : { 'material' : '/solar_system.png'},
    'star'         : { 'texture'  : '/textures/sun.jpg' },
    'jump_gate'    : { 'material' : '/meshes/wormhole_generator/generatormap.jpg',
                       'geometry' : '/meshes/wormhole_generator/wormhole_generator.json'},
    'planet0'      : { 'material' : '/textures/planet0.png' },
    'planet1'      : { 'material' : '/textures/planet1.png' },
    'planet2'      : { 'material' : '/textures/planet2.png' },
    'planet3'      : { 'material' : '/textures/planet3.png' },
    'planet4'      : { 'material' : '/textures/planet4.png' },
    'asteroid'     : { 'material' : '/textures/asteroid01.png',
                       'geometry' : '/meshes/asteroids1.json',
                       'scale'    : [90, 90, 40],
                       'rotation' : [1.57,3.14,0]},

    /// TODO remove ship rotation, not currently needed
    'ships'        : {
      'mining'       : { 'material' : '/textures/hull.png',
                         'geometry' : '/meshes/Agasicles/agasicles.json',
                         'trails'   : [[0,-5,-23]],
                         'lamps'    : [[5, 0x0000ff, [0,-5,3]],
                                       [3, 0x0000ff, [0,-7,25]],
                                       [3, 0x0000ff, [0,-9,-19]]]},
      'corvette'     : { 'material' : '/textures/hull.png',
                         'geometry' : '/meshes/Sickle/sickle.json',
                         'trails'   : [[7,0,-8], [-7,0,-8]],
                         'lamps'    : [[1, 0x0000ff, [0,  2, 41]],
                                       [2, 0x0000ff, [0,  4, 14]],
                                       [2, 0x0000ff, [0, -2, -9]]]},
      'transport'    : { 'material' : '/textures/AeraHull.png',
                         'geometry' : '/meshes/Agesipolis/agesipolis.json',
                         'trails'   : [[0, 0, -125]]},
      'destroyer'    : { 'material' : '/textures/AeraHull.png',
                         'geometry' : '/meshes/Leonidas/yavok.json'}

    },

    'stations'      : {
      'manufacturing' : { 'material' : '/meshes/research1.png',
                          'geometry' : '/meshes/research.json',
                          'lamps' : [[15, 0x0000ff, [0,   40, 0]],
                                     [15, 0x0000ff, [0, -300, 0]]]}}
  },

  audio : {
    'click'        : {'src' : 'effects_click_wav'},
    'construction' : {'src' : 'effects_construct_wav'},
    'destruction'  : {'src' : 'effects_destruction_wav'},
    'mining'       : {'src' : 'effects_mining2_wav'},

    'scenes' :
      {'intro' : { 'bg'     : {'src' : 'scenes_intro_bg_wav'},
                   'thud'   : {'src' : 'scenes_intro_thud2_wav'}},
       'tech1' : { 'bg'     : {'src' : 'scenes_tech1_bg_wav'}}}
  }
};
