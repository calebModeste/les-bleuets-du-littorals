/**
 * @file
 * JavaScript behaviors for Select2 integration.
 */

(function ($, Drupal) {

  'use strict';

  // @see https://select2.github.io/options.html
  Drupal.webform = Drupal.webform || {};
  Drupal.webform.select2 = Drupal.webform.select2 || {};
  Drupal.webform.select2.options = Drupal.webform.select2.options || {};
  Drupal.webform.select2.options.width = Drupal.webform.select2.options.width || '100%';
  Drupal.webform.select2.options.widthInline = Drupal.webform.select2.options.widthInline || '50%';

  /**
   * Initialize Select2 support.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformSelect2 = {
    attach: function (context) {
      if (!$.fn.select2) {
        return;
      }

      $(context)
        .find('select.js-webform-select2, .js-webform-select2 select')
        .once('webform-select2')
        .each(function () {
          var $select = $(this);

          var options = {};
          if ($select.parents('.webform-element--title-inline').length) {
            options.width = Drupal.webform.select2.options.widthInline;
          }
          options = $.extend(options, Drupal.webform.select2.options);
          if ($select.data('placeholder')) {
            options.placeholder = $select.data('placeholder');
            if (!$select.prop('multiple')) {
              // Allow single option to be deselected.
              options.allowClear = true;
            }
          }
          if ($select.data('limit')) {
            options.maximumSelectionLength = $select.data('limit');
          }

          // Remove required attribute from IE11 which breaks
          // HTML5 clientside validation.
          // @see https://github.com/select2/select2/issues/5114
          if (window.navigator.userAgent.indexOf('Trident/') !== -1
            && $select.attr('multiple')
            && $select.attr('required')) {
            $select.removeAttr('required');
          }

          $select.select2(options);
        });

    }
  };

  /**
   * ISSUE:
   * Hiding/showing element via #states API cause select2 dropdown to appear in the wrong position.
   *
   * WORKAROUND:
   * Close (aka hide) select2 dropdown when #states API hides or shows an element.
   *
   * Steps to reproduce:
   * - Add custom 'Submit button(s)'
   * - Hide submit button
   * - Save
   * - Open 'Submit button(s)' dialog
   *
   * Dropdown body is positioned incorrectly when dropdownParent isn't statically positioned.
   * @see https://github.com/select2/select2/issues/3303
   */
  $(function () {
    if ($.fn.select2) {
      $(document).on('state:visible state:visible-slide', function (e) {
        $('select.select2-hidden-accessible').select2('close');
      });
    }

    // Select2 search broken inside jQuery UI 1.10.x modal Dialog.
    // @see https://github.com/select2/select2/issues/1246
    if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
      var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
      $.ui.dialog.prototype._allowInteraction = function (e) {
        if ($(e.target).closest('.select2-dropdown').length) {
          return true;
        }
        return ui_dialog_interaction.apply(this, arguments);
      };
    }
  });

})(jQuery, Drupal);
;
/**
 * @file
 * JavaScript behaviors for admin pages.
 */

