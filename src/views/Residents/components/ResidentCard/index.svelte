<script lang="ts">
    import { Avatar } from '@/components';

    import { nameNormalization } from '@/utils/names';


    export let resident: { [key: string]: any };


    /* info */
    function info() {
        let temp = '';
        if (resident.position)
            temp += resident.position.toUpperCase();
        if (resident.company)
            temp += temp ? ' / ' + resident.company.toUpperCase() : resident.company.toUpperCase();
        return temp;
    }
</script>


<div class="flex items-center px-4">
    <div class="w-[64px] h-[64px] shrink-0 grow-0">
        <Avatar user="{{
            id: resident.id,
            name: resident.name,
            avatar_hash: resident.avatar_hash,
            roles: [ 'client' ],
            telegram: '',
        }}" />
    </div>
    <div class="ml-4 shrink-1 grow-1">
        <div class="font-medium text-[17px] leading-[22px]">{nameNormalization(resident.name, 2)}</div>
        <div class="text-[10px] mt-[3px]">{info()}</div>
    </div>
</div>
