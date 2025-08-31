import type { API, CharacteristicValue, Logger, PlatformAccessory, PlatformConfig, Service } from 'homebridge';

/**
 * SomfyAlarmAccessory
 * Represents a Somfy Protect alarm as a HomeKit accessory (Switch).
 * Allows arming/disarming via HomeKit and syncs state with the Somfy Protect API.
 */
export class SomfyAlarmAccessory {
  private service: Service;
  private isArmed: boolean = false;

  constructor(
    private readonly log: Logger,
    private readonly accessory: PlatformAccessory,
    private readonly config: PlatformConfig,
    private readonly api: API,
    private readonly getAlarmState: () => Promise<boolean>,
    private readonly setAlarmState: (armed: boolean) => Promise<void>,
  ) {
    this.log.info('Initializing SomfyAlarmAccessory:', accessory.displayName);
    // Set accessory information
    this.accessory.getService(this.api.hap.Service.AccessoryInformation)!
      .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Somfy')
      .setCharacteristic(this.api.hap.Characteristic.Model, 'Protect Alarm')
      .setCharacteristic(this.api.hap.Characteristic.SerialNumber, accessory.UUID);

    // Setup HomeKit Switch service
    this.service = this.accessory.getService(this.api.hap.Service.Switch)
      || this.accessory.addService(this.api.hap.Service.Switch);
    this.service.setCharacteristic(this.api.hap.Characteristic.Name, accessory.displayName);
    this.service.getCharacteristic(this.api.hap.Characteristic.On)
      .onSet(this.handleSetOn.bind(this))
      .onGet(this.handleGetOn.bind(this));
    // Start polling for state
    this.pollState();
  }

  /**
   * Handle HomeKit requests to arm/disarm the alarm.
   */
  private async handleSetOn(value: CharacteristicValue) {
    const targetState = !!value;
    try {
      await this.setAlarmState(targetState);
      this.isArmed = targetState;
      this.log.info(`Alarm state set to: ${targetState ? 'ARMED' : 'DISARMED'}`);
    } catch (err) {
      this.log.error('Failed to set alarm state:', err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Handle HomeKit requests to get the current alarm state.
   */
  private async handleGetOn(): Promise<CharacteristicValue> {
    try {
      this.isArmed = await this.getAlarmState();
    } catch (err) {
      this.log.error('Failed to get alarm state:', err instanceof Error ? err.message : String(err));
    }
    return this.isArmed;
  }

  /**
   * Poll the Somfy Protect API to keep HomeKit state in sync.
   */
  private pollState() {
    setInterval(async () => {
      try {
        const current = await this.getAlarmState();
        if (this.isArmed !== current) {
          this.isArmed = current;
          this.service.updateCharacteristic(this.api.hap.Characteristic.On, this.isArmed);
        }
      } catch (err) {
        this.log.error('Error polling alarm state:', err instanceof Error ? err.message : String(err));
      }
    }, 30000); // Poll every 30 seconds
  }
}
