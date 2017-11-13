import { AnimationHandler } from './animationHandler';
import { Button } from './button';
import * as $ from 'jquery';

/**
 * The class that orchestrates the model interactions and animations.
 */
export class CupCounterModel {

  /*
   * the state of the model which can be
   * 'initialized', 'playing', 'paused', or 'completed'
   */
  state: string;

  // the object that handles animating elements
  animationHandler: object;

  // the button that performs play, pause, resume, restart
  button: object;

  constructor() {
    this.state = 'initialized';
    this.animationHandler = new AnimationHandler(this);
    this.button = new Button(this);
  }

  /**
   * Start playing the model from the beginning. This only gets called the first
   * time the model runs. For subsequent runs, restart() will be called.
   */
  play() {
    this.setState('playing');
    this.animationHandler.startCupLowering();
  }

  /**
   * Pause the model.
   */
  pause() {
    this.setState('paused');
    this.animationHandler.pause();
    this.button.modelPaused();
  }

  /**
   * Resume playing the model after it has previously been paused.
   */
  resume() {
    this.setState('playing');
    this.animationHandler.resume();
    this.button.modelPlayed();
  }

  /**
   * Restart the model and begin playing from the beginning.
   */
  restart() {
    this.setState('playing');

    // move all the images back to their original positions and states
    this.animationHandler.resetAnimations();

    /*
     * We need to call startCupLowering() after a timeout in order to allow the
     * .cupMovementAnimation class on the #cupDiv to be removed and then added
     * back. If we do not use a timeout, we will be calling
     * $('#cupDiv').removeClass('cupMovementAnimation'); in resetAnimations()
     * and then immediately calling
     * $('#cupDiv').addClass('cupMovementAnimation'); in startCupLowering()
     * which prevents the browser from digesting the removeClass() call which
     * will lead to the #cupDiv never being reset to its original position.
     */
    setTimeout(this.animationHandler.startCupLowering, 1);
  }

  /**
   * Get the state of the model.
   * @return A string containing the state of the model. Possible values are
   * 'initialized', 'playing', 'paused', or 'completed'.
   */
  getState() {
    return this.state;
  }

  /**
   * Set the state of the model.
   * @param state A string specifying the state of the model. Possible values
   * are 'initialized', 'playing', 'paused', or 'completed'
   */
  setState(state) {
    this.state = state;
  }

  /**
   * Check if the model is playing.
   * @return Whether the model is playing.
   */
  isStatePlaying() {
    return this.state == 'playing';
  }

  /**
   * Set the state of the model to completed.
   */
  setCompleted() {
    this.state = 'completed';
    this.button.showRestartButton();
  }
}