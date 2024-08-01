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


    /* sleep */
    async function sleep(ms) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }


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
                        if (result.barcode) {
                            document.querySelector('html')?.classList.add('barcode-scanner-found');
                            const target = document.getElementById('barcode-scanner-target');
                            const pos = [
                                result.barcode.cornerPoints[0][0] - 4 - 50,
                                result.barcode.cornerPoints[0][1] - 4 - 50,
                            ];
                            const size = [
                                result.barcode.cornerPoints[2][0] - result.barcode.cornerPoints[0][0] + 8 + 100,
                                result.barcode.cornerPoints[2][1] - result.barcode.cornerPoints[0][1] + 8 + 100
                            ];
                            if (target) {
                                target.style.left = pos[0].toString() + 'px';
                                target.style.top = pos[1].toString() + 'px';
                                target.style.width = size[0].toString() + 'px';
                                target.style.height = size[1].toString() + 'px';
                                await sleep(100);
                                pos[0] += 50;
                                pos[1] += 50;
                                size[0] -= 100;
                                size[1] -= 100;
                                target.style.left = pos[0].toString() + 'px';
                                target.style.top = pos[1].toString() + 'px';
                                target.style.width = size[0].toString() + 'px';
                                target.style.height = size[1].toString() + 'px';
                                setTimeout(() => {
                                    target.style.borderStyle = 'solid';
                                }, 600);
                                await sleep(1600);
                            }
                            document.querySelector('html')?.classList.remove('barcode-scanner-found');
                        }
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
