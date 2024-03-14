<script>
import Sidebar from './Sidebar.vue'
import axios from 'axios'

export default {
    components: {
        Sidebar
    },
    data() {
        return {
            profilkomunitas: [],
            ShowEditProfilKomunitas: false,
            ShowEditFotoSampul: false,
            url: 'https://elgeka-web-api-production.up.railway.app/',
        }
    },
    methods: {
        toggleModalEditProfilKomunitas: function () {
            this.ShowEditProfilKomunitas = !this.ShowEditProfilKomunitas;
        },
        toggleModalEditFotoSampul: function () {
            this.ShowEditFotoSampul = !this.ShowEditFotoSampul;
        },
    },
    async created() {
        try {
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/profilKomunitas');
            this.profilkomunitas = response.data.result;
            // this.parsed_aturanblog = this.aturanblog.split("\n");
            console.log(this.profilkomunitas)
        } catch (error) {
            console.error(error);
        }
    },
}
</script>

<template>
    <div class="flex">
        <Sidebar />
        <div class="pl-8 pt-12">
            <p class="w-full font-gotham font-bold text-[30px] leading-6 mb-8 border-b border-black">Update Komunitas</p>
            
            <p class="font-gotham font-normal text-xl leading-6">Tentang Komunitas</p>

            <div id="container" class="flex">
                <div class="flex flex-col justify-center items-center m-auto">
                    <!-- Ubah profil komunitas -->
                    <div v-if="profilkomunitas.currentPage === 1"
                        class="bg-[#FF6200B2] flex absolute px-32 pb-2 w-[1022px] left-[24rem] top-[10rem] isolate rounded-xl bg-orange/75 shadow-lg ring-1 ring-black/5">
                        <div>
                            <p class="font-bold font-poppins text-[40px] text-white text-center pt-4">PROFILE</p>
                            <p class="font-bold font-poppins text-[40px] text-white text-center pb-4">{{
                                profilkomunitas.data.title
                            }}</p>
                            <p class="text-[16px] text-[#FFFFFFB2] font-normal font-poppins leading-6 pb-4 ">{{
                                profilkomunitas.data.content
                            }}</p>
                        </div>

                        <div class="mt-4 right-4 absolute flex flex-col gap-4">
                            <a :href="profilkomunitas.data.ig_link" target="_blank"><img class="w-[35px] h-[35px]"
                                    src="../assets/Logo-Instagram.png" alt="Instagram"></a>
                            <a :href="profilkomunitas.data.fb_link" target="_blank"><img class="w-[35px] h-[35px]"
                                    src="../assets/Logo-Facebook.png" alt="Facebook"></a>
                            <a :href="profilkomunitas.data.twitter_link" target="_blank"><img class="w-[35px] h-[35px]"
                                    src="../assets/Logo-X.png" alt="Twitter"></a>
                        </div>

                        <div>
                            <button v-on:click="toggleModalEditProfilKomunitas()"
                                class="absolute top-[25rem] right-[1rem] bg-white py-2 px-8 font-poppins font-bold text-xl leading-6 rounded-lg text-orange">Edit</button>
                        </div>
                    </div>

                    <!-- Ubah Foto Sampul -->
                    <div v-if="profilkomunitas.currentPage === 1"
                        class="bg-[#FF6200B2] flex absolute w-[1022px] left-[24rem] top-[40rem] isolate rounded-xl bg-orange/75 shadow-lg ring-1 ring-black/5">
                        <div class="flex ">
                            <img class="max-w-[340px] p-4 max-h-[200px]" :src="url + profilkomunitas.data.image_url" alt="foto-sampul">
                            <div>
                                <p class="font-bold font-poppins text-[40px] text-white text-center pt-4">Ubah Foto Sampul
                                </p>
                                <p class="text-[16px] text-[#FFFFFFB2] font-normal font-poppins leading-6 pb-4 ">Terakhir
                                    Diubah : {{
                                        profilkomunitas.data.updatedAt
                                    }}</p>
                            </div>

                            <div>
                            <button v-on:click="toggleModalEditFotoSampul()"
                                class="absolute top-[9rem] right-[1rem] bg-white py-2 px-8 font-poppins font-bold text-xl leading-6 rounded-lg text-orange">Edit</button>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pop up modal buat edit foto sampul... -->
        <div>
            <div v-if="ShowEditFotoSampul"
                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                <div class="relative w-auto my-6 mx-auto max-w-6xl">
                    <!--content-->
                    <div
                        class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <!--header-->
                        <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                            <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                Edit Profil Komunitas
                            </h3>
                            <button
                                class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                v-on:click="toggleModalEditFotoSampul()">
                                <span
                                    class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                </span>
                            </button>
                        </div>
                        <!--body-->
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Foto" class="font-poppins font-bold text-base text-orange">Foto
                                </label>
                                <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                    name="Foto" id="" placeholder="Foto">
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                            <router-link to="/createcerita"><button
                                    class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                    type="button">
                                    Simpan
                                </button></router-link>
                            <button
                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button" v-on:click="toggleModalEditFotoSampul()">
                                batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="ShowEditFotoSampul" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>

        <!-- Pop up modal buat edit profil komunitas... -->
        <div>
            <div v-if="ShowEditProfilKomunitas"
                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                <div class="relative w-auto my-6 mx-auto max-w-6xl">
                    <!--content-->
                    <div
                        class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <!--header-->
                        <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                            <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                Edit Profil Komunitas
                            </h3>
                            <button
                                class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                v-on:click="toggleModalEditProfilKomunitas()">
                                <span
                                    class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                </span>
                            </button>
                        </div>
                        <!--body-->
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Judul" class="font-poppins font-bold text-base text-orange">Judul
                                </label>
                                <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                    name="Judul" id="" placeholder="Judul">
                            </div>
                        </div>

                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Deskripsi Komunitas"
                                    class="font-poppins font-bold text-base text-orange">Deskripsi Komunitas
                                </label>
                                <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                    name="Deskripsi Komunitas" id="" placeholder="Deskripsi Komunitas">
                            </div>
                        </div>

                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Link Instagram" class="font-poppins font-bold text-base text-orange">Link
                                    Instagram
                                </label>
                                <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                    name="Link Instagram" id="" placeholder="Link Instagram">
                            </div>
                        </div>

                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Link Facebook" class="font-poppins font-bold text-base text-orange">Link
                                    Facebook
                                </label>
                                <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                    name="Link Facebook" id="" placeholder="Link Facebook">
                            </div>
                        </div>

                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Link Twitter" class="font-poppins font-bold text-base text-orange">Link Twitter
                                </label>
                                <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                    name="Link Twitter" id="" placeholder="Link Twitter">
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                            <router-link to="/createcerita"><button
                                    class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                    type="button">
                                    Simpan
                                </button></router-link>
                            <button
                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button" v-on:click="toggleModalEditProfilKomunitas()">
                                batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="ShowEditProfilKomunitas" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    </div>
</template>

<style scoped>
#container {
    background: url("../assets/kerjasama.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: auto;
}</style>