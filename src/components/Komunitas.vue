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
        <Sidebar />

        <div>
            <p>Update Komunitas</p>
            <hr>
            <p>Tentang Komunitas</p>

            <div>
                <div class="flex flex-col">
                    <div class="flex">
                        <img src="../assets/tomple.png" alt="">
                        <img src="../assets/tomple.png" alt="">
                    </div>
                    <p>Profil Komunitas</p>
                </div>
            </div>

            <div>
                <div class="flex flex-col">
                    <div class="flex">
                        <img src="../assets/tomple.png" alt="">
                        <img src="../assets/tomple.png" alt="">
                    </div>
                    <p>Kegiatan Komunitas</p>
                </div>
            </div>

            <div>
                <div class="flex flex-col">
                    <div class="flex">
                        <img src="../assets/tomple.png" alt="">
                        <img src="../assets/tomple.png" alt="">
                    </div>
                    <p>Peraturan Unggah Cerita</p>
                </div>
            </div>
        </div>
    </div>
</template>