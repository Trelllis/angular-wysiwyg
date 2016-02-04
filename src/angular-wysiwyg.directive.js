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
                minImagesWidth: '@'
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
                    if (!textarea[0].childNodes[0] || textarea[0].childNodes[0].nodeName === "#text" || textarea[0].childNodes[0].nodeName === "BR") {
                        scope.format('formatBlock', '<div>');
                    }
                    ngModelController.$setViewValue(html);
                });

                textarea.on('paste', 'div', function(event) {
                    $timeout(function() {
                        addContent(event.currentTarget);
                    }, 200);
                });

                textarea.on('keyup', function(event) {

                    if (event.keyCode === 13) {
                        if (scope.cmdState('bold')) {
                            scope.format('bold');
                        }
                        if (scope.cmdState('underline')) {
                            scope.format('underline');
                        }
                    }
                });

                textarea.on('click keyup focus mouseup', function() {
                    // $timeout(function() {
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

                    // }, 0);
                });

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
                var vm = this;
                if (this.files && this.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        var image = document.createElement('img');
                        var fakeImage = document.createElement('img');
                        fakeImage.setAttribute('src', e.target.result);

                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');

                        fakeImage.onload = function() {

                            console.log(vm.files[0].type);
                            if (vm.files[0].type === 'image/gif') {
                                var minWidth = 250;
                            } else {
                                var minWidth = parseInt(scope.minImagesWidth, 10);
                            }

                            if (fakeImage.naturalWidth >= minWidth) {

                                var figure = document.createElement('figure');

                                var figureCaption = document.createElement('figcaption');

                                figureCaption.innerText = "Image Caption";
                                figureCaption.classList.add('remove_tag');
                                figureCaption.addEventListener('click', function() {
                                    var caption = prompt("Enter Image Caption", this.innerText);
                                    this.innerText = caption || "Image Caption";
                                    if (this.innerText !== 'Image Caption') {
                                        this.parentNode.firstChild.setAttribute('data-caption', this.innerText);
                                        this.parentNode.firstChild.setAttribute('alt', this.innerText);
                                        this.classList.remove('remove_tag');
                                    }
                                });

                                var fiqureCredits = document.createElement('span');
                                fiqureCredits.innerText = "Image Credits";
                                fiqureCredits.classList.add('remove_tag');

                                fiqureCredits.addEventListener('click', function() {
                                    var credits = prompt("Enter Image Credits", this.innerText);
                                    this.innerText = credits || "Image Credits";
                                    if (this.innerText !== 'Image Credits') {
                                        this.innerText = credits || "Image Credits";
                                        this.parentNode.firstChild.setAttribute('data-credits', this.innerText);
                                        this.classList.remove('remove_tag');
                                    }
                                });

                                figure.appendChild(fakeImage);

                                var sel, range;
                                sel = window.getSelection();

                                if (sel.getRangeAt && sel.rangeCount) {

                                    range = sel.getRangeAt(0);

                                    if (range.startContainer.nodeName !== 'DIV') {
                                        range.startContainer.parentNode.removeChild(range.startContainer);
                                    }


                                    range.startContainer.contentEditable = "false";
                                    range.startContainer.innerHTML = '';
                                    range.startContainer.appendChild(figure);


                                    if (vm.files[0].type !== 'image/gif') {

                                        canvas.width = fakeImage.naturalWidth;
                                        canvas.height = fakeImage.naturalHeight;

                                        context.drawImage(this, 0, 0);
                                        resample_hermite(canvas, fakeImage.naturalWidth, fakeImage.naturalHeight, fakeImage.width, fakeImage.height);

                                        var dataURL = canvas.toDataURL("image/jpeg", 0.8);
                                        image.setAttribute('src', dataURL);

                                        range.startContainer.firstChild.innerHTML = ''
                                        figure.appendChild(image);

                                    }

                                    figure.appendChild(figureCaption);
                                    figure.appendChild(fiqureCredits);

                                    range.startContainer.insertAdjacentHTML('afterend', '<div><br></div>');
                                    range.setStartAfter(range.startContainer);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                }

                                vm.value = '';
                            } else {
                                scope.$emit('editor-error', {
                                    error: 'Image should be at least ' + minWidth + 'px wide'
                                });
                            }
                        }
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            }


            function resample_hermite(canvas, W, H, W2, H2) {
                var time1 = Date.now();
                W2 = Math.round(W2);
                H2 = Math.round(H2);
                var img = canvas.getContext("2d").getImageData(0, 0, W, H);
                var img2 = canvas.getContext("2d").getImageData(0, 0, W2, H2);
                var data = img.data;
                var data2 = img2.data;
                var ratio_w = W / W2;
                var ratio_h = H / H2;
                var ratio_w_half = Math.ceil(ratio_w / 2);
                var ratio_h_half = Math.ceil(ratio_h / 2);

                for (var j = 0; j < H2; j++) {
                    for (var i = 0; i < W2; i++) {
                        var x2 = (i + j * W2) * 4;
                        var weight = 0;
                        var weights = 0;
                        var weights_alpha = 0;
                        var gx_r = 0;
                        var gx_g = 0;
                        var gx_b = 0;
                        var gx_a = 0;
                        var center_y = (j + 0.5) * ratio_h;
                        for (var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++) {
                            var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                            var center_x = (i + 0.5) * ratio_w;
                            var w0 = dy * dy //pre-calc part of w
                            for (var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++) {
                                var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                                var w = Math.sqrt(w0 + dx * dx);
                                if (w >= -1 && w <= 1) {
                                    //hermite filter
                                    weight = 2 * w * w * w - 3 * w * w + 1;
                                    if (weight > 0) {
                                        dx = 4 * (xx + yy * W);
                                        //alpha
                                        gx_a += weight * data[dx + 3];
                                        weights_alpha += weight;
                                        //colors
                                        if (data[dx + 3] < 255)
                                            weight = weight * data[dx + 3] / 250;
                                        gx_r += weight * data[dx];
                                        gx_g += weight * data[dx + 1];
                                        gx_b += weight * data[dx + 2];
                                        weights += weight;
                                    }
                                }
                            }
                        }
                        data2[x2] = gx_r / weights;
                        data2[x2 + 1] = gx_g / weights;
                        data2[x2 + 2] = gx_b / weights;
                        data2[x2 + 3] = gx_a / weights_alpha;
                    }
                }
                console.log("hermite = " + (Math.round(Date.now() - time1) / 1000) + " s");
                canvas.getContext("2d").clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
                canvas.width = W2;
                canvas.height = H2;
                canvas.getContext("2d").putImageData(img2, 0, 0);
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

                    var trimedUrl = instagramUrl.trim();


                    if (trimedUrl === '' || trimedUrl === null || trimedUrl.indexOf('instagram') === -1) {
                        swal.showInputError('Enter a valid Instagram Url');
                        return false;
                    }

                    scope.$emit('embed-instagram:start');

                    var el = document.createElement('div');
                    el.classList.add('instagram_embed_wrapper');
                    el.setAttribute('data-link', trimedUrl);

                    socialEmbeds.getInstagramEmbed(trimedUrl)
                        .then(function(response) {

                            el.innerHTML = response.html;

                            console.log(range);
                            if (range.startContainer.nodeName !== 'DIV') {
                                range.startContainer.parentNode.removeChild(range.startContainer);
                            }

                            range.startContainer.contentEditable = "false";
                            range.startContainer.innerHTML = '';
                            range.startContainer.appendChild(el);
                            range.startContainer.insertAdjacentHTML('afterend', '<div><br></div>');
                            range.setStartAfter(range.startContainer);
                            sel.removeAllRanges();
                            sel.addRange(range);

                            instgrm.Embeds.process();

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
                    if (trimedUrl === false) return false;

                    var trimedUrl = twitterUrl.trim();

                    if (trimedUrl === '' || trimedUrl === null || trimedUrl.indexOf('twitter') === -1) {
                        swal.showInputError('Enter a valid twitter Url');
                        return false;
                    }

                    scope.$emit('embed-twitter:start');

                    var el = document.createElement('div');
                    el.classList.add('twitter_embed_wrapper');
                    el.setAttribute('data-link', trimedUrl);

                    socialEmbeds.getTwitterEmbed(trimedUrl)
                        .then(function(response) {

                            el.innerHTML = response.html;

                            if (range.startContainer.nodeName !== 'DIV') {
                                range.startContainer.parentNode.removeChild(range.startContainer);
                            }
                            range.startContainer.contentEditable = "false";
                            range.startContainer.innerHTML = '';
                            range.startContainer.appendChild(el);
                            range.startContainer.insertAdjacentHTML('afterend', '<div><br></div>');
                            range.setStartAfter(range.startContainer);
                            sel.removeAllRanges();
                            sel.addRange(range);

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

                    if (trimedUrl === false) return false;

                    var trimedUrl = youtubeUrl.trim();

                    if (trimedUrl === "" && trimedUrl === null && trimedUrl.indexOf('youtu') === -1) {
                        swal.showInputError('Enter a valid twitter Url');
                        return false;
                    }

                    scope.$emit('embed-youtube:start');

                    var guid = trimedUrl.match(/(\?|&)v=[^&]*/);

                    var el = document.createElement("div");
                    el.setAttribute('data-link', 'https://www.youtube.com/embed/' + guid[0].substring(3));
                    el.classList.add('youtube_player_wrapper');

                    el.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + guid[0].substring(3) + '" ' + 'frameborder="0" allowfullscreen></iframe>';

                    if (range.startContainer.nodeName !== 'DIV') {
                        range.startContainer.parentNode.removeChild(range.startContainer);
                    }

                    range.startContainer.contentEditable = "false";
                    range.startContainer.innerHTML = '';
                    range.startContainer.appendChild(el);
                    range.startContainer.insertAdjacentHTML('afterend', '<div><br></div>');
                    range.setStartAfter(range.startContainer);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    swal.close();
                    scope.$emit('embed-youtube:finish');
                });
            }

            scope.insertFacebook = function() {

                var sel, range;
                sel = window.getSelection();
                range = sel.getRangeAt(0);

                swal({
                    title: "Facebook Post Embed",
                    text: "Enter a Facebook URL:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Facebook Url",
                    showLoaderOnConfirm: true
                }, function(facebookUrl) {
                    if (trimedUrl === false) return false;

                    var trimedUrl = facebookUrl.trim();

                    if (trimedUrl === "" && trimedUrl === null && trimedUrl.indexOf('facebook') === -1) {
                        swal.showInputError('Enter a valid twitter Url');
                        return false;
                    }

                    scope.$emit('embed-facebook:start');

                    var el = document.createElement("div");
                    el.setAttribute('data-link', trimedUrl);
                    el.classList.add('facebook_embed_wrapper');

                    el.innerHTML = '<div class="fb-post" data-href="' + trimedUrl + '"></div>';

                    if (range.startContainer.nodeName !== 'DIV') {
                        range.startContainer.parentNode.removeChild(range.startContainer);
                    }
                    range.startContainer.contentEditable = "false";
                    range.startContainer.innerHTML = '';
                    range.startContainer.appendChild(el);
                    range.startContainer.insertAdjacentHTML('afterend', '<div><br></div>');
                    range.setStartAfter(range.startContainer);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    window.FB.XFBML.parse();

                    swal.close();
                    scope.$emit('embed-facebook:finish');

                });
            }

            scope.insertFacebookVideo = function() {

                var sel, range;
                sel = window.getSelection();
                range = sel.getRangeAt(0);

                swal({
                    title: "Facebook Video Embed",
                    text: "Enter a Facebook URL:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Facebook Url",
                    showLoaderOnConfirm: true
                }, function(facebookUrl) {

                    if (trimedUrl === false) return false;

                    var trimedUrl = facebookUrl.trim();

                    if (trimedUrl === "" && trimedUrl === null && trimedUrl.indexOf('facebook') === -1) {
                        swal.showInputError('Enter a valid twitter Url');
                        return false;
                    }

                    scope.$emit('embed-facebook:start');

                    var el = document.createElement("div");
                    el.setAttribute('data-link', trimedUrl);
                    el.classList.add('facebook_video_embed_wrapper');

                    el.innerHTML = '<div class="fb-video" data-href="' + trimedUrl + '" data-allowfullscreen="true"></div>';

                    if (range.startContainer.nodeName !== 'DIV') {
                        range.startContainer.parentNode.removeChild(range.startContainer);
                    }
                    range.startContainer.contentEditable = "false";
                    range.startContainer.innerHTML = '';
                    range.startContainer.appendChild(el);
                    range.startContainer.insertAdjacentHTML('afterend', '<div><br></div>');
                    range.setStartAfter(range.startContainer);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    window.FB.XFBML.parse();
                    swal.close();
                    scope.$emit('embed-facebook:finish');
                });
            }

            scope.format('enableobjectresizing', true);
            scope.format('styleWithCSS', false);

            function addContent(el, range) {

                var elArray = el.outerText.replace(/\n/g, "###").split("###");
                el.parentNode.removeChild(el);
                var sel, range;
                sel = window.getSelection();
                range = sel.getRangeAt(0);
                elArray.forEach(function(element, index, array) {
                    if (element.length > 1) {
                        var newElement = document.createElement('div');
                        newElement.innerHTML = element.trim();
                        range.insertNode(newElement);
                        range.setStartAfter(newElement);

                        if (element.indexOf('instagram') !== -1) {
                            var el = document.createElement('div');
                            el.classList.add('instagram_embed_wrapper');
                            el.setAttribute('data-link', element);

                            socialEmbeds.getInstagramEmbed(newElement.innerHTML)
                                .then(function(response) {
                                    el.innerHTML = response.html;
                                    console.log(el);
                                    newElement.innerHTML = '';
                                    newElement.contentEditable = 'false';
                                    newElement.appendChild(el);
                                    newElement.insertAdjacentHTML('afterend', '<div><br></div>');
                                    instgrm.Embeds.process();

                                    scope.$emit('embed-instagram:finish');
                                });
                        }


                        if (element.indexOf('twitter') !== -1) {

                            var el = document.createElement('div');
                            el.classList.add('twitter_embed_wrapper');
                            el.setAttribute('data-link', element);

                            socialEmbeds.getTwitterEmbed(newElement.innerHTML)
                                .then(function(response) {

                                    el.innerHTML = response.html;
                                    console.log(el);
                                    newElement.innerHTML = '';
                                    newElement.contentEditable = 'false';
                                    newElement.appendChild(el);
                                    newElement.insertAdjacentHTML('afterend', '<div><br></div>');

                                    scope.$emit('embed-twitter:finish');
                                });
                        }

                        if (element.indexOf('youtube') !== -1) {
                            var el = document.createElement('div');
                            el.classList.add('youtube_embed_wrapper');
                            el.setAttribute('data-link', element);

                            var guid = element.match(/(\?|&)v=[^&]*/);

                            var el = document.createElement("div");
                            el.setAttribute('data-link', 'https://www.youtube.com/embed/' + guid[0].substring(3));
                            el.classList.add('youtube_player_wrapper');

                            el.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + guid[0].substring(3) + '" ' + 'frameborder="0" allowfullscreen></iframe>';
                            $timeout(function(){
                                newElement.innerHTML = '';
                                newElement.contentEditable = 'false';
                                newElement.appendChild(el);
                                newElement.insertAdjacentHTML('afterend', '<div><br></div>');
                            }, 500);
                        }


                        if (element.indexOf('facebook') !== -1) {

                            var el = document.createElement("div");
                            el.classList.add('facebook_video_embed_wrapper');
                            el.setAttribute('data-link', element);

                            if (element.indexOf('video') !== -1) {
                                el.innerHTML = '<div class="fb-video" data-href="' + element + '" data-allowfullscreen="true"></div>';
                            } else {
                                el.innerHTML = '<div class="fb-post" data-href="' + element + '"></div>';
                            }

                            $timeout(function() {
                                newElement.innerHTML = '';
                                newElement.contentEditable = 'false';
                                newElement.appendChild(el);
                                newElement.insertAdjacentHTML('afterend', '<div><br></div>');
                                scope.$emit('embed-facebook:finish');
                                window.FB.XFBML.parse();
                            }, 500);

                        }

                    }
                });
                sel.removeAllRanges();
                sel.addRange(range);
            }

            function normalize(el, range) {
                var children = Array.prototype.slice.call(el.childNodes);
                children.forEach(function(element, index, array) {

                    if (element.nodeName !== '#comment' && element.nodeName !== '#text') {
                        if (element.childElementCount > 1) {
                            normalize(element, range)
                        } else {
                            var newElement = document.createElement('div');
                            console.dir(element);
                            newElement.innerHTML = element.textContent.trim();
                            if (newElement.innerHTML !== '') {
                                range.insertNode(newElement);
                                range.setStartAfter(newElement);
                            }
                        }
                    }
                });
                el.parentNode.removeChild(el);
            }
        }
    };
})();
