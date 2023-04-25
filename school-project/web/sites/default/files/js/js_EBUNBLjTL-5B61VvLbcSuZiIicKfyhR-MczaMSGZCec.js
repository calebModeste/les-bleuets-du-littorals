/**
 * @file
 * JavaScript behaviors for help.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Handles disabling help dialog for mobile devices.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior for disabling help dialog for mobile devices.
   */
  Drupal.behaviors.webformHelpDialog = {
    attach: function (context) {
      $(context).find('.button-webform-play').once('webform-help-dialog').on('click', function (event) {
        if ($(window).width() < 768) {
          event.stopImmediatePropagation();
        }
      }).each(function () {
        // Must make sure that this click event handler is execute first and
        // before the Ajax dialog handler.
        // @see http://stackoverflow.com/questions/2360655/jquery-event-handlers-always-execute-in-order-they-were-bound-any-way-around-t
        var handlers = $._data(this, 'events')['click'];
        var handler = handlers.pop();
        // Move it at the beginning.
        handlers.splice(0, 0, handler);
      });
    }
  };

})(jQuery, Drupal);
;
((Drupal, once) => {
  Drupal.behaviors.ginMessages = {
    attach: context => {
      Drupal.ginMessages.dismissMessages(context);
    }
  }, Drupal.ginMessages = {
    dismissMessages: function() {
      let context = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document;
      once("gin-messages-dismiss", ".messages .button--dismiss", context).forEach((dismissButton => {
        dismissButton.addEventListener("click", (e => {
          e.preventDefault();
          const message = e.currentTarget.closest(".messages-list__item");
          Drupal.ginMessages.hideMessage(message);
        }));
      }));
    },
    hideMessage: message => {
      message.style.opacity = 0, message.classList.add("visually-hidden");
    }
  };
})(Drupal, once);;
