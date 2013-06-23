# Construction Command tests
#
# Copyright (C) 2013 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

require 'spec_helper'
require 'manufactured/commands/construction'

module Manufactured::Commands
describe Construction do
  describe "#id" do
    it "should be unique per station/entity" do
      c = Construction.new
      c.station = build(:station)
      c.entity = build(:ship)
      c.id.should == "#{c.station.id}-#{c.entity.id}"
    end
  end

  describe "#initialize" do
    it "sets defaults" do
      c = Construction.new
      c.station.should be_nil
      c.entity.should be_nil
      c.completed.should be_false
    end

    it "sets attributes" do
      st = build(:station)
      sh = build(:ship)
      c = Construction.new :station => st, :entity => sh
      c.station.should == st
      c.entity.should == sh
    end
  end

  describe "#should_run?" do
    context "server command shouldn't run" do
      it "returns false" do
        c = Construction.new
        c.terminate!
        c.should_run?.should be_false
      end
    end

    context "construction completed" do
      it "returns false" do
        c = Construction.new
        c.completed = true
        c.should_run?.should be_false
      end
    end

    it "returns true" do
      c = Construction.new
      c.should_run?.should be_true
    end
  end

  describe "#run!" do
    before(:each) do
      @st = build(:station)
      @sh = build(:ship)
      @c  = Construction.new :entity => @sh, :station => @st
    end

    it "invokes command.run!" do
      @c.run!
      @c.last_ran_at.should be_an_instance_of(Time)
    end

    context "construction completed" do
      it "runs construction_compelete callbacks" do
        Manufactured::Ship.should_receive(:construction_time).and_return(1)
        @c.instance_variable_set(:@last_ran_at, Time.now - 5)
        @st.should_receive(:run_callbacks).with('construction_complete', @st, @sh)
        @c.run!
      end
    end

    context "construction not completed" do
      it "runs partial_construction callbacks" do
        Manufactured::Ship.should_receive(:construction_time).and_return(2)
        @c.instance_variable_set(:@last_ran_at, Time.now - 1)
        @st.should_receive(:run_callbacks).
            with{ |*a|
              a[0].should == 'partial_construction'
              a[1].should == @st
              a[2].should == @sh
              a[3].should be < 1
            }
        @c.run!
      end
    end
  end

  describe "#to_json" do
    it "returns construction command in json format" do
      sh = build(:ship)
      st = build(:station)
      c = Construction.new :entity => sh, :station => st

      j = c.to_json
      j.should include('"json_class":"Manufactured::Commands::Construction"')
      j.should include('"id":"'+c.id+'"')
      j.should include('"station":{"json_class":"Manufactured::Station"')
      j.should include('"entity":{"json_class":"Manufactured::Ship"')
    end
  end

  describe "#json_create" do
    it "returns construction command from json format" do
      j = '{"json_class":"Manufactured::Commands::Construction","data":{"station":{"json_class":"Manufactured::Station","data":{"id":10005,"user_id":null,"type":null,"size":null,"docking_distance":100,"location":{"json_class":"Motel::Location","data":{"id":null,"x":0.0,"y":0.0,"z":1.0,"orientation_x":1.0,"orientation_y":0.0,"orientation_z":0.0,"restrict_view":true,"restrict_modify":true,"parent_id":null,"children":[],"movement_strategy":{"json_class":"Motel::MovementStrategies::Stopped","data":{"step_delay":1}},"callbacks":{},"last_moved_at":null}},"system_id":null,"resources":[]}},"entity":{"json_class":"Manufactured::Ship","data":{"id":10005,"user_id":null,"type":null,"size":null,"hp":25,"shield_level":0,"cargo_capacity":100,"attack_distance":100,"mining_distance":100,"docked_at":null,"attacking":null,"mining":null,"location":{"json_class":"Motel::Location","data":{"id":null,"x":0.0,"y":0.0,"z":1.0,"orientation_x":1.0,"orientation_y":0.0,"orientation_z":0.0,"restrict_view":true,"restrict_modify":true,"parent_id":null,"children":[],"movement_strategy":{"json_class":"Motel::MovementStrategies::Stopped","data":{"step_delay":1}},"callbacks":{},"last_moved_at":null}},"system_id":null,"resources":[],"callbacks":[]}},"id":"10005-10005","exec_rate":null,"ran_first_hooks":false,"last_ran_at":null,"terminate":false}}'
      c = JSON.parse j

      c.should be_an_instance_of(Construction)
      c.station.should be_an_instance_of(Manufactured::Station)
      c.entity.should be_an_instance_of(Manufactured::Ship)
    end
  end

end # describe Construction
end # module Manufactured::Commands