# include all motel modules
#
# Copyright (C) 2010 Mohammed Morsi <movitto@yahoo.com>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

lib = File.dirname(__FILE__)
$: << lib + '/motel/'

require lib + '/motel/exceptions'
require lib + '/motel/callbacks'
require lib + '/motel/runner'
require lib + '/motel/remote_location_manager'
require lib + '/motel/rjr_adapter'

require lib + '/motel/location'
require lib + '/motel/movement_strategy'

Dir[lib + '/motel/movement_strategies/*.rb'].each { |model| require model }
