<script>
import VueCookies from 'vue-cookies';
export default {
    methods: {
        logout() {
        // Hapus token dari localStorage atau dari state aplikasi
        VueCookies.remove('tokenlogin'); // Contoh jika token disimpan di localStorage atau cookies
        VueCookies.remove('superAdmin');
        VueCookies.remove('email');
        VueCookies.remove('fullname');
        VueCookies.remove('id_user');
        VueCookies.remove('status_akun');
        // Lakukan langkah lain yang diperlukan saat logout
    },
    
    }
}
</script>

<template>
    <div class="flex">
        <div class="bg-teal flex flex-col items-center pt-8 w-[310px] max-[1800px]:h-full h-screen">
            <div>
                <img class="mb-8 rounded-md" src="../assets/logoElgekaPutih1.png" alt="">
                <div class="flex flex-col items-start mr-32">
                    <p class="text-left font-gotham font-semibold italic text-white mr-12">General</p>
                </div>

                <div>
                    <div class="flex flex-col gap-2 pt-4">
                        <router-link to="/kelolaakun">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Kelola
                                Akun</button>
                        </router-link>

                        <router-link to="/verifikasicerita">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Verifikasi
                                Cerita</button>
                        </router-link>

                        <router-link to="/profilkomunitas">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Profil
                                Komunitas</button>
                        </router-link>

                        <!-- <router-link to="/komunitas">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Komunitas</button>
                        </router-link> -->

                        <router-link to="/quotes">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Quotes</button>
                        </router-link>

                        <router-link to="/berita">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Berita</button>
                        </router-link>

                        <router-link to="/donasi">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Donasi</button>
                        </router-link>

                        <router-link to="/kegiatan">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Kegiatan</button>
                        </router-link>

                        <router-link to="/peraturancerita">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Peraturan
                                Cerita</button>
                        </router-link>

                        <router-link to="/penguruskomunitas">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Pengurus Komunitas</button>
                        </router-link>

                        <router-link to="/editprofiladmin">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Edit Profil</button>
                        </router-link>

                    </div>
                </div>
            </div>

            <div class="flex justify-start mt-auto max-[1800px]:pt-12 items-start pb-8">
                <router-link to="/">
                    <div class="flex justify-start gap-2">
                        <img src="../assets/logout-logo.png" alt="Logo Logout">
                        <p @click="logout" class="text-white font-inter font-bold text-base">Keluar</p>
                    </div>
                </router-link>
            </div>






            <!-- height: 50px;
    position: absolute;
    width: 100%;
    bottom: 0;
    list-style-type: none;
    padding-bottom: 2.5em; -->

        </div>
    </div>
</template>