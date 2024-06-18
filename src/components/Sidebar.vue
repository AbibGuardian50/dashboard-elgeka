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
        toggleHamburgerMenu() {
            this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
            const menusidebar = document.querySelector('#menu-sidebar')
            const menu = document.querySelector('#menu')
            menusidebar.classList.toggle('hidden');
            menu.classList.toggle('hidden');
        },

    }
}
</script>

<template>
    <div class="flex max-[520px]:max-w-[230px] max-[520px]:min-w-[70px]">
        <div class="bg-teal flex flex-col items-center pt-8 md:w-full max-[520px]:min-w-[70px] min-w-[70px] max-[1800px]:h-full h-screen">
            <div class="flex flex-col items-center">
                <img class="mb-8 rounded-md flex items-center justify-center max-md:w-[60px] max-md:h-[60px]" src="../assets/logoElgekaPutih1.png" alt="">
                <svg xmlns="http://www.w3.org/2000/svg" id="menu-button" @click="toggleHamburgerMenu"
                    class="h-6 w-6 cursor-pointer min-[965px]:hidden block border border-white w-[40px] rounded-md h-[40px]"
                    fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div class="flex flex-col items-start ml-4 mr-32">
                    <p class="text-left font-gotham font-semibold italic text-white mr-12 hidden min-[965px]:block" id="menu">General</p>
                </div>
                
                <div class="hidden min-[965px]:block" id="menu-sidebar">
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
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Pengurus
                                Komunitas</button>
                        </router-link>

                        <router-link to="/editprofiladmin">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-inter focus:font-bold font-gotham font-bold text-white opacity-70">Edit
                                Profil</button>
                        </router-link>

                    </div>
                </div>
            </div>

            <div class="flex justify-start mt-auto max-[1800px]:pt-12 items-start pb-8">
                <router-link to="/">
                    <div @click="logout" class="flex justify-start gap-2">
                        <img src="../assets/logout-logo.png" alt="Logo Logout">
                        <p class="text-white font-inter font-bold text-base max-[965px]:hidden">Keluar</p>
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