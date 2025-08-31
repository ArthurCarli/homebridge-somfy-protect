import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SomfyAlarmAccessory } from '../src/platform-somfy-alarm';
import type { API, Logger, PlatformAccessory, PlatformConfig, Service } from 'homebridge';

describe('SomfyAlarmAccessory', () => {
  let log: Logger;
  let accessory: PlatformAccessory;
  let config: PlatformConfig;
  let api: API;
  let getAlarmState: ReturnType<typeof vi.fn>;
  let setAlarmState: ReturnType<typeof vi.fn>;
  let service: Service;

  beforeEach(() => {
    log = { info: vi.fn(), error: vi.fn() } as unknown as Logger;
    service = {
      setCharacteristic: vi.fn().mockReturnThis(),
      getCharacteristic: vi.fn().mockReturnValue({ onSet: vi.fn().mockReturnThis(), onGet: vi.fn().mockReturnThis() }),
      updateCharacteristic: vi.fn(),
    } as unknown as Service;
    accessory = {
      displayName: 'Alarm',
      UUID: 'uuid',
      context: {},
      getService: vi.fn().mockReturnValue(service),
      addService: vi.fn().mockReturnValue(service),
    } as unknown as PlatformAccessory;
    config = {} as PlatformConfig;
    api = {
      hap: {
        Service: { Switch: 'Switch', AccessoryInformation: 'AccessoryInformation' },
        Characteristic: { On: 'On', Manufacturer: 'Manufacturer', Model: 'Model', SerialNumber: 'SerialNumber', Name: 'Name' },
      },
    } as unknown as API;
    getAlarmState = vi.fn().mockResolvedValue(false);
    setAlarmState = vi.fn().mockResolvedValue(undefined);
  });

  it('should initialize and set up HomeKit service', () => {
    new SomfyAlarmAccessory(log, accessory, config, api, getAlarmState, setAlarmState);
    expect(accessory.getService).toHaveBeenCalled();
    expect(service.setCharacteristic).toHaveBeenCalledWith('Name', 'Alarm');
  });

  it('should handle arming/disarming', async () => {
    const alarm = new SomfyAlarmAccessory(log, accessory, config, api, getAlarmState, setAlarmState);
    // @ts-expect-error: Accessing private method for test
    await alarm.handleSetOn(true);
    expect(setAlarmState).toHaveBeenCalledWith(true);
    // @ts-expect-error: Accessing private method for test
    await alarm.handleSetOn(false);
    expect(setAlarmState).toHaveBeenCalledWith(false);
  });

  it('should handle getting alarm state', async () => {
    const alarm = new SomfyAlarmAccessory(log, accessory, config, api, getAlarmState, setAlarmState);
    // @ts-expect-error: Accessing private method for test
    const state = await alarm.handleGetOn();
    expect(getAlarmState).toHaveBeenCalled();
    expect(state).toBe(false);
  });
});

