import * as $ from 'jquery';

/**
 * The button that handles playing, pausing, resuming, and restarting the model.
 */
export class Button {

  /*
   * The model which we need a reference to in order to play, pause, resume, and
   * stop it.
   */
  cupCounterModel: object;

  /**
   * Constructor that sets up the button click event listener.
   * @param cupCounterModel The cup counter model.
   */
  constructor(cupCounterModel: object) {
    this.cupCounterModel = cupCounterModel;

    $('#button').on('click', () => {
      let state: string = this.cupCounterModel.getState();
      if (state == 'initialized') {
        // the model is initialized so we will now start playing it
        this.cupCounterModel.play();
        this.showPauseButton();
      } else if (state == 'playing') {
        // the model is playing so we will now pause it
        this.cupCounterModel.pause();
        this.showPlayButton();
      } else if (state == 'paused') {
        // the model is paused so we will now resume playing it
        this.cupCounterModel.resume();
        this.showPauseButton();
      } else if (state == 'completed') {
        // the model is completed so we will initialize it and start playing it
        this.cupCounterModel.restart();
        this.showPauseButton();
      }
    });
  }

  /**
   * Show the the play icon on the button.
   */
  showPlayButton() {
    this.setButtonIcon('play_arrow');
  }

  /**
   * Show the pause icon on the button.
   */
  showPauseButton() {
    this.setButtonIcon('pause');
  }

  /**
   * Show the restart icon on the button.
   */
  showRestartButton() {
    this.setButtonIcon('replay');
  }

  /**
   * Set the material design icon.
   * @param text The text for the material design icon.
   */
  setButtonIcon(text: string) {
    $('#buttonIcon').html(text);
  }

  /**
   * The model has been paused.
   */
  modelPaused() {
    this.showPlayButton();
  }

  /**
   * The model is now playing.
   */
  modelPlayed() {
    this.showPauseButton();
  }
}
