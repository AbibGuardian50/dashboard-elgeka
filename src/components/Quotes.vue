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
            <p class="font-bold font-gotham text-3xl text-sulfurblack">Quotes</p>
            <hr>

            <div class="flex flex-col gap-4">
                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Quotes</p>
                    <input class="bg-white border border-black pl-4 py-1 w-full rounded-full" type="text" name="Quotes" id="">
                </div>

                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Author</p>
                    <input class="bg-white border border-black pl-4 py-8 w-full rounded-lg" type="text" name="Author" id="">
                </div>

                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Media</p>
                    <input class="bg-white border border-black pl-4 py-28 w-full rounded-lg" type="text" name="Media" id="">
                </div>
            </div>


        </div>
    </div>
</template>