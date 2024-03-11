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

            <div class="ml-8  flex flex-col justify-center items-center w-full mt-8">
                <div class="bg-orange py-4 mb-4 w-[1080px] m-auto justify-center rounded-md">
                    <div class="flex flex-col items-center ">
                        <div class="flex gap-4">
                            <img src="../assets/tomple.png" alt="">
                            <img src="../assets/tomple.png" alt="">
                        </div>
                        <p class="font-poppins font-bold text-2xl text-black text-center">Profil Komunitas</p>
                    </div>
                </div>

                <div class="bg-orange py-4 mb-4 w-[1080px] m-auto justify-center rounded-md">
                    <div class="flex flex-col items-center ">
                        <div class="flex gap-4">
                            <img src="../assets/tomple.png" alt="">
                            <img src="../assets/tomple.png" alt="">
                        </div>
                        <p class="font-poppins font-bold text-2xl text-black text-center">Kegiatan Komunitas</p>
                    </div>
                </div>

                <div class="bg-orange py-4 mb-4 w-[1080px] m-auto justify-center rounded-md">
                    <div class="flex flex-col items-center ">
                        <div class="flex gap-4">
                            <img src="../assets/tomple.png" alt="">
                            <img src="../assets/tomple.png" alt="">
                        </div>
                        <p class="font-poppins font-bold text-2xl text-black text-center">Peraturan Unggah Cerita</p>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>