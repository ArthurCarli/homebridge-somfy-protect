import type { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig } from 'homebridge';
import fetch from 'node-fetch';
import { PLATFORM_NAME } from './settings.js';
import { SomfyAlarmAccessory } from './platform-somfy-alarm.js';

export class SomfyProtectPlatform implements DynamicPlatformPlugin {
  public readonly accessories: PlatformAccessory[] = [];
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.info('Initializing SomfyProtectPlatform...');
    this.api.on('didFinishLaunching', async () => {
      try {
        await this.authenticate();
        await this.discoverDevices();
      } catch (err) {
        this.log.error('Failed to initialize Somfy Protect platform:', err instanceof Error ? err.message : String(err));
      }
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  private async authenticate(): Promise<void> {
    const { clientId, clientSecret, username, password } = this.config;
    if (!clientId || !clientSecret || !username || !password) {
      throw new Error('Missing Somfy Protect OAuth2 credentials in config.');
    }
    this.log.debug('Authenticating with Somfy Protect API...');
    const tokenUrl = 'https://api.myfox.me/oauth2/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('username', username);
    params.append('password', password);
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (!response.ok) {
        throw new Error(`Somfy Protect OAuth2 error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // 1 min early
      this.log.info('Somfy Protect authentication successful.');
    } catch (err) {
      this.log.error('Somfy Protect authentication failed:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  private async getValidAccessToken(): Promise<string> {
    if (!this.accessToken || (this.tokenExpiresAt && Date.now() > this.tokenExpiresAt)) {
      this.log.debug('Access token expired or missing, re-authenticating...');
      await this.authenticate();
    }
    if (!this.accessToken) {
      throw new Error('Unable to obtain Somfy Protect access token.');
    }
    return this.accessToken;
  }

  private async discoverDevices(): Promise<void> {
    this.log.debug('Discovering Somfy Protect devices...');
    const accessToken = await this.getValidAccessToken();
    const url = 'https://api.myfox.me/home';
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        throw new Error(`Somfy Protect device discovery error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        this.log.error('Unexpected device discovery response:', JSON.stringify(data));
        return;
      }
      for (const home of data) {
        if (home && home.id && home.name) {
          this.registerAlarmAccessory(home);
        }
      }
    } catch (err) {
      this.log.error('Failed to discover Somfy Protect devices:', err instanceof Error ? err.message : String(err));
    }
  }

  private registerAlarmAccessory(home: { id: string, name: string }): void {
    const uuid = this.api.hap.uuid.generate(`somfy-protect-alarm-${home.id}`);
    let accessory = this.accessories.find(a => a.UUID === uuid);
    const platformName = this.config.name ?? PLATFORM_NAME;
    if (!accessory) {
      accessory = new this.api.platformAccessory(home.name, uuid);
      this.api.registerPlatformAccessories(platformName, platformName, [accessory]);
      this.log.info('Registered new Somfy Protect alarm accessory:', home.name);
      this.accessories.push(accessory);
    } else {
      this.log.info('Restoring existing Somfy Protect alarm accessory:', home.name);
    }
    accessory.context.device = home;
    new SomfyAlarmAccessory(
      this.log,
      accessory,
      this.config,
      this.api,
      this.createGetAlarmStateFn(home.id),
      this.createSetAlarmStateFn(home.id),
    );
  }

  private createGetAlarmStateFn(homeId: string): () => Promise<boolean> {
    return async () => {
      const accessToken = await this.getValidAccessToken();
      const url = `https://api.myfox.me/home/${homeId}/situation`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        throw new Error(`Failed to get alarm state: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.alarmMode === 'armed';
    };
  }

  private createSetAlarmStateFn(homeId: string): (armed: boolean) => Promise<void> {
    return async (armed: boolean) => {
      const accessToken = await this.getValidAccessToken();
      const url = `https://api.myfox.me/home/${homeId}/alarm`;
      const body = JSON.stringify({ action: armed ? 'arm' : 'disarm' });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      if (!response.ok) {
        throw new Error(`Failed to set alarm state: ${response.status} ${response.statusText}`);
      }
    };
  }
}
