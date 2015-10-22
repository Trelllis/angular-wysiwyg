(function() {
  'use strict';

  angular.module('wysiwyg.module')
    .factory('socialEmbeds', socialEmbeds);

  function socialEmbeds($http){
    return{
      getInstagramEmbed: getInstagramEmbed,
      getTwitterEmbed: getTwitterEmbed
    }

    function getInstagramEmbed(url){
      return $http.jsonp('http://api.instagram.com/oembed?url=' + url + '&omitscript=true&callback=JSON_CALLBACK')
            .then(function(response){
              return response.data;
            });
    }

    function getTwitterEmbed(url){
      return $http.jsonp('https://api.twitter.com/1/statuses/oembed.json?url=' + url + '&omit_script=true&lang=ar&callback=JSON_CALLBACK')
              .then(function (response) {
                return response.data;
              });
    }
  }

})();
