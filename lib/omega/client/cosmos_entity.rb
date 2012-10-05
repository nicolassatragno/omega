#!/usr/bin/ruby
# omega client cosmos entities tracker
#
# Copyright (C) 2012 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

require 'omega/client/base'
require 'omega/client/location'
require 'omega/client/resource'

module Omega
  module Client
    class CosmosEntity < Entity
      def self.get_method
        "cosmos::get_entity"
      end

      def entity_id
        @entity.name
      end

      def self.entity_id_attr
        "name"
      end

    end

    class Galaxy < CosmosEntity
      attr_reader :location
      attr_reader :solar_systems

      def self.entity_type
        "Cosmos::Galaxy"
      end

      def get
        super
        @location = Omega::Client::Location.get @entity.location.id
        @solar_systems  = @entity.solar_systems.collect { |ss|
          Omega::Client::SolarSystem.get ss.name
        }
      end

    end

    class SolarSystem < CosmosEntity
      attr_reader :location
      attr_reader :star
      attr_reader :planets
      attr_reader :asteroids
      #attr_reader :jump_gates

      def self.entity_type
        "Cosmos::SolarSystem"
      end

      def get
        super
        @location = Omega::Client::Location.get @entity.location.id
        @star     = Omega::Client::Star.get @entity.star.name
        @planets  = @entity.planets.collect { |pl|
          Omega::Client::Planet.get pl.name
        }
        @asteroids  = @entity.asteroids.collect { |as|
          Omega::Client::Asteroid.get as.name
        }
        #@jump_gates  = @entity.jump_gates.collect { |jg|
        #  Omega::Client::JumpGate.get jg.name
        #}
      end
    end

    class Star < CosmosEntity
      attr_reader :location

      def self.entity_type
        "Cosmos::Star"
      end

      def get
        super
        @location = Omega::Client::Location.get @entity.location.id
      end
    end

    class Planet < CosmosEntity
      attr_reader :location
      attr_reader :moons

      def self.entity_type
        "Cosmos::Planet"
      end

      def get
        super
        @location = Omega::Client::Location.get @entity.location.id
        @moons    = @entity.moons.collect { |mn|
          Omega::Client::Moon.get mn.name
        }
      end
    end

    class Moon < CosmosEntity
      attr_reader :location

      def self.entity_type
        "Cosmos::Moon"
      end

      def get
        super
        @location = Omega::Client::Location.get @entity.location.id
      end
    end

    class Asteroid < CosmosEntity
      attr_reader :location
      attr_reader :resource_sources

      def self.entity_type
        "Cosmos::Asteroid"
      end

      def get
        super
        @location  = Omega::Client::Location.get @entity.location.id
        @resource_sources = Omega::Client::ResourceSource.associated_with(@entity.name)
      end
    end

    class JumpGate < CosmosEntity
      attr_reader :location

      def self.entity_type
        "Cosmos::JumpGate"
      end

      def get
        super
        @location = Omega::Client::Location.get @entity.location.id
      end
    end

  end
end
