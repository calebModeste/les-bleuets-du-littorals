/**
 * @file
 * JavaScript behaviors for filter by text.
 */

(function ($, Drupal, debounce) {

  'use strict';

  /**
   * Filters the webform element list by a text input search string.
   *
   * The text input will have the selector `input.webform-form-filter-text`.
   *
   * The target element to do searching in will be in the selector
   * `input.webform-form-filter-text[data-element]`
   *
   * The text source where the text should be found will have the selector
   * `.webform-form-filter-text-source`
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior for the webform element filtering.
   */
  Drupal.behaviors.webformFilterByText = {
    attach: function (context, settings) {
      $('input.webform-form-filter-text', context).once('webform-form-filter-text').each(function () {
        var $input = $(this);
        $input.wrap('<div class="webform-form-filter"></div>');
        var $reset = $('<input class="webform-form-filter-reset" type="reset" title="Clear the search query." value="✕" style="display: none" />');
        $reset.insertAfter($input);
        var $table = $($input.data('element'));
        var $summary = $($input.data('summary'));
        var $noResults = $($input.data('no-results'));
        var $details = $table.closest('details');
        var $filterRows;

        var focusInput = $input.data('focus') || 'true';
        var sourceSelector = $input.data('source') || '.webform-form-filter-text-source';
        var parentSelector = $input.data('parent') || 'tr';
        var selectedSelector = $input.data('selected') || '';

        var hasDetails = $details.length;
        var totalItems;
        var args = {
          '@item': $input.data('item-singular') || Drupal.t('item'),
          '@items': $input.data('item-plural') || Drupal.t('items'),
          '@total': null
        };

        if ($table.length) {
          $filterRows = $table.find(sourceSelector);
          $input
            .attr('autocomplete', 'off')
            .on('keyup', debounce(filterElementList, 200))
            .keyup();

          $reset.on('click', resetFilter);

          // Make sure the filter input is always focused.
          if (focusInput === 'true') {
            setTimeout(function () {$input.trigger('focus');});
          }
        }

        /**
         * Reset the filtering
         *
         * @param {jQuery.Event} e
         *   The jQuery event for the keyup event that triggered the filter.
         */
        function resetFilter(e) {
          $input.val('').keyup();
          $input.trigger('focus');
        }

        /**
         * Filters the webform element list.
         *
         * @param {jQuery.Event} e
         *   The jQuery event for the keyup event that triggered the filter.
         */
        function filterElementList(e) {
          var query = $(e.target).val().toLowerCase();

          // Filter if the length of the query is at least 2 characters.
          if (query.length >= 2) {
            // Reset count.
            totalItems = 0;
            if ($details.length) {
              $details.hide();
            }
            $filterRows.each(toggleEntry);

            // Announce filter changes.
            // @see Drupal.behaviors.blockFilterByText
            Drupal.announce(Drupal.formatPlural(
              totalItems,
              '1 @item is available in the modified list.',
              '@total @items are available in the modified list.',
              args
            ));
          }
          else {
            totalItems = $filterRows.length;
            $filterRows.each(function (index) {
              $(this).closest(parentSelector).show();
              if ($details.length) {
                $details.show();
              }
            });
          }

          // Set total.
          args['@total'] = totalItems;

          // Hide/show no results.
          $noResults[totalItems ? 'hide' : 'show']();

          // Hide/show reset.
          $reset[query.length ? 'show' : 'hide']();

          // Update summary.
          if ($summary.length) {
            $summary.html(Drupal.formatPlural(
              totalItems,
              '1 @item',
              '@total @items',
              args
            ));
            $summary[totalItems ? 'show' : 'hide']();
          }

          /**
           * Shows or hides the webform element entry based on the query.
           *
           * @param {number} index
           *   The index in the loop, as provided by `jQuery.each`
           * @param {HTMLElement} label
           *   The label of the webform.
           */
          function toggleEntry(index, label) {
            var $label = $(label);
            var $row = $label.closest(parentSelector);

            var textMatch = $label.text().toLowerCase().indexOf(query) !== -1;
            var isSelected = (selectedSelector && $row.find(selectedSelector).length) ? true : false;

            var isVisible = textMatch || isSelected;
            $row.toggle(isVisible);
            if (isVisible) {
              totalItems++;
              if (hasDetails) {
                $row.closest('details').show();
              }
            }
          }
        }
      });
    }
  };

})(jQuery, Drupal, Drupal.debounce);
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
 * @file
 * JavaScript behaviors for Tippy.js tooltip integration.
 */

