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

                const target = document.getElementById('barcode-scanner-target');

                const targetBoundingClientRect = target?.getBoundingClientRect();
                const scaledRect = targetBoundingClientRect ?
                    {
                        left: targetBoundingClientRect.left * window.devicePixelRatio,
                        right: targetBoundingClientRect.right * window.devicePixelRatio,
                        top: targetBoundingClientRect.top * window.devicePixelRatio,
                        bottom: targetBoundingClientRect.bottom * window.devicePixelRatio,
                        width: targetBoundingClientRect.width * window.devicePixelRatio,
                        height: targetBoundingClientRect.height * window.devicePixelRatio,
                    }
                    : undefined;
                const detectionCornerPoints = scaledRect ?
                    [
                        [ scaledRect.left, scaledRect.top ],
                        [ scaledRect.left + scaledRect.width, scaledRect.top ],
                        [ scaledRect.left + scaledRect.width, scaledRect.top + scaledRect.height ],
                        [ scaledRect.left, scaledRect.top + scaledRect.height ],
                    ]
                    : undefined;

                const listener = await BarcodeScanner.addListener(
                    'barcodeScanned',
                    async (result: any) => {
                        if (result.barcode) {
                            if (target) {
                                const cornerPoints = result.barcode.cornerPoints;
                                if (detectionCornerPoints && cornerPoints) {
                                    if (
                                        detectionCornerPoints[0][0] > cornerPoints[0][0] ||
                                        detectionCornerPoints[0][1] > cornerPoints[0][1] ||
                                        detectionCornerPoints[1][0] < cornerPoints[1][0] ||
                                        detectionCornerPoints[1][1] > cornerPoints[1][1] ||
                                        detectionCornerPoints[2][0] < cornerPoints[2][0] ||
                                        detectionCornerPoints[2][1] < cornerPoints[2][1] ||
                                        detectionCornerPoints[3][0] > cornerPoints[3][0] ||
                                        detectionCornerPoints[3][1] < cornerPoints[3][1]
                                    )
                                        return;
                                    await listener.remove();
                                    const pos = [
                                        [
                                            Math.min(detectionCornerPoints[0][0], detectionCornerPoints[3][0]),
                                            Math.min(detectionCornerPoints[0][1], detectionCornerPoints[1][1]),
                                        ],
                                        [
                                            Math.max(detectionCornerPoints[1][0], detectionCornerPoints[2][0]),
                                            Math.max(detectionCornerPoints[2][1], detectionCornerPoints[3][1]),
                                        ],
                                    ];
                                    const size = [
                                        pos[1][0] - pos[0][0],
                                        pos[1][1] - pos[0][1],
                                    ];
                                    const pixels = {
                                        left: Math.round(pos[0][0] / window.devicePixelRatio) + 25,
                                        top: Math.round(pos[0][1] / window.devicePixelRatio) + 25,
                                        width: Math.round(size[0] / window.devicePixelRatio ) - 50,
                                        height: Math.round(size[1] / window.devicePixelRatio ) - 50,
                                    };
                                    await sleep(100);
                                    target.style.setProperty('left', pixels.left.toString() + 'px');
                                    target.style.setProperty('top', pixels.top.toString() + 'px');
                                    target.style.width = pixels.width.toString() + 'px';
                                    target.style.height = pixels.height.toString() + 'px';
                                    target.style.borderStyle = 'solid';
                                    target.style.borderColor = '#00a96e';
                                    await sleep(1000);
                                    document.querySelector('html')?.classList.remove('barcode-scanner-active');
                                    await BarcodeScanner.stopScan();
                                    target.style.setProperty('left', 'calc(50% - 150px)');
                                    target.style.setProperty('top', 'calc(50% - 150px)');
                                    target.style.width = '300px';
                                    target.style.height = '300px';
                                    target.style.borderStyle = 'dashed';
                                    target.style.borderColor = '#ffbf00';
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
                            }
                        }
                        else {
                            return;
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
