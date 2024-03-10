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

        <div class="ml-8">
            <p class="font-bold font-gotham text-3xl text-sulfurblack">Quotes</p>
            <hr>

            <div>
                <p>Quotes</p>
                <input class="bg-grey w-full" type="text" name="Quotes" id="">
            </div>

            <div>
                <p>Deskripsi</p>
                <input class="bg-grey w-full" type="text" name="Deskripsi" id="">
            </div>

            <div>
                <p>Media</p>
                <input class="bg-grey w-full" type="text" name="Media" id="">
            </div>
        </div>
    </div>
</template>