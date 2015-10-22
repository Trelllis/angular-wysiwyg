(function() {
    'use strict';
    angular.module('wysiwyg.module')
        .directive('wysiwyg', function($timeout, wysiwgGui, $compile, socialEmbeds) {
            return {
                template: '<div>' +
                    '<div class="wysiwyg-menu"></div>' +
                    '<div id="{{textareaId}}" contentEditable="{{!disabled}}" class="{{textareaClass}} wysiwyg-textarea" rows="{{textareaRows}}" name="{{textareaName}}" required="{{textareaRequired}}" placeholder="{{textareaPlaceholder}}" ng-model="value"></div>' +
                    '</div>',
                restrict: 'E',
                scope: {
                    value: '=ngModel',
                    textareaName: '@textareaName',
                    textareaClass: '@textareaClass',
                    textareaRequired: '@textareaRequired',
                    textareaId: '@textareaId',
                    textareaMenu: '=textareaMenu',
                    textareaCustomMenu: '=textareaCustomMenu',
                    fn: '&',
                    disabled: '=?disabled',
                },
                replace: true,
                require: 'ngModel',
                link: link,
                transclude: true
            };

            function link(scope, element, attrs, ngModelController) {

                var textarea = element.find('div.wysiwyg-textarea');

                scope.isLink = false;

                // scope.fontSizes = [{
                //     value: '1',
                //     size: '10px'
                // }, {
                //     value: '2',
                //     size: '13px'
                // }, {
                //     value: '3',
                //     size: '16px'
                // }, {
                //     value: '4',
                //     size: '18px'
                // }, {
                //     value: '5',
                //     size: '24px'
                // }, {
                //     value: '6',
                //     size: '32px'
                // }, {
                //     value: '7',
                //     size: '48px'
                // }];
                // scope.fontSize = scope.fontSizes[1];

                // scope.fonts = [
                //     'Georgia',
                //     'Palatino Linotype',
                //     'Times New Roman',
                //     'Arial',
                //     'Helvetica',
                //     'Arial Black',
                //     'Comic Sans MS',
                //     'Impact',
                //     'Lucida Sans Unicode',
                //     'Tahoma',
                //     'Trebuchet MS',
                //     'Verdana',
                //     'Courier New',
                //     'Lucida Console',
                //     'Helvetica Neue'
                // ].sort();

                // scope.font = scope.fonts[6];

                scope.formatBlocks = [{
                    name: 'Heading Blocks',
                    value: 'div'
                }, {
                    name: 'Heading 1',
                    value: 'h1'
                }, {
                    name: 'Heading 2',
                    value: 'h2'
                }, {
                    name: 'Heading 3',
                    value: 'h3'
                }, {
                    name: 'Heading 4',
                    value: 'h4'
                }, {
                    name: 'Heading 5',
                    value: 'h5'
                }, {
                    name: 'Heading 6',
                    value: 'h6'
                }, ];
                scope.formatBlock = scope.formatBlocks[0];

                if (angular.isArray(scope.cssClasses)) {
                    scope.cssClasses.unshift('css');
                    scope.cssClass = scope.cssClasses[0];
                }

                init();

                function init() {
                    compileMenu();
                    configureDisabledWatch();
                    configureBootstrapTitle();
                    configureListeners();
                }

                function compileMenu() {
                    wysiwgGui.setCustomElements(scope.textareaCustomMenu);
                    var menuDiv = element.children('div.wysiwyg-menu')[0];
                    menuDiv.appendChild(wysiwgGui.createMenu(scope.textareaMenu));
                    $compile(menuDiv)(scope);
                }

                function configureDisabledWatch() {
                    scope.$watch('disabled', function(newValue) {
                        angular.element('div.wysiwyg-menu').find('button').each(function() {
                            angular.element(this).attr('disabled', newValue);
                        });
                        angular.element('div.wysiwyg-menu').find('select').each(function() {
                            angular.element(this).attr('disabled', newValue);
                        });
                    });
                }

                function configureBootstrapTitle() {
                    if (attrs.enableBootstrapTitle === 'true' && attrs.enableBootstrapTitle !== undefined) {
                        element.find('button[title]').tooltip({
                            container: 'body'
                        });
                    }
                }

                function insertTab(html, position) {
                    var begining = html.substr(0, position);
                    var end = html.substr(position);
                    return begining + '<span style="white-space:pre">    </span>' + end;
                }

                function configureListeners() {

                  //Send message to calling controller that a button has been clicked.
                  angular.element('.wysiwyg-menu').find('button').on('click', function() {
                      var title = angular.element(this);
                      scope.$emit('wysiwyg.click', title.attr('title') || title.attr('data-original-title'));
                  });

                  textarea.on('input keyup paste mouseup', function() {
                      var html = textarea.html();

                      if (html == '<br>') {
                          html = '';
                      }

                      ngModelController.$setViewValue(html);
                  });

                  textarea.on('keydown', function(event) {
                      if (event.keyCode == 9) {
                          var TAB_SPACES = 4;
                          var html = textarea.html();
                          var selection = window.getSelection();
                          var position = selection.anchorOffset;

                          event.preventDefault();
                          // html = insertTab(html, position);
                          // textarea.html(html);
                          // selection.collapse(textarea[0].firstChild, position + TAB_SPACES);
                      }
                  });

                    // textarea.on('click keyup focus mouseup', function() {
                    $timeout(function() {
                        scope.isBold = scope.cmdState('bold');
                        scope.isUnderlined = scope.cmdState('underline');
                        scope.isStrikethrough = scope.cmdState('strikethrough');
                        scope.isBlockquote = scope.cmdValue('formatblock') === 'blockquote';
                        scope.isOrderedList = scope.cmdState('insertorderedlist');
                        scope.isUnorderedList = scope.cmdState('insertunorderedlist');

                        scope.cmdValue('formatblock').toLowerCase();
                        scope.formatBlocks.forEach(function(v, k) {
                            if (scope.cmdValue('formatblock').toLowerCase() === v.value.toLowerCase()) {
                                scope.formatBlock = v;
                                return false;
                            }
                        });

                        // scope.isItalic = scope.cmdState('italic');
                        // scope.isSuperscript = itemIs('SUP'); //scope.cmdState('superscript');
                        // scope.isSubscript = itemIs('SUB'); //scope.cmdState('subscript');
                        // scope.isRightJustified = scope.cmdState('justifyright');
                        // scope.isLeftJustified = scope.cmdState('justifyleft');
                        // scope.isCenterJustified = scope.cmdState('justifycenter');
                        // scope.isPre = scope.cmdValue('formatblock') === 'pre';
                        // scope.fonts.forEach(function(v, k) { //works but kinda crappy.
                        //     if (scope.cmdValue('fontname').indexOf(v) > -1) {
                        //         scope.font = v;
                        //         return false;
                        //     }
                        // });

                        // scope.fontSizes.forEach(function(v, k) {
                        //     if (scope.cmdValue('fontsize') === v.value) {
                        //         scope.fontSize = v;
                        //         return false;
                        //     }
                        // });

                        // scope.hiliteColor = getHiliteColor();
                        // element.find('button.wysiwyg-hiliteColor').css('background-color', scope.hiliteColor);

                        // scope.fontColor = scope.cmdValue('forecolor');
                        // element.find('button.wysiwyg-fontcolor').css('color', scope.fontColor);

                        // scope.isLink = itemIs('A');

                    }, 0);
                    // });


                }

                //Used to detect things like A tags and others that dont work with cmdValue().
                function itemIs(tag) {
                    var selection = window.getSelection().getRangeAt(0);
                    if (selection) {
                        if (selection.startContainer.parentNode.tagName === tag.toUpperCase() || selection.endContainer.parentNode.tagName === tag.toUpperCase()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                //Used to detect things like A tags and others that dont work with cmdValue().
                function getHiliteColor() {
                    var selection = window.getSelection().getRangeAt(0);
                    if (selection) {
                        var style = angular.element(selection.startContainer.parentNode).attr('style');

                        if (!angular.isDefined(style))
                            return false;

                        var a = style.split(';');
                        for (var i = 0; i < a.length; i++) {
                            var s = a[i].split(':');
                            if (s[0] === 'background-color')
                                return s[1];
                        }
                        return '#fff';
                    } else {
                        return '#fff';
                    }
                }

                // model -> view
                ngModelController.$render = function() {
                    textarea.html(ngModelController.$viewValue);
                };

                scope.format = function(cmd, arg) {
                    document.execCommand(cmd, false, arg);
                };

                scope.cmdState = function(cmd) {
                    return document.queryCommandState(cmd);
                };

                scope.cmdValue = function(cmd) {
                    return document.queryCommandValue(cmd);
                };

                scope.createLink = function() {
                    var input = prompt('Enter the link URL');
                    if (input && input !== undefined)
                        scope.format('createlink', input);
                };

                scope.insertImage = function() {
                    var input = prompt('Enter the image URL');
                    if (input && input !== undefined)
                        scope.format('insertimage', input);
                };

                // scope.setFont = function() {
                //     scope.format('fontname', scope.font);
                // };

                // scope.setFontSize = function() {
                //     scope.format('fontsize', scope.fontSize.value);
                // };

                scope.setFormatBlock = function() {
                    scope.format('formatBlock', scope.formatBlock.value);
                };

                // scope.setFontColor = function() {
                //     scope.format('forecolor', scope.fontColor);
                // };

                // scope.setHiliteColor = function() {
                //     scope.format('hiliteColor', scope.hiliteColor);
                // };

                scope.format('enableobjectresizing', true);
                scope.format('styleWithCSS', true);
            }
        });
})();
