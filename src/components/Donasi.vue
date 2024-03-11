<script>
import Sidebar from "./Sidebar.vue"

export default {
    components: {
        Sidebar
    },
}
</script>

<template>
    <div class="flex">
        <sidebar />

        <div class="ml-8 w-[1042px]">
            <p class="font-bold font-gotham text-3xl text-sulfurblack">Donasi</p>
            <hr>

            <div class="flex flex-col gap-4">
                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Link</p>
                    <input class="bg-grey pl-4 py-1 w-full rounded-full" type="text" name="Link" id="">
                </div>

                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Deskripsi</p>
                    <input class="bg-grey pl-4 py-8 w-full rounded-lg" type="text" name="Deskripsi" id="">
                </div>

                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Media</p>
                    <input class="bg-grey pl-4 py-28 w-full rounded-lg" type="text" name="Media" id="">
                </div>
            </div>


        </div>
    </div>
</template>