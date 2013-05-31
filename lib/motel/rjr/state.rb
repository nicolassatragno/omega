# motel::save_state, motel::load_state,
# motel::status rjr definitions
#
# Copyright (C) 2013 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

include Omega::Server::DSL

# save state of motel subsystem
save_state = proc { |output|
  raise PermissionError, "invalid client" unless is_node?(RJR::Nodes::Local)
  File.open(output, 'a+') { |f| Registry.instance.save(f) }
}

# restore state of motel subsystem
restore_state = proc { |input|
  raise PermissionError, "invalid client" unless is_node?(RJR::Nodes::Local)
  File.open(input, 'r') { |f| Registry.instance.restore(f) }
}

# retrieve status of motel subsystem
motel_status = proc { ||
  # Retrieve the overall status of this node
  {
    :running       => Registry.instance.running?,
    :num_locations => Registry.instance.entities.size }
  }
}

def dispatch_state(dispatcher)
  dispatcher.handle "motel::save_state",    &save_state
  dispatcher.handle "motel::restore_state", &restore_state
  dispatcher.handle "motel::status",        &motel_status
end