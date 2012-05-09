# Motel remote location tracking operations
#
# Copyright (C) 2012 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

# TODO provide mechanism which to create necessary permissions
#      to invoke operations on remote queue

require 'thread'

module Motel

class RemoteLocationManager
  def initialize
    @nodes = {}
    @lock  = Mutex.new
  end

  def remote_node_for(queue)
    unless @nodes.has_key?(queue)
      # FIXME lookup which broker is running queue & user credentials to use
      #       (intially via config file, but later via service)
      broker = 'localhost'
      user = Users::User.new :id => 'rlm', :password => 'mlr'

      node_id = Motel.gen_uuid
      @nodes[queue] = RJR::AMQPNode.new :broker => broker, :node_id => "motel-remote-#{node_id}"
      #@nodes[queue].listen

      # TODO incorporate a rjr timeout?
      session = @nodes[queue].invoke_request(queue, 'users::login', user)
      @nodes[queue].message_headers['session_id'] = session.id
    end

    @nodes[queue]
  end

  def get_location(location)
    @lock.synchronize{
      node = remote_node_for(location.remote_queue)
      return node.invoke_request(location.remote_queue, 'get_location', location.id)
    }
  end

  def create_location(location)
    @lock.synchronize{
      trq = location.remote_queue
      location.remote_queue = nil

      node = remote_node_for(trq)
      node.invoke_request(trq, 'create_location', location)

      location.remote_queue = trq
    }
  end

  def update_location(location)
    @lock.synchronize{
      trq = location.remote_queue
      location.remote_queue = nil

      node = remote_node_for(trq)
      node.invoke_request(trq, 'update_location', location)

      location.remote_queue = trq
    }
  end

  def track_movement
  end

  def track_proximity
  end

end
end