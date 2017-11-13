import { DataPointHandler } from './dataPointHandler';
import * as $ from 'jquery';

/**
 * The class that moves and animates images.
 */
export class AnimationHandler {

  // the model which we need a reference to in order to pause, resume, and stop it
  cupCounterModel: object;

  // handles the temperature data points that are displayed and sent to WISE
  dataPointHandler: object;

  // keeps track of the time in integer seconds
  time: number;

  /*
   * A flag that is used to determine whether we need to auto resume the model
   * when the user gives focus back to the browser tab.
   */
  resumeOnFocus: boolean = false;

  /**
   * Constructor that sets up event listeners.
   * @param cupCounterModel The cup counter model.
   */
  constructor(cupCounterModel: object) {
    this.time = 0;
    this.cupCounterModel = cupCounterModel;
    this.dataPointHandler = new DataPointHandler();

    /*
     * Create local references to these objects so that they can be used in the
     * event handlers.
     */
    let thisAnimationHandler = this;
    let thisCupCounterModel = this.cupCounterModel;
    let thisDataPointHandler = this.dataPointHandler;

    $('#cupDiv').on('animationend', function(e) {
      if (e.originalEvent.animationName == 'cupMovementAnimation') {
        // the cup has finished moving down onto the counter

        // set the time counter to 0
        thisAnimationHandler.resetTimeCounter();

        // send the initial temperature data points to WISE
        thisDataPointHandler.intializeAndSendTrial();

        // start the heat transfer animations on the cup and the counter
        thisAnimationHandler.startHeatTransfer();
      }
    });

    $('#totalTimer').on('animationend', function() {
      /*
       * the 16 second timer has finished. we use an invisible element and
       * animate it to know when all the animations should be done.
       */

      // stop moving the second timer
      $('#secondTimer').removeClass('secondTimerAnimation');

      // tell the model the animations are finished and everything should stop
      thisCupCounterModel.setCompleted();
    });

    $('#secondTimer').on('animationiteration', function() {
      // this gets called once a second while the animations are running

      // send the updated trial to WISE
      thisDataPointHandler.updateAndSendTrial(thisAnimationHandler.getTimeCounter());

      // update the temperatures displayed on the cup and counter
      let time = thisAnimationHandler.getTimeCounter();
      let cupTemperature = thisDataPointHandler.getCupTemperature(time);
      let counterTemperature = thisDataPointHandler.getCounterTemperature(time);
      thisAnimationHandler.setCupTemperatureReadout(cupTemperature);
      thisAnimationHandler.setCounterTemperatureReadout(counterTemperature);
      thisAnimationHandler.incrementTimeCounter();
    });

    $(window).blur(function() {
      /*
       * The tab has lost focus because the user has switched to another tab or
       * application.
       */
      if (thisCupCounterModel.isStatePlaying()) {
        /*
         * The model is currently playing so we will pause it while the user
         * is not viewing the model.
         */
        thisCupCounterModel.pause();

        /*
         * Set the flag so that we know to automatically resume the model when
         * we regain focus.
         */
        thisAnimationHandler.resumeOnFocus = true;
      }
    });

    $(window).focus(function() {
      // The tab has regained focus.
      if (thisAnimationHandler.resumeOnFocus) {
        /*
         * The model we previously playing when it lost focus so we will
         * automatically resume the model now.
         */
        thisCupCounterModel.resume();
        thisAnimationHandler.resumeOnFocus = false;
      }
    });
  }

  /**
   * Start the animation that lowers the cup onto the counter.
   */
  startCupLowering() {
    $('#cupDiv').addClass('cupMovementAnimation');
  }

  /**
   * Start the heat transfer animation on the cup and counter.
   */
  startHeatTransfer() {
    // start the heat transfer on the cup and counter
    $('#cupHot').addClass('cupHeatAnimation');
    $('#counterCold').addClass('counterHeatAnimation');

    // start moving the mercury in the thermometers
    $('#cupThermometerRedBar').addClass('cupThermometerAnimation');
    $('#counterThermometerRedBar').addClass('counterThermometerAnimation');

    // start moving our hidden timers
    $('#secondTimer').addClass('secondTimerAnimation');
    $('#totalTimer').addClass('totalTimerAnimation');
  }

  /**
   * Get the current time in the model.
   * @return An integer representing the amount of time the model has been
   * running. The value will be between 0-15 inclusive.
   */
  getTimeCounter() {
    return this.time;
  }

  /**
   * Increment the model timer by 1 second.
   */
  incrementTimeCounter() {
    this.time += 1;
  }

  /**
   * Set the model timer back to 0 seconds.
   */
  resetTimeCounter() {
    this.time = 0;
  }

  /**
   * Pause all the elements in the model.
   */
  pause() {
    $('#cupDiv').addClass('paused');
    $('#cupHot').addClass('paused');
    $('#counterCold').addClass('paused');
    $('#cupThermometerRedBar').addClass('paused');
    $('#counterThermometerRedBar').addClass('paused');
    $('#secondTimer').addClass('paused');
    $('#totalTimer').addClass('paused');
  }

  /**
   * Resume animating all the elements in the model.
   */
  resume() {
    $('#cupDiv').removeClass('paused');
    $('#cupHot').removeClass('paused');
    $('#counterCold').removeClass('paused');
    $('#cupThermometerRedBar').removeClass('paused');
    $('#counterThermometerRedBar').removeClass('paused');
    $('#secondTimer').removeClass('paused');
    $('#totalTimer').removeClass('paused');
  }

  /**
   * Reset all the elements back to their original positions and states.
   */
  resetAnimations() {
    $('#cupDiv').removeClass('cupMovementAnimation');
    $('#cupHot').removeClass('cupHeatAnimation');
    $('#counterCold').removeClass('counterHeatAnimation');
    $('#cupThermometerRedBar').removeClass('cupThermometerAnimation');
    $('#counterThermometerRedBar').removeClass('counterThermometerAnimation');
    $('#secondTimer').removeClass('secondTimerAnimation');
    $('#totalTimer').removeClass('totalTimerAnimation');

    /*
     * Set the cup and counter temperature displays back to their starting
     * temperatures.
     */
    this.setCupTemperatureReadout(this.dataPointHandler.getCupTemperature(0));
    this.setCounterTemperatureReadout(this.dataPointHandler.getCounterTemperature(0));
  }

  /**
   * Set the cup temperature that's actually displayed on the cup.
   */
  setCupTemperatureReadout(temp) {
    $('#cupTemperatureReadout').html(Math.floor(temp) + '&#8451;');
  }

  /**
   * Set the counter temperature that's actually displayed on the counter.
   */
  setCounterTemperatureReadout(temp) {
    $('#counterTemperatureReadout').html(Math.floor(temp) + '&#8451;');
  }
}