(function ($, Drupal, debounce) {

  'use strict';

  /**
   * Filter webform autocomplete handler.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformFilterAutocomplete = {
    attach: function (context) {
      $('.webform-filter-form input.form-autocomplete', context).once('webform-autocomplete')
        .each(function () {
          // If input value is an autocomplete match, reset the input to its
          // default value.
          if (/\(([^)]+)\)$/.test(this.value)) {
            this.value = this.defaultValue;
          }

          // From: http://stackoverflow.com/questions/5366068/jquery-ui-autocomplete-submit-onclick-result
          $(this).bind('autocompleteselect', function (event, ui) {
            if (ui.item) {
              $(this).val(ui.item.value);
              $(this.form).trigger('submit');
            }
          });
        });
    }
  };

  /**
   * Allow table rows to be hyperlinked.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformTableRowHref = {
    attach: function (context) {
      // Only attach the click event handler to the entire table and determine
      // which row triggers the event.
      $('.webform-results-table', context).once('webform-results-table').on('click', function (event) {
        if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON' || event.target.tagName === 'INPUT') {
          return true;
        }

        if ($(event.target).parents('a[href]').length || $(event.target).parents('.dropbutton-widget').length) {
          return true;
        }

        var $input = $(event.target).closest('td').find('input');
        if ($input.length) {
          if ($input.attr('type') === 'checkbox') {
            $input.click();
          }
          return true;
        }

        var $tr = $(event.target).parents('tr[data-webform-href]');
        if (!$tr.length) {
          return true;
        }

        window.location = $tr.attr('data-webform-href');
        return false;
      });
    }
  };

})(jQuery, Drupal, Drupal.debounce);
;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, Drupal, debounce, displace) {
  Drupal.offCanvas = {
    position: null,
    minimumHeight: 30,
    minDisplaceWidth: 768,
    $mainCanvasWrapper: $('[data-off-canvas-main-canvas]'),
    isOffCanvas: function isOffCanvas($element) {
      return $element.is('#drupal-off-canvas');
    },
    removeOffCanvasEvents: function removeOffCanvasEvents($element) {
      $element.off('.off-canvas');
      $(document).off('.off-canvas');
      $(window).off('.off-canvas');
    },
    beforeCreate: function beforeCreate(_ref) {
      var settings = _ref.settings,
        $element = _ref.$element;
      Drupal.offCanvas.removeOffCanvasEvents($element);
      $('body').addClass('js-off-canvas-dialog-open');
      settings.position = {
        my: 'left top',
        at: "".concat(Drupal.offCanvas.getEdge(), " top"),
        of: window
      };
      var position = settings.drupalOffCanvasPosition;
      var height = position === 'side' ? $(window).height() : settings.height;
      var width = position === 'side' ? settings.width : '100%';
      settings.height = height;
      settings.width = width;
    },
    beforeClose: function beforeClose(_ref2) {
      var $element = _ref2.$element;
      $('body').removeClass('js-off-canvas-dialog-open');
      Drupal.offCanvas.removeOffCanvasEvents($element);
      Drupal.offCanvas.resetPadding();
    },
    afterCreate: function afterCreate(_ref3) {
      var $element = _ref3.$element,
        settings = _ref3.settings;
      var eventData = {
        settings: settings,
        $element: $element,
        offCanvasDialog: this
      };
      $element.on('dialogContentResize.off-canvas', eventData, Drupal.offCanvas.handleDialogResize).on('dialogContentResize.off-canvas', eventData, Drupal.offCanvas.bodyPadding);
      Drupal.offCanvas.getContainer($element).attr("data-offset-".concat(Drupal.offCanvas.getEdge()), '');
      $(window).on('resize.off-canvas', eventData, debounce(Drupal.offCanvas.resetSize, 100)).trigger('resize.off-canvas');
    },
    render: function render(_ref4) {
      var settings = _ref4.settings;
      $('.ui-dialog-off-canvas, .ui-dialog-off-canvas .ui-dialog-titlebar').toggleClass('ui-dialog-empty-title', !settings.title);
    },
    handleDialogResize: function handleDialogResize(event) {
      var $element = event.data.$element;
      var $container = Drupal.offCanvas.getContainer($element);
      var $offsets = $container.find('> :not(#drupal-off-canvas, .ui-resizable-handle)');
      var offset = 0;
      $element.css({
        height: 'auto'
      });
      var modalHeight = $container.height();
      $offsets.each(function (i, e) {
        offset += $(e).outerHeight();
      });
      var scrollOffset = $element.outerHeight() - $element.height();
      $element.height(modalHeight - offset - scrollOffset);
    },
    resetSize: function resetSize(event) {
      var $element = event.data.$element;
      var container = Drupal.offCanvas.getContainer($element);
      var position = event.data.settings.drupalOffCanvasPosition;
      if (Drupal.offCanvas.position && Drupal.offCanvas.position !== position) {
        container.removeAttr("data-offset-".concat(Drupal.offCanvas.position));
      }
      if (position === 'top') {
        $element.css('min-height', "".concat(Drupal.offCanvas.minimumHeight, "px"));
      }
      displace();
      var offsets = displace.offsets;
      var topPosition = position === 'side' && offsets.top !== 0 ? "+".concat(offsets.top) : '';
      var adjustedOptions = {
        position: {
          my: "".concat(Drupal.offCanvas.getEdge(), " top"),
          at: "".concat(Drupal.offCanvas.getEdge(), " top").concat(topPosition),
          of: window
        }
      };
      var height = position === 'side' ? "".concat($(window).height() - (offsets.top + offsets.bottom), "px") : event.data.settings.height;
      container.css({
        position: 'fixed',
        height: height
      });
      $element.dialog('option', adjustedOptions).trigger('dialogContentResize.off-canvas');
      Drupal.offCanvas.position = position;
    },
    bodyPadding: function bodyPadding(event) {
      var position = event.data.settings.drupalOffCanvasPosition;
      if (position === 'side' && $('body').outerWidth() < Drupal.offCanvas.minDisplaceWidth) {
        return;
      }
      Drupal.offCanvas.resetPadding();
      var $element = event.data.$element;
      var $container = Drupal.offCanvas.getContainer($element);
      var $mainCanvasWrapper = Drupal.offCanvas.$mainCanvasWrapper;
      var width = $container.outerWidth();
      var mainCanvasPadding = $mainCanvasWrapper.css("padding-".concat(Drupal.offCanvas.getEdge()));
      if (position === 'side' && width !== mainCanvasPadding) {
        $mainCanvasWrapper.css("padding-".concat(Drupal.offCanvas.getEdge()), "".concat(width, "px"));
        $container.attr("data-offset-".concat(Drupal.offCanvas.getEdge()), width);
        displace();
      }
      var height = $container.outerHeight();
      if (position === 'top') {
        $mainCanvasWrapper.css('padding-top', "".concat(height, "px"));
        $container.attr('data-offset-top', height);
        displace();
      }
    },
    getContainer: function getContainer($element) {
      return $element.dialog('widget');
    },
    getEdge: function getEdge() {
      return document.documentElement.dir === 'rtl' ? 'left' : 'right';
    },
    resetPadding: function resetPadding() {
      Drupal.offCanvas.$mainCanvasWrapper.css("padding-".concat(Drupal.offCanvas.getEdge()), 0);
      Drupal.offCanvas.$mainCanvasWrapper.css('padding-top', 0);
      displace();
    }
  };
  Drupal.behaviors.offCanvasEvents = {
    attach: function attach() {
      if (!once('off-canvas', 'html').length) {
        return;
      }
      $(window).on({
        'dialog:beforecreate': function dialogBeforecreate(event, dialog, $element, settings) {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            Drupal.offCanvas.beforeCreate({
              dialog: dialog,
              $element: $element,
              settings: settings
            });
          }
        },
        'dialog:aftercreate': function dialogAftercreate(event, dialog, $element, settings) {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            Drupal.offCanvas.render({
              dialog: dialog,
              $element: $element,
              settings: settings
            });
            Drupal.offCanvas.afterCreate({
              $element: $element,
              settings: settings
            });
          }
        },
        'dialog:beforeclose': function dialogBeforeclose(event, dialog, $element) {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            Drupal.offCanvas.beforeClose({
              dialog: dialog,
              $element: $element
            });
          }
        }
      });
    }
  };
})(jQuery, Drupal, Drupal.debounce, Drupal.displace);;
/**
 * @file
 * JavaScript behaviors for webform off-canvas dialogs.
 *
 * @see misc/dialog/off-canvas.js
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Attaches webform off-canvas behaviors.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches event listeners to window for off-canvas dialogs.
   */
  Drupal.behaviors.webformOffCanvasEvents = {
    attach: function () {
      // Resize seven.theme tabs when off-canvas dialog opened and closed.
      // @see core/themes/seven/js/nav-tabs.js
      $(window).once('webform-off-canvas').on({
        'dialog:aftercreate': function (event, dialog, $element, settings) {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            $(window).trigger('resize.tabs');
          }
        },
        'dialog:afterclose': function (event, dialog, $element, settings) {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            $(window).trigger('resize.tabs');
          }
        }
      });
    }
  };

  // Append .ckeditor-off-canvas-reset to document to disable ckeditor reset.
  // @see webform_css_alter()
  // @see web/core/modules/ckeditor/js/ckeditor.off-canvas-css-reset.es6.js
  $(document.body).append('<style id="ckeditor-off-canvas-reset"></style>');

})(jQuery, Drupal);
;
/**
 * @file
 * JavaScript behaviors for details element.
 */

