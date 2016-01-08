(function() {

  'use strict';

  angular.module('wysiwyg.module')
  .value('wysiwgGuiElements', {
    'bold': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Bold'
      }, {
        name: 'ng-click',
        value: 'format(\'bold\')'
      }, {
        name: 'ng-class',
        value: '{ active: isBold }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-bold'
      }]
    },
    'italic': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Italic'
      }, {
        name: 'ng-click',
        value: 'format(\'italic\')'
      }, {
        name: 'ng-class',
        value: '{ active: isItalic }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-italic'
      }]
    },
    'underline': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Underline'
      }, {
        name: 'ng-click',
        value: 'format(\'underline\')'
      }, {
        name: 'ng-class',
        value: '{ active: isUnderlined }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-underline'
      }]
    },
    'strikethrough': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Strikethrough'
      }, {
        name: 'ng-click',
        value: 'format(\'strikethrough\')'
      }, {
        name: 'ng-class',
        value: '{ active: isStrikethrough }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-strikethrough'
      }]
    },
    'subscript': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Subscript'
      }, {
        name: 'ng-click',
        value: 'format(\'subscript\')'
      }, {
        name: 'ng-class',
        value: '{ active: isSubscript }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-subscript'
      }]
    },
    'superscript': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Superscript'
      }, {
        name: 'ng-click',
        value: 'format(\'superscript\')'
      }, {
        name: 'ng-class',
        value: '{ active: isSuperscript }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-superscript'
      }]
    },
    'remove-format': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Remove Formatting'
      }, {
        name: 'ng-click',
        value: 'format(\'removeFormat\')'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-eraser'
      }]
    },
    'ordered-list': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Ordered List'
      }, {
        name: 'ng-click',
        value: 'format(\'insertorderedlist\')'
      }, {
        name: 'ng-class',
        value: '{ active: isOrderedList }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-list-ol'
      }]
    },
    'unordered-list': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Unordered List'
      }, {
        name: 'ng-click',
        value: 'format(\'insertunorderedlist\')'
      }, {
        name: 'ng-class',
        value: '{ active: isUnorderedList }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-list-ul'
      }]
    },
    'outdent': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Outdent'
      }, {
        name: 'ng-click',
        value: 'format(\'outdent\')'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-outdent'
      }]
    },
    'indent': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Indent'
      }, {
        name: 'ng-click',
        value: 'format(\'indent\')'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-indent'
      }]
    },
    'left-justify': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Left Justify'
      }, {
        name: 'ng-click',
        value: 'format(\'justifyleft\')'
      }, {
        name: 'ng-class',
        value: '{ active: isLeftJustified }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-align-left'
      }]
    },
    'center-justify': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Center Justify'
      }, {
        name: 'ng-click',
        value: 'format(\'justifycenter\')'
      }, {
        name: 'ng-class',
        value: '{ active: isCenterJustified }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-align-center'
      }]
    },
    'right-justify': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Right Justify'
      }, {
        name: 'ng-click',
        value: 'format(\'justifyright\')'
      }, {
        name: 'ng-class',
        value: '{ active: isRightJustified }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-align-right'
      }]
    },
    'code': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Code'
      }, {
        name: 'ng-click',
        value: 'format(\'formatblock\', \'pre\')'
      }, {
        name: 'ng-class',
        value: '{ active: isPre }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-code'
      }]
    },
    'quote': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Quote'
      }, {
        name: 'ng-click',
        value: 'format(\'formatblock\', \'blockquote\')'
      }, {
        name: 'ng-class',
        value: '{ active: isBlockquote }'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-quote-right'
      }]
    },
    'paragraph': {
      tag: 'button',
      classes: 'btn btn-default',
      text: 'P',
      attributes: [{
        name: 'title',
        value: 'Paragragh'
      }, {
        name: 'ng-click',
        value: 'format(\'insertParagraph\')'
      }, {
        name: 'ng-class',
        value: '{ active: isParagraph }'
      }, {
        name: 'type',
        value: 'button'
      }]
    },
    'image': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Image'
      }, {
        name: 'ng-click',
        value: 'insertImage()'
      }, {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-picture-o'
      }]
    },
    'font-color': {
      tag: 'button',
      classes: 'btn btn-default wysiwyg-colorpicker wysiwyg-fontcolor',
      text: 'A',
      attributes: [{
        name: 'title',
        value: 'Font Color'
      }, {
        name: 'colorpicker',
        value: 'rgba'
      }, {
        name: 'colorpicker-position',
        value: 'top'
      }, {
        name: 'ng-model',
        value: 'fontColor'
      }, {
        name: 'ng-change',
        value: 'setFontColor()'
      }, {
        name: 'type',
        value: 'button'
      }]
    },
    'hilite-color': {
      tag: 'button',
      classes: 'btn btn-default wysiwyg-colorpicker wysiwyg-fontcolor',
      text: 'H',
      attributes: [{
        name: 'title',
        value: 'Hilite Color'
      }, {
        name: 'colorpicker',
        value: 'rgba'
      }, {
        name: 'colorpicker-position',
        value: 'top'
      }, {
        name: 'ng-model',
        value: 'hiliteColor'
      }, {
        name: 'ng-change',
        value: 'setHiliteColor()'
      }, {
        name: 'type',
        value: 'button'
      }]
    },
    'font': {
      tag: 'select',
      classes: 'form-control wysiwyg-select',
      attributes: [{
        name: 'title',
        value: 'Image'
      }, {
        name: 'ng-model',
        value: 'font'
      }, {
        name: 'ng-options',
        value: 'f for f in fonts'
      }, {
        name: 'ng-change',
        value: 'setFont()'
      }]
    },
    'images': {
      tag: 'input',
      classes: 'images-upload-file',
      attributes: [{
        name: 'title',
        value: '',
      },{
        name: 'type',
        value: 'file'
      },{
        name: 'id',
        value: 'imagesInput'
      }]
    },
    'font-size': {
      tag: 'select',
      classes: 'form-control wysiwyg-select',
      attributes: [{
        name: 'title',
        value: 'Image'
      }, {
        name: 'ng-model',
        value: 'fontSize'
      }, {
        name: 'ng-options',
        value: 'f.size for f in fontSizes'
      }, {
        name: 'ng-change',
        value: 'setFontSize()'
      }]
    },
    'format-block': {
      tag: 'select',
      classes: 'form-control wysiwyg-select',
      attributes: [{
        name: 'title',
        value: 'Format Block'
      }, {
        name: 'ng-model',
        value: 'formatBlock'
      }, {
        name: 'ng-options',
        value: 'f.name for f in formatBlocks'
      }, {
        name: 'ng-change',
        value: 'setFormatBlock()'
      }]
    },
    'link': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Link'
      }, {
        name: 'ng-click',
        value: 'createLink()'
      },
      // {
      //   name: 'ng-show',
      //   value: '!isLink'
      // },
      {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-link'
      }]
    },
    'unlink': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Unlink'
      }, {
        name: 'ng-click',
        value: 'format(\'unlink\')'
      },
      //  {
      //   name: 'ng-show',
      //   value: 'isLink'
      // },
      {
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-unlink'
      }]
    },
    'instagram': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes:[{
        name: 'title',
        value: 'Instagram'
      },{
        name: 'ng-click',
        value: 'insertInstagram()'
      },{
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-instagram'
      }]
    },
    'twitter': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes:[{
        name: 'title',
        value: 'Twitter'
      },{
        name: 'ng-click',
        value: 'insertTwitter()'
      },{
        name: 'type',
        value: 'button'
      }],
      data: [{
        tag: 'i',
        classes: 'fa fa-twitter'
      }]
    },
    'youtube': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Youtube'
      }, {
          name: 'ng-click',
          value: 'insertYoutube()'
        }, {
          name: 'type',
          value: 'button'
        }],
      data: [{
        tag: 'i',
        classes: 'fa fa-youtube'
      }]
    },
    'facebook': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Facebook Post'
      }, {
          name: 'ng-click',
          value: 'insertFacebook()'
        }, {
          name: 'type',
          value: 'button'
        }],
      data: [{
        tag: 'i',
        classes: 'fa fa-facebook'
      }]
    },
    'facebook-video': {
      tag: 'button',
      classes: 'btn btn-default',
      attributes: [{
        name: 'title',
        value: 'Facebook Video'
      }, {
          name: 'ng-click',
          value: 'insertFacebookVideo()'
        }, {
          name: 'type',
          value: 'button'
        }],
      data: [{
        tag: 'i',
        classes: 'fa fa-video-camera'
      }]
    }
  });
})();
