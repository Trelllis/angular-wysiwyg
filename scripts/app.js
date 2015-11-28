var app = angular.module('app', ['colorpicker.module', 'wysiwyg.module'])

app.controller('MyCtrl', function($scope) {
    $scope.data = {
        text: "hello"
    }

    $scope.disabled = false;

    $scope.menu = [
        ['bold', 'underline'],
        ['format-block'],
        ['remove-format'],
        ['ordered-list', 'unordered-list'],
        ['left-justify', 'center-justify', 'right-justify'],
        ['quote'],
        ['link'],
        ['images'],
        ['instagram', 'twitter', 'youtube', 'facebook']
    ];


    console.log('honeh');
    $scope.$on('embed-instagram:start', function(){
        console.log('instagram start');
    });

    $scope.$on('embed-instagram:finish', function() {
      console.log('instagram finish');
    });

    $scope.$on('embed-twitter:start', function(){
        console.log('twitter start');
    });


    $scope.$on('embed-twitter:finish', function(){
        console.log('tiwtter finish');
    });


    $scope.$on('embed-youtube:start', function(){
        console.log('youtube start');
    });


    $scope.$on('embed-youtube:finish', function(){
        console.log('youtube finish');
    });

    $scope.$on('embed-facebook:start', function(){
      console.log('facebook start');
    });

    $scope.$on('embed-facebook:finish', function(){
      console.log('facebook finish')
    });


    $scope.sendData = function () {
      console.log($scope.data.text);
      var z = [];
      var t = document.getElementById("question").childNodes;
      console.log(t);
      var div_array = Array.prototype.slice.call(t);
      div_array.forEach(function(element, index, array){
        var el = element.outerHTML || element.textContent;
          z.push(el);
      });

      console.log(z);
    }
});
