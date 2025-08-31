import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SomfyProtectPlatform } from '../src/platform-somfy-protect';
import type { API, Logger, PlatformConfig, PlatformAccessory } from 'homebridge';

function createMockLogger(): Logger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    log: vi.fn(),
  } as unknown as Logger;
}

function createMockAPI(): API {
  return {
    hap: {
      uuid: { generate: (s: string) => s },
      Service: {},
      Characteristic: {},
    },
    on: vi.fn(),
    registerPlatformAccessories: vi.fn(),
    platformAccessory: vi.fn((name, uuid) => ({ displayName: name, UUID: uuid, context: {}, getService: vi.fn(), addService: vi.fn() })),
  } as unknown as API;
}

describe('SomfyProtectPlatform', () => {
  let log: Logger;
  let api: API;
  let config: PlatformConfig;

  beforeEach(() => {
    log = createMockLogger();
    api = createMockAPI();
    config = { name: 'TestPlatform', clientId: 'id', clientSecret: 'secret', username: 'user', password: 'pass' } as PlatformConfig;
  });

  it('should initialize and register event handler', () => {
    new SomfyProtectPlatform(log, config, api);
    expect(api.on).toHaveBeenCalledWith('didFinishLaunching', expect.any(Function));
  });

  it('should add accessory to cache', () => {
    const platform = new SomfyProtectPlatform(log, config, api);
    const accessory = { displayName: 'Alarm', UUID: 'uuid', context: {}, getService: vi.fn(), addService: vi.fn() } as unknown as PlatformAccessory;
    platform.configureAccessory(accessory);
    expect(platform.accessories).toContain(accessory);
  });
});

