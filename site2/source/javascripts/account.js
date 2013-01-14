/* accounts page
 *
 * Copyright (C) 2012 Mohammed Morsi <mo@morsi.org>
 *  Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt
 */

require('javascripts/vendor/utf8_encode.js');
require('javascripts/vendor/md5.js');
require('javascripts/omega/client.js');
require('javascripts/omega/user.js');
require('javascripts/omega/entity.js');
require('javascripts/omega/commands.js');

$(document).ready(function(){ 
  // log all errors to the console
  $omega_node.add_error_handler(function(error_msg){
    console.log(error_msg);
  });

  $omega_session.on_session_validated(function(){
    var user = $omega_registry.get($user_id);

    //$('#account_info_last_login');
    $('#account_info_username input').attr('value', user.id);
    $('#account_info_email input').attr('value',    user.email);

    var gravatar_url = 'http://gravatar.com/avatar/' + md5(user.email) + '?s=175';
    $('#account_logo').html('<img src="'+gravatar_url+'" alt="gravatar" title="gravatar"></img>');

    OmegaQuery.entities_owned_by(user.id, function(entities){
      for(var entityI in entities){
        var entity = entities[entityI];
        if(entity.json_class == "Manufactured::Ship"){
          $('#account_info_ships').append(entity.id + ' ');
        }else if(entity.json_class == "Manufactured::Station"){
          $('#account_info_stations').append(entity.id + ' ');
        }
      }
    });
  });

  // update account info when button clicked
  $('#account_info_update').live('click', function(e){
      var user = $omega_registry.get($user_id);

      var pass1 = $('#user_password').attr('value');
      var pass2 = $('#user_confirm_password').attr('value');
      if(pass1 != pass2){
        alert("passwords do not match");
        return;
      }

      user.password = pass1;

      OmegaCommand.update_user.exec(user, function(user){
        alert("User " + user.id + " updated successfully");
      });

  });
});
