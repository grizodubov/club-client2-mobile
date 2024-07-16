import { CapacitorUpdater } from '@capgo/capacitor-updater'

export class LiveUpdates {
    public static capgoChannel: string;
    public static capgoDeviceId: string;
    public static capgoBundleVersion: string;

    /* CapgoGetDeviceId */
    public static async capgoGetDeviceId() {
        const capgoGetDeviceId = (await CapacitorUpdater.getDeviceId()).deviceId;
        if (capgoGetDeviceId) {
            LiveUpdates.capgoDeviceId = capgoGetDeviceId;
        }
    };

    /* CapgoGetBundleVersion */
    public static async getBundleVersion() {
        const capgoBundleVersion = (await CapacitorUpdater.current());
        if (capgoBundleVersion.bundle.version) {
            LiveUpdates.capgoBundleVersion = capgoBundleVersion.bundle.version;
        } else if (capgoBundleVersion.native) {
            LiveUpdates.capgoBundleVersion = capgoBundleVersion.native;
        }
    };

    /* CapgoGetChannel */
    public static async getChannel() {
        const capgoChannel = (await CapacitorUpdater.getChannel()).channel;
        console.log('capgoChannel', capgoChannel)
        if (capgoChannel) {
            LiveUpdates.capgoChannel = capgoChannel;
            console.log('LiveUpdates.capgoChannel', LiveUpdates.capgoChannel)
        }
    };

    public static async updateChannel() {
        const capgoChannel = (await CapacitorUpdater.getChannel()).channel;
        if (capgoChannel) {
            LiveUpdates.capgoChannel = capgoChannel;
        }
        if (LiveUpdates.capgoChannel !== 'development') {
            try {
                await CapacitorUpdater.setChannel({ channel: 'development' })
            }
            catch {
                return;
            }
        } else {
            try {
                await CapacitorUpdater.unsetChannel({triggerAutoUpdate: false})
            }
            catch {
                return;
            }
        }
    };
}
