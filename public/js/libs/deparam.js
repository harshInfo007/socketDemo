(function(){
  
  // Values are not coerced.
  var params = $.deparam.querystring();
  
  debug.log( 'not coerced', params );
  $('#deparam_string').text( JSON.stringify( params, null, 2 ) );
  
  // Values are coerced.
  params = $.deparam.querystring( true );
  
  debug.log( 'coerced', params );
  $('#deparam_coerced').text( JSON.stringify( params, null, 2 ) );
  
  // Highlight the current sample query string link
  var qs = $.param.querystring();
  
  $('li a').each(function(){
    if ( $(this).attr( 'href' ) === '?' + qs ) {
      $(this).addClass( 'current' );
    }
  });
  
});