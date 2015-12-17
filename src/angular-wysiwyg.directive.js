(function() {
    'use strict';
    angular.module('wysiwyg.module')
        .directive('wysiwyg', wysiwyg);

    wysiwyg.$inject = ['$timeout', 'wysiwgGui', '$compile', 'socialEmbeds']

    function wysiwyg($timeout, wysiwgGui, $compile, socialEmbeds) {
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

                textarea.on('input keyup mouseup focus', function(event) {
                    var html = textarea.html();
                    if (html == '' || html == '<br>') {
                        var div = document.createElement("div");
                        div.innerHTML = "<br>";
                        textarea[0].appendChild(div);
                    }
                    ngModelController.$setViewValue(html);
                });

                textarea.on('paste', 'div', function(event) {
                    $timeout(function() {
                        var sel, range;
                        sel = window.getSelection();
                        range = sel.getRangeAt(0);
                        range.setStartAfter(event.currentTarget);
                        normalize(event.currentTarget, range);
                        event.currentTarget.innerHTML = '';
                    }, 200);
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

                var inputElement = document.getElementById("imagesInput");
                var root = inputElement.createShadowRoot();

                root.innerHTML = "<button tabindex='-1'>Images</button>";
                inputElement.addEventListener("change", insertFigure, false);

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

            function insertFigure() {

                if (this.files && this.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function(e) {

                        var figure = document.createElement('figure');

                        var figureCaption = document.createElement('figcaption');

                        figureCaption.innerText = "Image Caption";
                        figureCaption.addEventListener('click', function() {
                            var caption = prompt("Enter Image Caption", this.innerText);
                            this.innerText = caption || "image Caption";
                            this.parentNode.firstChild.setAttribute('data-caption', this.innerText);
                            this.parentNode.firstChild.setAttribute('alt', this.innerText);
                        });

                        var fiqureCredits = document.createElement('span');
                        fiqureCredits.innerText = "Image credits";
                        fiqureCredits.addEventListener('click', function() {
                            var credits = prompt("Enter Image Credits", this.innerText);
                            this.innerText = credits || "Image credits";
                            this.parentNode.firstChild.setAttribute('data-credits', this.innerText);
                        });


                        var image = document.createElement('img');
                        image.setAttribute('src', e.target.result);

                        figure.appendChild(image);
                        figure.appendChild(figureCaption);
                        figure.appendChild(fiqureCredits);

                        var sel, range;
                        sel = window.getSelection();

                        if (sel.getRangeAt && sel.rangeCount) {

                            range = sel.getRangeAt(0);
                            range.insertNode(figure);

                            if (figure.parentNode.getAttribute('id') === "question") {
                                figure.contentEditable = false;
                            } else {
                                figure.parentNode.contentEditable = "false";
                            }

                            if (figure) {
                                range = range.cloneRange();
                                range.setStartAfter(figure.parentNode);
                                range.collapse(true);
                                var ell = document.createElement('div');
                                ell.innerHTML = "<br>";
                                range.insertNode(ell);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            }

            scope.insertInstagram = function() {

                var sel, range;
                sel = window.getSelection();

                range = sel.getRangeAt(0);

                swal({
                    title: "Instagram Embed",
                    text: "Enter an Instagram URL:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Instagram Url",
                    showLoaderOnConfirm: true
                }, function(instagramUrl) {

                    if (instagramUrl === false) return false;

                    if (instagramUrl === '' || instagramUrl === null || instagramUrl.indexOf('instagram') === -1) {
                        swal.showInputError('Enter a valid Instagram Url');
                        return false;
                    }

                    scope.$emit('embed-instagram:start');

                    var el = document.createElement('div');
                    el.classList.add('instagram_embed_wrapper');
                    el.setAttribute('data-link', instagramUrl);

                    socialEmbeds.getInstagramEmbed(instagramUrl)
                        .then(function(response) {

                            el.innerHTML = response.html;
                            range.insertNode(el);

                            if (el.parentNode.getAttribute('id') === "question") {
                                el.contentEditable = false;
                            } else {
                                el.parentNode.contentEditable = "false";
                            }

                            instgrm.Embeds.process();

                            if (el) {
                                range = range.cloneRange();
                                range.setStartAfter(el.parentNode);
                                range.collapse(true);
                                var ell = document.createElement('div');
                                ell.innerHTML = "<br>";
                                range.insertNode(ell);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }

                            swal.close();
                            scope.$emit('embed-instagram:finish');
                        });
                });
            }

            scope.insertTwitter = function() {

                var sel, range;
                sel = window.getSelection();
                range = sel.getRangeAt(0);

                swal({
                    title: "Twitter Embed",
                    text: "Enter a Tweet URL:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Tweet Url",
                    showLoaderOnConfirm: true
                }, function(twitterUrl) {

                    if (twitterUrl === false) return false;

                    if (twitterUrl === '' || twitterUrl === null || twitterUrl.indexOf('twitter') === -1) {
                        swal.showInputError('Enter a valid twitter Url');
                        return false;
                    }

                    scope.$emit('embed-twitter:start');

                    var el = document.createElement('div');
                    el.classList.add('twitter_embed_wrapper');
                    el.setAttribute('data-link', twitterUrl);

                    socialEmbeds.getTwitterEmbed(twitterUrl)
                        .then(function(response) {

                            el.innerHTML = response.html;
                            range.insertNode(el);

                            if (el.parentNode.getAttribute('id') === "question") {
                                el.contentEditable = false;
                            } else {
                                el.parentNode.contentEditable = "false";
                            }

                            if (el) {
                                range = range.cloneRange();
                                range.setStartAfter(el.parentNode);
                                range.collapse(true);
                                var ell = document.createElement('div');
                                ell.innerHTML = "<br>";
                                range.insertNode(ell);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }

                            swal.close();
                            scope.$emit('embed-twitter:finish');
                        });
                });
            }

            scope.insertYoutube = function() {

                var sel, range;
                sel = window.getSelection();
                range = sel.getRangeAt(0);

                swal({
                    title: "Youtube Embed",
                    text: "Enter a Youtube URL:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Youtube Url",
                    showLoaderOnConfirm: true
                }, function(youtubeUrl) {

                    if (youtubeUrl === false) return false;

                    if (youtubeUrl === "" && youtubeUrl === null && youtubeUrl.indexOf('youtube') === -1) {
                        swal.showInputError('Enter a valid twitter Url');
                        return false;
                    }

                    scope.$emit('embed-youtube:start');

                    var guid = youtubeUrl.match(/(\?|&)v=[^&]*/);

                    var el = document.createElement("div");
                    el.setAttribute('data-link', 'https://www.youtube.com/embed/' + guid[0].substring(3));
                    el.classList.add('youtube_player_wrapper');

                    el.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + guid[0].substring(3) + '" ' + 'frameborder="0" allowfullscreen></iframe>';
                    range.insertNode(el);

                    if (el.parentNode.getAttribute('id') === "question") {
                        el.contentEditable = false;
                    } else {
                        el.parentNode.contentEditable = "false";
                    }

                    $timeout(function() {
                        if (el) {
                            range = range.cloneRange();
                            range.setStartAfter(el.parentNode);
                            range.collapse(true);
                            var ell = document.createElement('div');
                            ell.innerHTML = "<br>";
                            range.insertNode(ell);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }, 500);

                    swal.close();
                    scope.$emit('embed-youtube:finish');
                });
            }

            scope.insertFacebook = function() {

                var sel, range;
                sel = window.getSelection();
                range = sel.getRangeAt(0);

                swal({
                    title: "Facebook Embed",
                    text: "Enter a Facebook URL:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Facebook Url",
                    showLoaderOnConfirm: true
                }, function(facebookUrl) {

                    if (facebookUrl === false) return false;

                    if (facebookUrl === "" && facebookUrl === null && facebookUrl.indexOf('facebook') === -1) {
                        swal.showInputError('Enter a valid twitter Url');
                        return false;
                    }

                    scope.$emit('embed-facebook:start');

                    var el = document.createElement("div");
                    el.setAttribute('data-link', facebookUrl);
                    el.classList.add('facebook_embed_wrapper');

                    el.innerHTML = '<div class="fb-post" data-href="' + facebookUrl + '"></div>';
                    range.insertNode(el);

                    if (el.parentNode.getAttribute('id') === "question") {
                        el.contentEditable = false;
                    } else {
                        el.parentNode.contentEditable = "false";
                    }

                    $timeout(function() {
                        window.FB.XFBML.parse();
                        if (el) {
                            range = range.cloneRange();
                            range.setStartAfter(el.parentNode);
                            range.collapse(true);
                            var ell = document.createElement("div");
                            ell.innerHTML = "<br>";
                            range.insertNode(ell);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }

                        swal.close();
                        scope.$emit('embed-facebook:finish');
                    }, 100);
                });
            }

            scope.format('enableobjectresizing', true);
            scope.format('styleWithCSS', true);

            function normalize(el, range) {
                var children = Array.prototype.slice.call(el.childNodes);
                children.forEach(function(element, index, array) {

                    if (element.childElementCount > 0) {
                        normalize(element, range)
                    } else {
                        var el = document.createElement('div');
                        el.innerHTML = element.textContent;
                        if (el.innerHTML !== '') {
                            range.insertNode(el);
                            range.setStartAfter(el);
                        }
                    }
                });
            }
        }
    };
})();
