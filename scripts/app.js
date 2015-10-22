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

    $scope.cssClasses = ['test1', 'test2'];

    $scope.setDisabled = function() {
        $scope.disabled = !$scope.disabled;
    }
})