(function ($, Drupal) {

  'use strict';

  Drupal.webform = Drupal.webform || {};
  Drupal.webform.detailsToggle = Drupal.webform.detailsToggle || {};
  Drupal.webform.detailsToggle.options = Drupal.webform.detailsToggle.options || {};

  /**
   * Attach handler to toggle details open/close state.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformDetailsToggle = {
    attach: function (context) {
      $('.js-webform-details-toggle', context).once('webform-details-toggle').each(function () {
        var $form = $(this);
        var $tabs = $form.find('.webform-tabs');

        // Get only the main details elements and ignore all nested details.
        var selector = ($tabs.length) ? '.webform-tab' : '.js-webform-details-toggle, .webform-elements';
        var $details = $form.find('details').filter(function () {
          var $parents = $(this).parentsUntil(selector);
          return ($parents.find('details').length === 0);
        });

        // Toggle is only useful when there are two or more details elements.
        if ($details.length < 2) {
          return;
        }

        var options = $.extend({
          button: '<button type="button" class="webform-details-toggle-state"></button>'
        }, Drupal.webform.detailsToggle.options);

        // Create toggle buttons.
        var $toggle = $(options.button)
          .attr('title', Drupal.t('Toggle details widget state.'))
          .on('click', function (e) {
            // Get details that are not vertical tabs pane.
            var $details = $form.find('details:not(.vertical-tabs__pane)');
            var open;
            if (Drupal.webform.detailsToggle.isFormDetailsOpen($form)) {
              $details.removeAttr('open');
              open = 0;
            }
            else {
              $details.attr('open', 'open');
              open = 1;
            }
            Drupal.webform.detailsToggle.setDetailsToggleLabel($form);

            // Set the saved states for all the details elements.
            // @see webform.element.details.save.js
            if (Drupal.webformDetailsSaveGetName) {
              $details.each(function () {
                // Note: Drupal.webformDetailsSaveGetName checks if localStorage
                // exists and is enabled.
                // @see webform.element.details.save.js
                var name = Drupal.webformDetailsSaveGetName($(this));
                if (name) {
                  localStorage.setItem(name, open);
                }
              });
            }
          })
          .wrap('<div class="webform-details-toggle-state-wrapper"></div>')
          .parent();

        if ($tabs.length) {
          // Add toggle state before the tabs.
          $tabs.find('.item-list:first-child').eq(0).before($toggle);
        }
        else {
          // Add toggle state link to first details element.
          $details.eq(0).before($toggle);
        }

        Drupal.webform.detailsToggle.setDetailsToggleLabel($form);
      });
    }
  };

  /**
   * Determine if a webform's details are all opened.
   *
   * @param {jQuery} $form
   *   A webform.
   *
   * @return {boolean}
   *   TRUE if a webform's details are all opened.
   */
  Drupal.webform.detailsToggle.isFormDetailsOpen = function ($form) {
    return ($form.find('details[open]').length === $form.find('details').length);
  };

  /**
   * Set a webform's details toggle state widget label.
   *
   * @param {jQuery} $form
   *   A webform.
   */
  Drupal.webform.detailsToggle.setDetailsToggleLabel = function ($form) {
    var isOpen = Drupal.webform.detailsToggle.isFormDetailsOpen($form);

    var label = (isOpen) ? Drupal.t('Collapse all') : Drupal.t('Expand all');
    $form.find('.webform-details-toggle-state').html(label);

    var text = (isOpen) ? Drupal.t('All details have been expanded.') : Drupal.t('All details have been collapsed.');
    Drupal.announce(text);
  };

})(jQuery, Drupal);
;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, Drupal) {
  function DetailsSummarizedContent(node) {
    this.$node = $(node);
    this.setupSummary();
  }
  $.extend(DetailsSummarizedContent, {
    instances: []
  });
  $.extend(DetailsSummarizedContent.prototype, {
    setupSummary: function setupSummary() {
      this.$detailsSummarizedContentWrapper = $(Drupal.theme('detailsSummarizedContentWrapper'));
      this.$node.on('summaryUpdated', $.proxy(this.onSummaryUpdated, this)).trigger('summaryUpdated').find('> summary').append(this.$detailsSummarizedContentWrapper);
    },
    onSummaryUpdated: function onSummaryUpdated() {
      var text = this.$node.drupalGetSummary();
      this.$detailsSummarizedContentWrapper.html(Drupal.theme('detailsSummarizedContentText', text));
    }
  });
  Drupal.behaviors.detailsSummary = {
    attach: function attach(context) {
      DetailsSummarizedContent.instances = DetailsSummarizedContent.instances.concat(once('details', 'details', context).map(function (details) {
        return new DetailsSummarizedContent(details);
      }));
    }
  };
  Drupal.DetailsSummarizedContent = DetailsSummarizedContent;
  Drupal.theme.detailsSummarizedContentWrapper = function () {
    return "<span class=\"summary\"></span>";
  };
  Drupal.theme.detailsSummarizedContentText = function (text) {
    return text ? " (".concat(text, ")") : '';
  };
})(jQuery, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, Drupal) {
  Drupal.behaviors.detailsAria = {
    attach: function attach() {
      $(once('detailsAria', 'body')).on('click.detailsAria', 'summary', function (event) {
        var $summary = $(event.currentTarget);
        var open = $(event.currentTarget.parentNode).attr('open') === 'open' ? 'false' : 'true';
        $summary.attr({
          'aria-expanded': open,
          'aria-pressed': open
        });
      });
    }
  };
})(jQuery, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, Modernizr, Drupal) {
  function CollapsibleDetails(node) {
    this.$node = $(node);
    this.$node.data('details', this);
    var anchor = window.location.hash && window.location.hash !== '#' ? ", ".concat(window.location.hash) : '';
    if (this.$node.find(".error".concat(anchor)).length) {
      this.$node.attr('open', true);
    }
    this.setupSummaryPolyfill();
  }
  $.extend(CollapsibleDetails, {
    instances: []
  });
  $.extend(CollapsibleDetails.prototype, {
    setupSummaryPolyfill: function setupSummaryPolyfill() {
      var $summary = this.$node.find('> summary');
      $summary.attr('tabindex', '-1');
      $('<span class="details-summary-prefix visually-hidden"></span>').append(this.$node.attr('open') ? Drupal.t('Hide') : Drupal.t('Show')).prependTo($summary).after(document.createTextNode(' '));
      $('<a class="details-title"></a>').attr('href', "#".concat(this.$node.attr('id'))).prepend($summary.contents()).appendTo($summary);
      $summary.append(this.$summary).on('click', $.proxy(this.onSummaryClick, this));
    },
    onSummaryClick: function onSummaryClick(e) {
      this.toggle();
      e.preventDefault();
    },
    toggle: function toggle() {
      var _this = this;
      var isOpen = !!this.$node.attr('open');
      var $summaryPrefix = this.$node.find('> summary span.details-summary-prefix');
      if (isOpen) {
        $summaryPrefix.html(Drupal.t('Show'));
      } else {
        $summaryPrefix.html(Drupal.t('Hide'));
      }
      setTimeout(function () {
        _this.$node.attr('open', !isOpen);
      }, 0);
    }
  });
  Drupal.behaviors.collapse = {
    attach: function attach(context) {
      if (Modernizr.details) {
        return;
      }
      once('collapse', 'details', context).forEach(function (detail) {
        detail.classList.add('collapse-processed');
        CollapsibleDetails.instances.push(new CollapsibleDetails(detail));
      });
    }
  };
  var handleFragmentLinkClickOrHashChange = function handleFragmentLinkClickOrHashChange(e, $target) {
    $target.parents('details').not('[open]').find('> summary').trigger('click');
  };
  $('body').on('formFragmentLinkClickOrHashChange.details', handleFragmentLinkClickOrHashChange);
  Drupal.CollapsibleDetails = CollapsibleDetails;
})(jQuery, Modernizr, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, Modernizr, Drupal) {
  Drupal.behaviors.claroDetails = {
    attach: function attach(context) {
      $(once('claroDetails', context === document ? 'html' : context)).on('click', function (event) {
        if (event.target.nodeName === 'SUMMARY') {
          $(event.target).trigger('focus');
        }
      });
    }
  };
  Drupal.behaviors.claroDetailsToggleShim = {
    attach: function attach(context) {
      if (Modernizr.details || !Drupal.CollapsibleDetails.instances.length) {
        return;
      }
      $(once('claroDetailsToggleShim', 'details .details-title', context)).on('keypress', function (event) {
        var keyCode = event.keyCode || event.charCode;
        if (keyCode === 32) {
          $(event.target).closest('summary').trigger('click');
          event.preventDefault();
        }
      });
    }
  };
  Drupal.theme.detailsSummarizedContentWrapper = function () {
    return "<span class=\"claro-details__summary-summary\"></span>";
  };
  Drupal.theme.detailsSummarizedContentText = function (text) {
    return text || '';
  };
})(jQuery, Modernizr, Drupal);;
/**
 * @file
 * JavaScript behaviors for select menu.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Disable select menu options using JavaScript.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformSelectOptionsDisabled = {
    attach: function (context) {
      $('select[data-webform-select-options-disabled]', context).once('webform-select-options-disabled').each(function () {
        var $select = $(this);
        var disabled = $select.attr('data-webform-select-options-disabled').split(/\s*,\s*/);
        $select.find('option').filter(function isDisabled() {
          return ($.inArray(this.value, disabled) !== -1);
        }).attr('disabled', 'disabled');
      });
    }
  };

})(jQuery, Drupal);
;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
(function ($, Drupal, once) {
  Drupal.behaviors.claroAutoCompete = {
    attach: function attach(context) {
      once('claroAutoComplete', 'input.form-autocomplete', context).forEach(function (value) {
        var $input = $(value);
        var timeout = 400;
        var classRemoveTimeout;
        var classRemove = function classRemove($autoCompleteElem) {
          $autoCompleteElem.removeClass('is-autocompleting');
          $autoCompleteElem.siblings('[data-drupal-selector="autocomplete-message"]').addClass('hidden');
        };
        $input.on('input autocompletesearch autocompleteresponses', function (event) {
          if (event && event.type && event.type === 'autocompletesearch') {
            $(event.target).addClass('is-autocompleting');
            $(event.target).siblings('[data-drupal-selector="autocomplete-message"]').removeClass('hidden');
          }
          clearTimeout(classRemoveTimeout);
          classRemoveTimeout = setTimeout(classRemove, timeout, $(event.target));
        });
      });
    }
  };
})(jQuery, Drupal, once);;
/**
 * @file
 * JavaScript behaviors for roles element integration.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Enhance roles element.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformRoles = {
    attach: function (context) {
      $(context).find('.js-webform-roles-role[value="authenticated"]').once('webform-roles').each(function () {
        var $authenticated = $(this);
        var $checkboxes = $authenticated.parents('.form-checkboxes').find('.js-webform-roles-role').filter(function () {
          return ($(this).val() !== 'anonymous' && $(this).val() !== 'authenticated');
        });

        $authenticated.on('click', function () {
          if ($authenticated.is(':checked')) {
            $checkboxes.prop('checked', true).attr('disabled', true);
          }
          else {
            $checkboxes.prop('checked', false).removeAttr('disabled');
          }
        });

        if ($authenticated.is(':checked')) {
          $checkboxes.prop('checked', true).attr('disabled', true);
        }
      });
    }
  };

})(jQuery, Drupal);
;
