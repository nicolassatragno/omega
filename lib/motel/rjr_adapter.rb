# Motel rjr adapter
#
# Copyright (C) 2012 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

require 'omega/exceptions'

module Motel

class RJRAdapter
  def self.init
    self.register_handlers(RJR::Dispatcher)
    Motel::Runner.instance.start :async => true
  end

  def self.register_handlers(rjr_dispatcher)
    rjr_dispatcher.add_handler('get_all_locations') {
       Users::Registry.require_privilege(:privilege => 'view', :entity => 'locations',
                                         :session   => @headers['session_id'])
       Runner.instance.locations
    }

    rjr_dispatcher.add_handler('get_location') { |location_id|
       loc = Runner.instance.locations.find { |loc| loc.id == location_id }
       raise Omega::DataNotFound, "location specified by #{location_id} not found" if loc.nil?

       if loc.restrict_view
         Users::Registry.require_privilege(:any => [{:privilege => 'view', :entity => "location-#{loc.id}"},
                                                    {:privilege => 'view', :entity => 'locations'}],
                                           :session => @headers['session_id'])
       end

       # FIXME traverse all of loc's descendants, and if remote location
       # server is specified, send request to get child location, swapping
       # it in for the one thats there
       loc
    }

    rjr_dispatcher.add_handler('create_location') { |*args|
       Users::Registry.require_privilege(:privilege => 'create', :entity => 'locations',
                                         :session   => @headers['session_id'])

       location = args.size == 0 ? Location.new : args[0]
       #location = Location.new location if args[0].is_a? Hash

       location.x = 0 if location.x.nil?
       location.y = 0 if location.y.nil?
       location.z = 0 if location.z.nil?
       Runner.instance.run location

       location
    }

    rjr_dispatcher.add_handler("update_location") { |location|
       rloc = Runner.instance.locations.find { |loc| loc.id == location.id  }
       raise Omega::DataNotFound, "location specified by #{location.id} not found" if rloc.nil?

       if rloc.restrict_modify
         Users::Registry.require_privilege(:any => [{:privilege => 'modify', :entity => "location-#{rloc.id}"},
                                                    {:privilege => 'modify', :entity => 'locations'}],
                                           :session   => @headers['session_id'])
       end

       # store the old location coordinates for comparison after the movement
       old_coords = [location.x, location.y, location.z]

       # FIXME XXX big problem/bug here, client must always specify location.movement_strategy, else location constructor will set it to stopped
       # FIXME this should halt location movement, update location, then start it again
       RJR::Logger.info "updating location #{location.id} with #{location}/#{location.movement_strategy}"
       rloc.update(location)

       # FIXME trigger location movement & proximity callbacks (make sure to keep these in sync w/ those invoked the the runner)
       # right now we can't do this because a single simrpc node can't handle multiple sent message response, see FIXME XXX in lib/simrpc/node.rb
       #rloc.movement_callbacks.each { |callback|
       #  callback.invoke(rloc, *old_coords)
       #}
       #rloc.proximity_callbacks.each { |callback|
       #  callback.invoke(rloc)
       #}

       location
    }

    rjr_dispatcher.add_handler('track_location') { |location_id, min_distance|
       loc = Runner.instance.locations.find { |loc| loc.id == location_id }
       raise Omega::DataNotFound, "location specified by #{location_id} not found" if loc.nil?


       on_movement = 
         Callbacks::Movement.new :min_distance => min_distance,
                                 :handler => lambda{ |loc, d, dx, dy, dz|
           begin
             if loc.restrict_view
               Users::Registry.require_privilege(:any => [{:privilege => 'view', :entity => "location-#{loc.id}"},
                                                          {:privilege => 'view', :entity => 'locations'}],
                                                 :session   => @headers['session_id'])
             end
             @rjr_callback.invoke('track_location', loc)

           rescue Omega::PermissionError => e
             RJR::Logger.warn "client does not have privilege to view movement of #{loc.id}"
             loc.movement_callbacks.delete on_movement
           rescue RJR::Errors::ConnectionError => e
             RJR::Logger.warn "track_location client disconnected"
             loc.movement_callbacks.delete on_movement
           end
         }
       loc.movement_callbacks << on_movement
       loc
    }

    rjr_dispatcher.add_handler('track_proximity') { |location1_id, location2_id, event, max_distance|
       loc1 = Runner.instance.locations.find { |loc| loc.id == location1_id }
       loc2 = Runner.instance.locations.find { |loc| loc.id == location2_id }
       raise Omega::DataNotFound, "location specified by #{location1_id} not found" if loc1.nil?
       raise Omega::DataNotFound, "location specified by #{location2_id} not found" if loc2.nil?

       on_proximity =
         Callbacks::Proximity.new :to_location => loc2,
                                  :event => event,
                                  :max_distance => max_distance,
                                  :handler => lambda { |location1, location2|
           begin
             if loc1.restrict_view
               Users::Registry.require_privilege(:any => [{:privilege => 'view', :entity => "location-#{loc1.id}"},
                                                          {:privilege => 'view', :entity => 'locations'}],
                                               :session   => @headers['session_id'])
             end

             if loc2.restrict_view
               Users::Registry.require_privilege(:any => [{:privilege => 'view', :entity => "location-#{loc2.id}"},
                                                        {:privilege => 'view', :entity => 'locations'}],
                                               :session   => @headers['session_id'])
             end

             @rjr_callback.invoke('track_proximity', loc1, loc2)

           rescue Omega::PermissionError => e
             RJR::Logger.warn "client does not have privilege to view proximity of #{loc1.id}/#{loc2.id}"
             loc.movement_callbacks.delete on_movement
           rescue RJR::Errors::ConnectionError => e
             RJR::Logger.warn "track_proximity client disconnected"
             loc.proximity_callbacks.delete on_proximity
           end
         }
       loc1.proximity_callbacks << on_proximity
       [loc1, loc2]
    }
  end
end

end # module Motel
