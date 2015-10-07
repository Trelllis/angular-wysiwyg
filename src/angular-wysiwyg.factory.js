(function() {
  'use strict';

    var DEFAULT_MENU = [
        ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
        ['format-block'],
        ['font'],
        ['font-size'],
        ['font-color', 'hilite-color'],
        ['remove-format'],
        ['ordered-list', 'unordered-list', 'outdent', 'indent'],
        ['left-justify', 'center-justify', 'right-justify'],
        ['code', 'quote', 'paragraph'],
        ['link', 'image']
    ];

  angular.module('wysiwyg.module')
  .factory('wysiwgGui', function(wysiwgGuiElements) {

    var ELEMENTS = wysiwgGuiElements;
    var custom = {};

    var setCustomElements = function(el) {
      custom = el;
    };

    var getMenuGroup = function() {
      return {
        tag: 'div',
        classes: 'btn-group btn-group-sm wysiwyg-btn-group-margin',
      };
    };

    var getMenuItem = function(item) {
      return ELEMENTS[item] || {};
    };

    var createMenu = function(menu) {

      angular.extend(ELEMENTS, custom);

                //Get the default menu or the passed in menu
                if (angular.isDefined(menu) && menu !== '') {
                    menu = menu; //stringToArray(menu)
                  } else {
                    menu = DEFAULT_MENU;
                  }

                //create div to add everything to.
                var startDiv = document.createElement('div');
                var el;

                for (var i = 0; i < menu.length; i++) {
                  var menuGroup = create(getMenuGroup());

                  for (var j = 0; j < menu[i].length; j++) {
                        //link has two functions link and unlink
                        if (menu[i][j] === 'link') {
                          el = create(getMenuItem('unlink'));
                          menuGroup.appendChild(el);
                        }

                        el = create(getMenuItem(menu[i][j]));
                        menuGroup.appendChild(el);
                      }

                      startDiv.appendChild(menuGroup);
                    }
                    return startDiv;
                  };


                  function create(obj) {
                    var el;
                    if (obj.tag) {
                      el = document.createElement(obj.tag);
                    } else if (obj.text) {
                      el = document.createElement('span');
                    } else {
                      console.log('cannot create this element.');
                      el = document.createElement('span');
                      return el;
                    }

                    if (obj.text && document.all) {
                      el.innerText = obj.text;
                    } else if (obj.text) {
                      el.textContent = obj.text;
                    }

                    if (obj.classes) {
                      el.className = obj.classes;
                    }

                    if (obj.html) {
                      el.innerHTML = obj.html;
                    }

                    if (obj.attributes && obj.attributes.length) {
                      for (var i in obj.attributes) {
                        var attr = obj.attributes[i];
                        if (attr.name && attr.value) {
                          el.setAttribute(attr.name, attr.value);
                        }
                      }
                    }

                    if (obj.data && obj.data.length) {
                      for (var item in obj.data) {
                        el.appendChild(create(obj.data[item]));
                      }
                    }

                    return el;
                  }

                  return {
                    createMenu: createMenu,
                    setCustomElements: setCustomElements
                  };

                });
})();
