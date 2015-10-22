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
        ['link', 'images'],
        ['instagram', 'twitter', 'youtube', 'facebook']
    ];


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
