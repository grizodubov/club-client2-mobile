<script lang="ts">
    import { Device } from '@capacitor/device';

    import {
        BarcodeScanner,
    } from '@capacitor-mlkit/barcode-scanning';


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    /* start */
    async function start() {
        const deviceInfo = await getDeviceInfo();
        if (typeof deviceInfo === 'object') {
            if (deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android')) {
                document.querySelector('body')?.classList.add('barcode-scanner-active');
                const listener = await BarcodeScanner.addListener(
                    'barcodeScanned',
                    async (result: any) => {
                        await listener.remove();
                        document.querySelector('body')?.classList.remove('barcode-scanner-active');
                        await BarcodeScanner.stopScan();
                        if (result.barcode) {
                            alert(result.barcode);
                        }
                    },
                );
                await BarcodeScanner.startScan();
            }
        }
    }
</script>


<button
    class="relative w-10 h-10 flex items-center justify-center transition-all text-base-100 rounded-full"
    on:click="{() => {
        start();
    }}"
>
    <slot />
</button>
