pavlov.specify("Omega.Galaxy", function(){
describe("Omega.Galaxy", function(){
  it("sets background", function(){
    var galaxy = new Omega.Galaxy({background : 1});
    assert(galaxy.bg).equals(1);
  });


  describe("#child", function(){
    it("returns solar system child w/ the specified id", function(){
      var system = new Omega.SolarSystem();
      var planet1 = Omega.Gen.planet();
      var planet2 = Omega.Gen.planet();
      system.children = [planet1, planet2];
      assert(system.child(planet1.id)).equals(planet1);
    });
  });

  describe("#refresh", function(){
    var node, galaxy, retrieved;
    before(function(){
      node = new Omega.Node();
      galaxy = Omega.Gen.galaxy();
      retrieved = Omega.Gen.galaxy();

      sinon.stub(Omega.Galaxy, 'with_id');
    });

    after(function(){
      Omega.Galaxy.with_id.restore();
    });

    it("retrieves galaxy from server", function(){
      galaxy.refresh(node);
      sinon.assert.calledWith(Omega.Galaxy.with_id,
        galaxy.id, node, {children: true, recursive: false},
        sinon.match.func);
    });

    it("updates galaxy with result", function(){
      sinon.stub(galaxy, 'update')
      galaxy.refresh(node);
      Omega.Galaxy.with_id.omega_callback()(retrieved);
      sinon.assert.calledWith(galaxy.update, retrieved);
    });

    it("invokes callback with galaxy", function(){
      var cb = sinon.spy();
      galaxy.refresh(node, cb);
      Omega.Galaxy.with_id.omega_callback()(retrieved);
      sinon.assert.called(cb);
    });

    it("dispatches refreshed event", function(){
      var cb = sinon.spy();
      galaxy.addEventListener('refreshed', cb);
      galaxy.refresh(node);
      Omega.Galaxy.with_id.omega_callback()(retrieved, cb);
      sinon.assert.called(cb);
    });
  });

  describe("#update", function(){
    var galaxy,  system1,   system2,
        ngalaxy, nsystem1, nsystem2, nsystem3;

    before(function(){
      galaxy  = Omega.Gen.galaxy();
      system1 = Omega.Gen.solar_system();
      system2 = Omega.Gen.solar_system();
      galaxy.children = [system1, system2, 'systemA'];

      ngalaxy  = Omega.Gen.galaxy();
      nsystem1 = Omega.Gen.solar_system();
      nsystem2 = Omega.Gen.solar_system({id : system2.id});
      nsystem3 = Omega.Gen.solar_system({id : 'systemA'});
      ngalaxy.children = [nsystem1, nsystem2, nsystem3];
    });

    it("adds missing children to galaxy", function(){
      galaxy.update(ngalaxy);
      assert(galaxy.children).includes(nsystem1);
    });

    it("updates galaxy children ids", function(){
      galaxy.update(ngalaxy);
      assert(galaxy.children).includes(nsystem3);
      assert(galaxy.children).doesNotInclude('system3');
    });

    it("updates existing children", function(){
      sinon.spy(system2, 'update');
      galaxy.update(ngalaxy);
      sinon.assert.calledWith(system2.update, nsystem2);
    });
  });

  describe("#toJSON", function(){
    it("returns galaxy json data", function(){
      var gal  = {id        : 'gal1',
                  name      : 'gal1n',
                  location  : new Omega.Location({id : 'gal1l'}),
                  children  : [new Omega.SolarSystem({id : 'sys1',
                                 location : new Omega.Location({id:'loc1'})})]};

      var ogal = new Omega.Galaxy(gal);
      var json = ogal.toJSON();

      gal.json_class  = ogal.json_class;
      gal.location    = gal.location.toJSON();
      gal.children[0] = gal.children[0].toJSON();
      assert(json).isSameAs(gal);
    });
  });

  it("converts children", function(){
    var system = {json_class: 'Cosmos::Entities::SolarSystem', id: 'sys1'};
    var galaxy = new Omega.Galaxy({children: [system]});
    assert(galaxy.children.length).equals(1);
    assert(galaxy.children[0]).isOfType(Omega.SolarSystem);
    assert(galaxy.children[0].id).equals('sys1');
  });

  it("converts location", function(){
    var galaxy = new Omega.Galaxy({location : {json_class : 'Motel::Location', data : {x: 10, y: 20, z:30}}});
    assert(galaxy.location).isOfType(Omega.Location);
    assert(galaxy.location.x).equals(10);
    assert(galaxy.location.y).equals(20);
    assert(galaxy.location.z).equals(30);
  });

  describe("#systems", function(){
    it("returns system children", function(){
      var sys1 = {json_class : 'Cosmos::Entities::SolarSystem', data : {id : 'sys1'}};
      var galaxy = new Omega.Galaxy({children : [sys1]});
      assert(galaxy.children.length).equals(1);
      assert(galaxy.children[0]).isOfType(Omega.SolarSystem);
    });
  });

  describe("#set_children_from", function(){
    var systems, galaxy;

    before(function(){
      systems  = [new Omega.SolarSystem({id : 'sys1'}),
                  new Omega.SolarSystem({id : 'sys2'})]
      gsystems = [new Omega.SolarSystem({id : 'sys1'})]
      galaxy   =  new Omega.Galaxy({children: gsystems});
    });

    it("swaps child systems in from entity list", function(){
      galaxy.set_children_from(systems);
      assert(galaxy.children.length).equals(1);
      assert(galaxy.children[0]).equals(systems[0]);
    });

    it("sets galaxy on systems swapped in", function(){
      galaxy.set_children_from(systems);
      assert(galaxy.children[0].galaxy).equals(galaxy);
      assert(systems[1].galaxy).isUndefined();
    });
  });

  describe("#load_gfx", function(){
    describe("graphics are initialized", function(){
      var orig;

      before(function(){
        orig = Omega.Galaxy.gfx;
      })

      after(function(){
        Omega.Galaxy.gfx = orig;
      });

      it("does nothing / just returns", function(){
        Omega.Galaxy.gfx = {density_wave1 : null};
        new Omega.Galaxy().load_gfx();
        assert(Omega.Galaxy.gfx.density_wave1).isNull();
      });
    });

    it("creates particle systems for galaxy", function(){
      Omega.Test.Canvas.Entities();

      assert(Omega.Galaxy.gfx.density_wave1).isOfType(Omega.GalaxyDensityWave);
      assert(Omega.Galaxy.gfx.density_wave1.stars1).isOfType(SPE.Group);
      assert(Omega.Galaxy.gfx.density_wave1.stars1.emitters.length).equals(1);
      assert(Omega.Galaxy.gfx.density_wave1.stars1.emitters[0]).isOfType(SPE.Emitter);
      assert(Omega.Galaxy.gfx.density_wave1.stars1.emitters[0].type).equals('spiral')
      assert(Omega.Galaxy.gfx.density_wave1.stars2).isOfType(SPE.Group);
      assert(Omega.Galaxy.gfx.density_wave1.stars2.emitters.length).equals(2);
      assert(Omega.Galaxy.gfx.density_wave1.stars2.emitters[0]).isOfType(SPE.Emitter);
      assert(Omega.Galaxy.gfx.density_wave1.stars2.emitters[0].type).equals('spiral')
      assert(Omega.Galaxy.gfx.density_wave1.stars2.emitters[1]).isOfType(SPE.Emitter);
      assert(Omega.Galaxy.gfx.density_wave1.stars2.emitters[1].type).equals('spiral')
      assert(Omega.Galaxy.gfx.density_wave1.clouds1).isOfType(SPE.Group);
      assert(Omega.Galaxy.gfx.density_wave1.clouds1.emitters.length).equals(1);
      assert(Omega.Galaxy.gfx.density_wave1.clouds1.emitters[0]).isOfType(SPE.Emitter);
      assert(Omega.Galaxy.gfx.density_wave1.clouds1.emitters[0].type).equals('spiral')
      assert(Omega.Galaxy.gfx.density_wave1.clouds2).isOfType(SPE.Group);
      assert(Omega.Galaxy.gfx.density_wave1.clouds2.emitters.length).equals(1);
      assert(Omega.Galaxy.gfx.density_wave1.clouds2.emitters[0]).isOfType(SPE.Emitter);
      assert(Omega.Galaxy.gfx.density_wave1.clouds2.emitters[0].type).equals('spiral')
      assert(Omega.Galaxy.gfx.density_wave1.base).isOfType(SPE.Group);
      assert(Omega.Galaxy.gfx.density_wave1.base.emitters.length).equals(1);
      assert(Omega.Galaxy.gfx.density_wave1.base.emitters[0]).isOfType(SPE.Emitter);
      assert(Omega.Galaxy.gfx.density_wave1.base.emitters[0].type).equals('disk')

      assert(Omega.Galaxy.gfx.density_wave2).isOfType(Omega.GalaxyDensityWave);
    });
  });

  describe("#init_gfx", function(){
    before(function(){
      /// preiinit using test page
      Omega.Test.Canvas.Entities();
    });

    it("loads galaxy gfx", function(){
      var galaxy    = new Omega.Galaxy();
      var load_gfx  = sinon.spy(galaxy, 'load_gfx');
      galaxy.init_gfx();
      sinon.assert.called(load_gfx);
    });

    it("references Galaxy density_waves", function(){
      var galaxy = new Omega.Galaxy();
      var mesh = new THREE.Mesh();
      galaxy.init_gfx();
      assert(galaxy.density_wave1).equals(Omega.Galaxy.gfx.density_wave1);
      assert(galaxy.density_wave2).equals(Omega.Galaxy.gfx.density_wave2);
    });

    it("adds particle system to galaxy scene components", function(){
      var galaxy = new Omega.Galaxy();
      galaxy.init_gfx();

      var expected = [galaxy.density_wave1.stars1.mesh,
                      galaxy.density_wave1.stars2.mesh,
                      galaxy.density_wave1.clouds1.mesh,
                      galaxy.density_wave1.clouds2.mesh,
                      galaxy.density_wave1.base.mesh,
                      galaxy.density_wave2.stars1.mesh,
                      galaxy.density_wave2.stars2.mesh,
                      galaxy.density_wave2.clouds1.mesh,
                      galaxy.density_wave2.clouds2.mesh,
                      galaxy.density_wave2.base.mesh,
                      galaxy.center.mesh];

      assert(galaxy.components).isSameAs(expected);
    });
  });

  describe("#run_effects", function(){
    //it("updates particle system density_wave") // NIY
  });

  describe("#with_id", function(){
    var node, retrieval_cb;

    before(function(){
      node = new Omega.Node();
      retrieval_cb = sinon.spy();
      sinon.stub(node, 'http_invoke');
    });

    it("invokes cosmos::get_entity request", function(){
      Omega.Galaxy.with_id('galaxy1', node, retrieval_cb);
      sinon.assert.calledWith(node.http_invoke,
        'cosmos::get_entity', 'with_id', 'galaxy1',
        'children', false, 'recursive', false,
        sinon.match.func);
    });

    it("passes children and recursive arguments onto cosmos::get_entity", function(){
      Omega.Galaxy.with_id('galaxy1', node,
                           {children : true, recursive : true},
                           retrieval_cb);
      sinon.assert.calledWith(node.http_invoke,
        'cosmos::get_entity', 'with_id', 'galaxy1',
        'children', true, 'recursive', true,
        sinon.match.func);
    });

    describe("cosmos::get_entity callback", function(){
      it("invokes callback", function(){
        Omega.Galaxy.with_id('galaxy1', node, retrieval_cb);
        node.http_invoke.omega_callback()({});
        sinon.assert.called(retrieval_cb);
      });

      it("creates new galaxy instance", function(){
        Omega.Galaxy.with_id('galaxy1', node, retrieval_cb);
        node.http_invoke.omega_callback()({result : {id:'gal1'}});
        var galaxy = retrieval_cb.getCall(0).args[0];
        assert(galaxy).isOfType(Omega.Galaxy);
        assert(galaxy.id).equals('gal1');
      });
    });
  });
});}); // Omega.Galaxy
