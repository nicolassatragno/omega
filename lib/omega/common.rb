# Utility Methods
#
# Copyright (C) 2011-2013 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

class Object
  def numeric?
    self.kind_of?(Numeric)
  end

  def numeric_string?
    self.kind_of?(String) &&
    Float(self) != nil rescue false
  end

  def attr_from_args(args, params = {})
    params.keys.each { |p|
      getter = "#{p}".intern
      setter = "#{p}=".intern
      if args.has_key?(p)
        self.send(setter, args[p])

      elsif args.has_key?(p.to_s)
        self.send(setter, args[p.to_s])

      else
        v = self.send(getter)
        self.send(setter, v || params[p])

      end
    }
    # TODO raise error if args has key not in params ? (optional?)
  end

  def update_from(old, *attrs)
    attrs.each { |attr|
      getter = attr.intern
      setter = "#{attr}=".intern
      v  = old.send(:[], getter) if old.respond_to?(:[])
      v  = old.send(getter)      if old.respond_to?(getter)
      self.send(setter, v)       unless v.nil?
    }
  end

end

class Array
  def uniq_by(&blk)
    transforms = {}
    select do |el|
      t = blk[el]
      should_keep = !transforms[t]
      transforms[t] = true
      should_keep
    end
  end

  # select all elements with the specified properties (attributes)
  def pselect(properties={})
    self.select { |i|
      properties.keys.all? { |pk|
        i.send(pk) == properties[pk]
      }
    }
  end
end

class String
  def demodulize
    self.split('::').last
  end

  def modulize
    self.split('::')[0..-2].join('::')
  end
end

require 'enumerator'
class Module
  def subclasses
    ObjectSpace.to_enum(:each_object, Module).select do |m|
      m.ancestors.include?(self)
    end
  end
end
