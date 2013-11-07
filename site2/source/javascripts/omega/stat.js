/* Omega Stat JS Representation
 *
 * Copyright (C) 2013 Mohammed Morsi <mo@morsi.org>
 *  Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt
 */

/* Omega StatResult
 */
Omega.Stat = function(parameters){
  $.extend(this, parameters);
}

Omega.Stat.prototype = {
  json_class : 'Stats::StatResult'
}
