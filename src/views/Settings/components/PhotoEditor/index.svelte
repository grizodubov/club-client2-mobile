<script lang="ts">
    import { Camera, CameraResultType } from '@capacitor/camera';

    import { Device } from '@capacitor/device';

    import Cropper from "svelte-easy-crop";
	import getCroppedImg from "./canvasUtils";

    import { infoHide } from '@/helpers/info';

    import { user, token } from '@/stores';


    // svelte-ignore unused-export-let
    export let params: { [key: string]: any } | undefined = undefined; params;


    let crop = { x: 0, y: 0 };
    let zoom = 1;
    let image, fileinput, pixelCrop, croppedImage;

    let photoLoading = false;


    /* onFileSelected */
    function onFileSelected(e) {
        let imageFile = e.target.files[0];
        let reader = new FileReader();
        reader.onload = e => {
            if (e && e.target)
                image = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    }


    let profilePicture, style;


    /* previewCrop */
    function previewCrop(e) {
        pixelCrop = e.detail.pixels;
        const { x, y, width } = e.detail.pixels;
        const scale = 96 / width;
        profilePicture.style = `margin: ${-y * scale}px 0 0 ${-x * scale}px; width: ${profilePicture.naturalWidth * scale}px;`;
    }


    /* getDeviceInfo */
    const getDeviceInfo = async () => {
        return await Device.getInfo();
    };


    /* takePicture */
    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Uri
        });

        // image.webPath will contain a path that can be set as an image src.
        // You can access the original file using image.path, which can be
        // passed to the Filesystem API to read the raw data of the image,
        // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
        // var imageUrl = image.webPath;

        // Can be set to the src of an image now
        // imageElement.src = imageUrl;

        return image.webPath;
    };


    /* uploadAvatar */
    async function uploadAvatar(avatarUrl) {
        photoLoading = true;
        const f = await fetch(avatarUrl).then(r => r.blob());
        const data = new FormData();
        data.append('avatar', f, 'avatar.jpg');
        data.append('token', token.pull('token'));
        data.append('owner_id', user.pull('id'));
        const response = await fetch(
            'https://media.clubgermes.ru:5017/new/upload/avatar',
            {
                method: 'POST',
                body: data,
            }
        );
        await response.json();
        photoLoading = false;
        if (params && params.onUpload)
            params.onUpload();
        infoHide();
    }


    /* chooseFile */
    async function chooseFile() {
        const deviceInfo = await getDeviceInfo();
        if (typeof deviceInfo === 'object' && deviceInfo.platform && (deviceInfo.platform == 'ios' || deviceInfo.platform == 'android')) {
            image = await takePicture();
        }
        else {
            if (fileinput)
                fileinput.click();
        }
    }


    /* reset */
    function reset() {
        croppedImage = null;
        image = null;
    }
</script>


<div class="w-full h-full flex flex-col px-2">

    <div class="w-full flex justify-end shrink-0 grow-0 py-4 px-2 border-b border-base-200">
        <button
            class="w-7 h-7 text-base-300"
            on:click="{() => {
                infoHide();
            }}"
        >
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z" fill="currentColor"></path></svg>
        </button>
    </div>

    <div class="wrapper w-full h-full px-3 py-5 flex flex-col justify-between">
        <div class="relative w-full h-full">
            {#if image}
                <Cropper
                    {image}
                    bind:crop 
                    bind:zoom
                    on:cropcomplete="{previewCrop}"
                    aspect="{1}"
                    maxZoom="{5}"
                />
            {:else}
                <div class="w-full h-full font-extralight bg-stone-200 text-white flex justify-center items-center"><span>Выберите файл</span></div>
            {/if}
        </div>
        <div class="h-24 my-5 flex justify-between items-start shrink-0 grow-0">
            <div class="relative overflow-hidden w-24 h-24 rounded-full">
                <img
                    bind:this="{profilePicture}"
                    class="absolute max-w-none"
                    src="{image ? image : undefined}"
                    alt=""
                    {style}
                />
            </div>
            <input id="photo" name="photo" style="display: none;" type="file" accept="image/png, image/jpeg" on:change={onFileSelected} bind:this={fileinput} />
            <button
                class="btn btn-sm text-base-100"
                class:btn-front="{!photoLoading}"
                disabled="{photoLoading}"
                on:click={chooseFile}
            >Выбрать</button>
        </div>
        {#if photoLoading}
            <div class="h-8 w-full flex items-center justify-center shrink-0 grow-0">
                <span class="loading loading-bars text-front"></span>
            </div>
        {:else}
            <div class="flex items-center justify-between w-full shrink-0 grow-0">
                <button
                    class="btn btn-sm btn-error text-base-100"
                    on:click="{
                        () => {
                            reset();
                            infoHide();
                        }
                    }"
                >Отменить</button>
                <button
                    class="btn btn-sm text-base-100"
                    class:btn-front="{image}"
                    on:click="{
                        async () => {
                            croppedImage = await getCroppedImg(image, pixelCrop);
                            uploadAvatar(croppedImage);
                        }
                    }"
                    disabled="{!image}"
                >Загрузить</button>
            </div>
        {/if}
    </div>


</div>