(function ($, Drupal) {

  'use strict';

  var tooltipDefaultOptions = {
    delay: 100
  };

  // @see https://atomiks.github.io/tippyjs/v5/all-props/
  // @see https://atomiks.github.io/tippyjs/v6/all-props/
  Drupal.webform = Drupal.webform || {};

  Drupal.webform.tooltipElement = Drupal.webform.tooltipElement || {};
  Drupal.webform.tooltipElement.options = Drupal.webform.tooltipElement.options || tooltipDefaultOptions;

  Drupal.webform.tooltipLink = Drupal.webform.tooltipLink || {};
  Drupal.webform.tooltipLink.options = Drupal.webform.tooltipLink.options || tooltipDefaultOptions;

  /**
   * Initialize tooltip element support.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformTooltipElement = {
    attach: function (context) {
      if (!window.tippy) {
        return;
      }

      $(context).find('.js-webform-tooltip-element').once('webform-tooltip-element').each(function () {
        // Checkboxes, radios, buttons, toggles, etc… use fieldsets.
        // @see \Drupal\webform\Plugin\WebformElement\OptionsBase::prepare
        var $element = $(this);
        var $description;
        if ($element.is('fieldset')) {
          $description = $element.find('> .fieldset-wrapper > .description > .webform-element-description.visually-hidden');
        }
        else {
          $description = $element.find('> .description > .webform-element-description.visually-hidden');
        }

        var options = $.extend({
          content: $description.html(),
          allowHTML: true
        }, Drupal.webform.tooltipElement.options);

        tippy(this, options);
      });
    }
  };

  /**
   * Initialize jQuery UI tooltip link support.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformTooltipLink = {
    attach: function (context) {
      if (!window.tippy) {
        return;
      }

      $(context).find('.js-webform-tooltip-link').once('webform-tooltip-link').each(function () {
        var title = $(this).attr('title');
        if (title) {
          var options = $.extend({
            content: title,
            allowHTML: true
          }, Drupal.webform.tooltipLink.options);

          tippy(this, options);
        }
      });
    }
  };

})(jQuery, Drupal);
;
/**
 * @file
 * JavaScript behaviors for checkboxes.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Adds check all or none checkboxes support.
   *
   * @type {Drupal~behavior}
   *
   * @see https://www.drupal.org/project/webform/issues/3068998
   */
  Drupal.behaviors.webformCheckboxesAllorNone = {
    attach: function (context) {
      $('[data-options-all], [data-options-none]', context)
        .once('webform-checkboxes-all-or-none')
        .each(function () {
          var $element = $(this);

          var options_all_value = $element.data('options-all');
          var options_none_value = $element.data('options-none');

          // Get all checkboxes.
          var $checkboxes = $element.find('input[type="checkbox"]');

          // Get all options/checkboxes.
          var $options = $checkboxes
            .not('[value="' + options_all_value + '"]')
            .not('[value="' + options_none_value + '"]');

          // Get options all and none checkboxes.
          var $options_all = $element
            .find(':checkbox[value="' + options_all_value + '"]');
          var $options_none = $element
            .find(':checkbox[value="' + options_none_value + '"]');

          // All of the above.
          if ($options_all.length) {
            $options_all.on('click', toggleCheckAllEventHandler);
            if ($options_all.prop('checked')) {
              toggleCheckAllEventHandler();
            }
          }

          // None of the above.
          if ($options_none.length) {
            $options_none.on('click', toggleCheckNoneEventHandler);
            toggleCheckNoneEventHandler();
          }

          $options.on('click', toggleCheckboxesEventHandler);
          toggleCheckboxesEventHandler();

          /**
           * Toggle check all checkbox checked state.
           */
          function toggleCheckAllEventHandler() {
            if ($options_all.prop('checked')) {
              // Uncheck options none.
              if ($options_none.is(':checked')) {
                $options_none
                  .prop('checked', false)
                  .trigger('change', ['webform.states']);
              }
              // Check check all unchecked options.
              $options.not(':checked')
                .prop('checked', true)
                .trigger('change', ['webform.states']);
            }
            else {
              // Check uncheck all checked options.
              $options.filter(':checked')
                .prop('checked', false)
                .trigger('change', ['webform.states']);
            }
          }

          /**
           * Toggle check none checkbox checked state.
           */
          function toggleCheckNoneEventHandler() {
            if ($options_none.prop('checked')) {
              $checkboxes
                .not('[value="' + options_none_value + '"]')
                .filter(':checked')
                .prop('checked', false)
                .trigger('change', ['webform.states']);
            }
          }

          /**
           * Toggle check all checkbox checked state.
           */
          function toggleCheckboxesEventHandler() {
            var isAllChecked = ($options.filter(':checked').length === $options.length);
            if ($options_all.length
              && $options_all.prop('checked') !== isAllChecked) {
              $options_all
                .prop('checked', isAllChecked)
                .trigger('change', ['webform.states']);
            }
            var isOneChecked = $options.is(':checked');
            if ($options_none.length
              && isOneChecked) {
              $options_none
                .prop('checked', false)
                .trigger('change', ['webform.states']);
            }
          }
        });
    }
  };

})(jQuery, Drupal);
;
/**
 * @file
 * JavaScript behaviors for options elements.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Attach handlers to options buttons element.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformOptionsButtons = {
    attach: function (context) {
      // Place <input> inside of <label> before the label.
      $(context).find('label.webform-options-display-buttons-label > input[type="checkbox"], label.webform-options-display-buttons-label > input[type="radio"]').each(function () {
        var $input = $(this);
        var $label = $input.parent();
        $input.detach().insertBefore($label);
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
(function ($, Drupal) {
  Drupal.behaviors.fileValidateAutoAttach = {
    attach: function attach(context, settings) {
      var $context = $(context);
      var elements;
      function initFileValidation(selector) {
        $(once('fileValidate', $context.find(selector))).on('change.fileValidate', {
          extensions: elements[selector]
        }, Drupal.file.validateExtension);
      }
      if (settings.file && settings.file.elements) {
        elements = settings.file.elements;
        Object.keys(elements).forEach(initFileValidation);
      }
    },
    detach: function detach(context, settings, trigger) {
      var $context = $(context);
      var elements;
      function removeFileValidation(selector) {
        $(once.remove('fileValidate', $context.find(selector))).off('change.fileValidate', Drupal.file.validateExtension);
      }
      if (trigger === 'unload' && settings.file && settings.file.elements) {
        elements = settings.file.elements;
        Object.keys(elements).forEach(removeFileValidation);
      }
    }
  };
  Drupal.behaviors.fileAutoUpload = {
    attach: function attach(context) {
      $(once('auto-file-upload', 'input[type="file"]', context)).on('change.autoFileUpload', Drupal.file.triggerUploadButton);
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        $(once.remove('auto-file-upload', 'input[type="file"]', context)).off('.autoFileUpload');
      }
    }
  };
  Drupal.behaviors.fileButtons = {
    attach: function attach(context) {
      var $context = $(context);
      $context.find('.js-form-submit').on('mousedown', Drupal.file.disableFields);
      $context.find('.js-form-managed-file .js-form-submit').on('mousedown', Drupal.file.progressBar);
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        var $context = $(context);
        $context.find('.js-form-submit').off('mousedown', Drupal.file.disableFields);
        $context.find('.js-form-managed-file .js-form-submit').off('mousedown', Drupal.file.progressBar);
      }
    }
  };
  Drupal.behaviors.filePreviewLinks = {
    attach: function attach(context) {
      $(context).find('div.js-form-managed-file .file a').on('click', Drupal.file.openInNewWindow);
    },
    detach: function detach(context) {
      $(context).find('div.js-form-managed-file .file a').off('click', Drupal.file.openInNewWindow);
    }
  };
  Drupal.file = Drupal.file || {
    validateExtension: function validateExtension(event) {
      event.preventDefault();
      $('.file-upload-js-error').remove();
      var extensionPattern = event.data.extensions.replace(/,\s*/g, '|');
      if (extensionPattern.length > 1 && this.value.length > 0) {
        var acceptableMatch = new RegExp("\\.(".concat(extensionPattern, ")$"), 'gi');
        if (!acceptableMatch.test(this.value)) {
          var error = Drupal.t('The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.', {
            '%filename': this.value.replace('C:\\fakepath\\', ''),
            '%extensions': extensionPattern.replace(/\|/g, ', ')
          });
          $(this).closest('div.js-form-managed-file').prepend("<div class=\"messages messages--error file-upload-js-error\" aria-live=\"polite\">".concat(error, "</div>"));
          this.value = '';
          event.stopImmediatePropagation();
        }
      }
    },
    triggerUploadButton: function triggerUploadButton(event) {
      $(event.target).closest('.js-form-managed-file').find('.js-form-submit[data-drupal-selector$="upload-button"]').trigger('mousedown');
    },
    disableFields: function disableFields(event) {
      var $clickedButton = $(this);
      $clickedButton.trigger('formUpdated');
      var $enabledFields = [];
      if ($clickedButton.closest('div.js-form-managed-file').length > 0) {
        $enabledFields = $clickedButton.closest('div.js-form-managed-file').find('input.js-form-file');
      }
      var $fieldsToTemporarilyDisable = $('div.js-form-managed-file input.js-form-file').not($enabledFields).not(':disabled');
      $fieldsToTemporarilyDisable.prop('disabled', true);
      setTimeout(function () {
        $fieldsToTemporarilyDisable.prop('disabled', false);
      }, 1000);
    },
    progressBar: function progressBar(event) {
      var $clickedButton = $(this);
      var $progressId = $clickedButton.closest('div.js-form-managed-file').find('input.file-progress');
      if ($progressId.length) {
        var originalName = $progressId.attr('name');
        $progressId.attr('name', originalName.match(/APC_UPLOAD_PROGRESS|UPLOAD_IDENTIFIER/)[0]);
        setTimeout(function () {
          $progressId.attr('name', originalName);
        }, 1000);
      }
      setTimeout(function () {
        $clickedButton.closest('div.js-form-managed-file').find('div.ajax-progress-bar').slideDown();
      }, 500);
      $clickedButton.trigger('fileUpload');
    },
    openInNewWindow: function openInNewWindow(event) {
      event.preventDefault();
      $(this).attr('target', '_blank');
      window.open(this.href, 'filePreview', 'toolbar=0,scrollbars=1,location=1,statusbar=1,menubar=0,resizable=1,width=500,height=550');
    }
  };
})(jQuery, Drupal);;
/**
 * @file
 * JavaScript behaviors for managed file uploads.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Track file uploads and display confirm dialog when an file upload is in progress.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformManagedFileAutoUpload = {
    attach: function attach(context) {
      // Add submit handler to file upload form.
      $(context).find('form')
        .once('webform-auto-file-upload')
        .on('submit', function (event) {
          var $form = $(this);
          if ($form.data('webform-auto-file-uploads') > 0 && blockSubmit($form)) {
            event.preventDefault();
            return false;
          }
          return true;
        });

      // Add submit handler to form.beforeSend.
      // Update Drupal.Ajax.prototype.beforeSend only once.
      if (typeof Drupal.Ajax !== 'undefined' && typeof Drupal.Ajax.prototype.beforeSubmitWebformManagedFileAutoUploadOriginal === 'undefined') {
        Drupal.Ajax.prototype.beforeSubmitWebformManagedFileAutoUploadOriginal = Drupal.Ajax.prototype.beforeSubmit;
        Drupal.Ajax.prototype.beforeSubmit = function (form_values, element_settings, options) {
          var $form = this.$form;
          var $element = $(this.element);

          // Determine if the triggering element is within .form-actions.
          var isFormActions = $element
            .closest('.form-actions').length;

          // Determine if the triggering element is within a multiple element.
          var isMultipleUpload = $element
            .parents('.js-form-type-webform-multiple, .js-form-type-webform-custom-composite')
            .find('.js-form-managed-file').length;

          // Determine if the triggering element is not within a
          // managed file element.
          var isManagedUploadButton = $element.parents('.js-form-managed-file').length;

          // Only trigger block submit for .form-actions and multiple element
          // with file upload.
          if ($form.data('webform-auto-file-uploads') > 0 &&
            (isFormActions || (isMultipleUpload && !isManagedUploadButton)) &&
            blockSubmit($form)) {
            this.ajaxing = false;
            return false;
          }
          return this.beforeSubmitWebformManagedFileAutoUploadOriginal.apply(this, arguments);
        };
      }

      $(context).find('input[type="file"]').once('webform-auto-file-upload').on('change', function () {
        // Track file upload.
        $(this).data('webform-auto-file-upload', true);

        // Increment form file uploads.
        var $form = $(this.form);
        var fileUploads = ($form.data('webform-auto-file-uploads') || 0);
        $form.data('webform-auto-file-uploads', fileUploads + 1);
      });
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        $(context).find('input[type="file"]').removeOnce('webform-auto-file-upload').each(function () {
          if ($(this).data('webform-auto-file-upload')) {
            // Remove file upload tracking.
            $(this).removeData('webform-auto-file-upload');

            // Decrease form file uploads.
            var $form = $(this.form);
            var fileUploads = ($form.data('webform-auto-file-uploads') || 0);
            $form.data('webform-auto-file-uploads', fileUploads - 1);
          }
        });
      }
    }
  };

  /**
   * Block form submit.
   *
   * @param {jQuery} form
   *   A form.
   *
   * @return {boolean}
   *   TRUE if form submit should be blocked.
   */
  function blockSubmit(form) {
    if ($(form).data('webform-auto-file-uploads') < 0) {
      return false;
    }

    var message = Drupal.t('File upload in progress. Uploaded file may be lost.') +
      '\n' +
      Drupal.t('Do you want to continue?');
    var result = !window.confirm(message);

    // If submit once behavior is available, make sure to clear it if the form
    // can be submitted.
    if (result && Drupal.behaviors.webformSubmitOnce) {
      setTimeout(function () {Drupal.behaviors.webformSubmitOnce.clear();});
    }

    return result;
  }

})(jQuery, Drupal);
;
