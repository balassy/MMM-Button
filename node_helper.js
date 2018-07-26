'use strict';

/* Magic Mirror
 * Module: MMM-Button
 *
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const GPIO = require('onoff').Gpio;

module.exports = NodeHelper.create({
  start() {
    this.started = false
  },


  socketNotificationReceived(notification, payload) {
    const self = this;
    if (notification === 'BUTTON_CONFIG' && this.started === false) {
      this.config = payload;

      const button = new GPIO(this.config.buttonPIN, 'in', 'both', { persistentWatch: true, debounceTimeout: this.config.clickDelay });
      button.watch(function (err, state) {
        // check the state of the button
        // 1 == pressed, 0 == not pressed
        if (state == 1) {
          self.sendSocketNotification(self.config.notificationMessage, true);
          console.log("button pressed");
        }
      });

      this.started = true
    };
  }
});
