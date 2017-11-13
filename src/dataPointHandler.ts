import { Trial } from './trial';
import { WISEAPI } from './wiseAPI';

/**
 * The class that handles the temperature data points and sends them to WISE.
 */
export class DataPointHandler {

  // an array of temperature data points for the cup
  cupTemperatures: any[];

  // an array of temperature data points for the counter
  counterTemperatures: any[];

  // the trial object that we will send to WISE
  trial: object;

  // the API we use to send data to WISE
  wiseAPI: object;

  constructor() {
    this.trial = new Trial();
    this.wiseAPI = new WISEAPI();
    this.cupTemperatures = [[0,60],[1,53],[2,48],[3,44],[4,41],[5,39],[6,37],[7,35.5],[8,34],[9,32.8],[10,31.8],[11,31.2],[12,30.8],[13,30.5],[14,30.2],[15,30]];
    this.counterTemperatures = [[0,20],[1,23],[2,25],[3,26.5],[4,27.3],[5,27.8],[6,28.2],[7,28.5],[8,28.8],[9,29.1],[10,29.3],[11,29.5],[12,29.7],[13,29.8],[14,29.9],[15,30]];
  }

  /**
   * Get the cup temperature at a specific time.
   * @param time The time we want the data point for. This will be an integer.
   * @return An array containing the time and temperature like
   * [time, temperature]
   */
  getCupTemperatureDataPoint(time) {
    return this.cupTemperatures[time];
  }

  /**
   * Get the counter temperature at a specific time.
   * @param time The time we want the data point for. This will be an integer.
   * @return An array containing the time and temperature like
   * [time, temperature]
   */
  getCounterTemperatureDataPoint(time) {
    return this.counterTemperatures[time];
  }

  /**
   * Get the temperature of the cup at a specific time.
   * @param time The time we want the temperature for. This will be an integer.
   * @return A float value representing the temperature in Celsius like 31.8
   */
  getCupTemperature(time) {
    return this.getDataPointY(this.cupTemperatures[time]);
  }

  /**
   * Get the temperature of the counter at a specific time.
   * @param time The time we want the temperature for. This will be an integer.
   * @return A float value representing the temperature in Celsius like 29.3
   */
  getCounterTemperature(time) {
    return this.getDataPointY(this.counterTemperatures[time]);
  }

  /**
   * Get the x value of the data point.
   * @param dataPoint An array containing two values. The first being x, and the
   * second being y like [x, y].
   * @return The x value of the data point.
   */
  getDataPointX(dataPoint) {
    return dataPoint[0];
  }

  /**
   * Get the y value of the data point.
   * @param dataPoint An array containing two values. The first being x, and the
   * second being y like [x, y].
   * @return the y value of the data point.
   */
  getDataPointY(dataPoint) {
    return dataPoint[1];
  }

  /**
   * Add the data points at the given time to the trial object.
   * @param time Add the data points at this specific time.
   */
  addDataPointsToTrial(time) {
    let cupTemperatureDataPoint = this.getCupTemperatureDataPoint(time);
    let counterTemperatureDataPoint = this.getCounterTemperatureDataPoint(time);
    this.trial.addDataPointToCupSeries(this.getDataPointX(cupTemperatureDataPoint), this.getDataPointY(cupTemperatureDataPoint));
    this.trial.addDataPointToCounterSeries(this.getDataPointX(counterTemperatureDataPoint), this.getDataPointY(counterTemperatureDataPoint));
  }

  /**
   * Send the intial temperatures to WISE so that the graph immediately displays
   * the temperatures at time 0. This function is only called when the model
   * has finished running and is being reset.
   */
  intializeAndSendTrial() {
    // intialize the trial to clear out all of its data points
    this.trial.initializeTrial();

    // send the temperatures at time 0
    this.updateAndSendTrial(0);

    /*
     * Initialize the trial again. We need to do this because when the model
     * starts running, it will call sendTemperatures(0). We do not want our
     * previous call to sendTemperatures(0) right above this to persists because
     * then we will have called sendTemperatures(0) two times in a row.
     */
    this.trial.initializeTrial();
  }

  /**
   * Update the trial and send it to WISE.
   * @param time Add the temperatures for this time point.
   */
  updateAndSendTrial(time) {
    // update the trial to add the new temperature data points.
    this.addDataPointsToTrial(time);
    this.wiseAPI.save(this.trial.toJsonObject());
  }
}
