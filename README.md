<p align="center">

<img src="https://github.com/homebridge/branding/raw/latest/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

<span align="center">

# Homebridge Somfy Protect Plugin

</span>

Integrate your Somfy Protect devices with Homebridge and HomeKit, enabling control and monitoring from Apple Home and
Siri.

## Features

- Discover and control Somfy Protect alarms and sensors from HomeKit
- Arm/disarm your Somfy Protect system via HomeKit automations
- Monitor status and receive notifications in HomeKit
- Support for multiple Somfy Protect devices

## Installation

1. Ensure you have Homebridge v1.8.0 or v2.0.0-beta.0 and Node.js >= 18 installed.
2. Install the plugin via Homebridge UI or with npm:
   ```shell
   npm install -g homebridge-somfy-protect
   ```
3. Restart Homebridge.

## Configuration

Add the platform to your Homebridge `config.json`:

```json
{
  "platforms": [
    {
      "platform": "SomfyProtectPlatform", // Must match PLATFORM_NAME in settings.ts
      "email": "your-somfy-email@example.com",
      "password": "your-somfy-password",
      "devices": [
        // Optional: List of device IDs to include
      ]
    }
  ]
}
```

- `email` and `password`: Your Somfy Protect account credentials
- `devices`: (Optional) Array of device IDs to include. If omitted, all supported devices will be discovered.

## Usage

- After configuration and restart, your Somfy Protect devices will appear in HomeKit.
- You can arm/disarm the alarm, view sensor status, and use HomeKit automations.
- For advanced configuration, see the plugin options in the Homebridge UI.

## Troubleshooting

- Ensure your Somfy Protect credentials are correct.
- Check Homebridge logs for errors or warnings.
- For support, open an issue on the [GitHub repository](https://github.com/ArthurCarli/homebridge-somfy-protect/issues).

## License

MIT
