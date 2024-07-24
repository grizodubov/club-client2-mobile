<script lang="ts">
    import { Device } from '@capacitor/device';

    import {
        BarcodeScanner,
    } from '@capacitor-mlkit/barcode-scanning';

    import { router } from '@/libs/Router';

    import { Entity, collector } from '@/helpers/entity';

    import {
		QREventRegistration,
	} from '@/queries/qr';


    /* DATA: QREventRegistrationHandler */
	const QREventRegistrationHandler = new Entity({
		model: QREventRegistration.model,
		retriever: QREventRegistration.retriever,
	});


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    /* start */
    async function start() {
        const deviceInfo = await getDeviceInfo();
        if (typeof deviceInfo === 'object') {
            if (deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android')) {
                document.querySelector('html')?.classList.add('barcode-scanner-active');
                const listener = await BarcodeScanner.addListener(
                    'barcodeScanned',
                    async (result: any) => {
                        await listener.remove();
                        document.querySelector('html')?.classList.remove('barcode-scanner-active');
                        await BarcodeScanner.stopScan();
                        if (result.barcode) {
                            if (result.barcode.displayValue) {
                                let data: any = null;
                                try {
                                    data = JSON.parse(result.barcode.displayValue);
                                }
                                catch (error: unknown) {
                                    return;
                                }
                                process(data);
                            }
                        }
                    },
                );
                await BarcodeScanner.startScan();
            }
            else {
                document.querySelector('html')?.classList.add('barcode-scanner-active');
            }
        }
    }


    /* process */
    function process(data: any) {
        if (data.type == 'user') {
            processUser(data);
        }
        else if (data.type == 'event') {
            processEvent(data);
        }
    }


    /* processUser */
    function processUser(data: any) {
        if (data.method == 'profile') {
            router.go('/residents/' + data.id.toString());
        }
    }


    /* processEvent */
    function processEvent(data: any) {
        if (data.method == 'registration') {
            collector.get([
                [ 
                    QREventRegistrationHandler,
                    {
                        eventId: data.id,
                    }
                ],
            ]);
            router.go('/events/' + data.id.toString());
        }
    }
</script>


<button
    class="relative transition-all text-base-100"
    on:click="{() => {
        start();
    }}"
>
    <slot />
</button>
