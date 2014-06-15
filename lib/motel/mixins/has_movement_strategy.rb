# Motel HasMovementStrategy Mixin.
#
# Copyright (C) 2010-2014 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3 http://www.gnu.org/licenses/agpl.txt

require 'motel/movement_strategy'
require 'motel/movement_strategies/stopped'

module Motel

# Mixed into Location, provides movement strategy accessors and helpers
module HasMovementStrategy
  # [Motel::MovementStrategy] Movement strategy through which to move location
  attr_accessor :movement_strategy
  alias :ms :movement_strategy
  alias :ms= :movement_strategy=

  # Next movement strategy, optionally used to register
  # a movement strategy which to set next
  attr_accessor :next_movement_strategy

  # Return movement strategy attrs
  def movement_strategy_attrs
    [:movement_strategy, :next_movement_strategy]
  end

  # Initialize default movement strategy / movement strategy from arguments
  def movement_strategy_from_args(args)
    attr_from_args args,
      :movement_strategy      => MovementStrategies::Stopped.instance,
      :next_movement_strategy => nil
  end

  # true/false indicating if movement strategy is stopped
  def stopped?
    self.movement_strategy == Motel::MovementStrategies::Stopped.instance
  end

  # Return bool indicating if movement strategy is valid
  def movement_strategy_valid?
    @movement_strategy.kind_of?(MovementStrategy) && @movement_strategy.valid?
  end

  # Return movement strategy in json format
  def movement_strategy_json
    {:movement_strategy => movement_strategy,
     :next_movement_strategy => next_movement_strategy}
  end
end # module HasMovementStrategy
end # module Motel
