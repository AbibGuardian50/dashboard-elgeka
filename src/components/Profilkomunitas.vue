<script>
import Sidebar from './Sidebar.vue'
import moment from 'moment';
import 'moment/locale/id';
import VueCookies from 'vue-cookies';
import axios from 'axios'
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


export default {
    components: {
        Sidebar,
        QuillEditor
    },
    data() {
        return {
            edited: {
                image: [],
            },
            profilkomunitas: [],
            content: [],
            ShowEditProfilKomunitas: false,
            ShowEditFotoSampul: false,
            url: 'https://elgeka-web-api-production.up.railway.app/',
        }
    },
    methods: {
        formatDateTime(dateTimeString) {
            moment.locale('id');
            return moment(dateTimeString).format('LLL');
        },
        toggleModalEditProfilKomunitas: function () {
            this.ShowEditProfilKomunitas = !this.ShowEditProfilKomunitas;
        },
        toggleModalEditFotoSampul: function () {
            this.ShowEditFotoSampul = !this.ShowEditFotoSampul;
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.edited.image = selectedFile;
        },
        editcoverphoto() {
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/profilKomunitas'
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('image', this.edited.image);
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    console.log(response.data)
                    this.$router.push('/profilkomunitas')
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/profilkomunitas')
                })
        }
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
            <p class="w-full font-gotham font-bold text-[30px] leading-6 mb-8 border-b pb-4 border-[#D0D5DD]">Update
                Komunitas</p>

            <div id="container" class="flex">
                <div class="flex flex-col justify-center items-center m-auto gap-8">
                    <!-- Ubah profil komunitas -->
                    <div v-if="profilkomunitas.currentPage === 1"
                        class="bg-offwhite pb-2 w-[1022px] left-[24rem] top-[10rem] isolate rounded-xl shadow-lg border-2 border-orange">
                        <div class="max-w-[2023px] min-[2400px]:mx-auto">
                            <div class="flex mx-10 my-8 justify-between  ">
                                <div class="w-9/12">
                                    <p class="font-poppins font-bold text-[40px] text-fullblack">{{
                                        profilkomunitas.data.title }}
                                    </p>
                                    <div class="font-poppins font-normal text-[12px] text-darkgrey pr-8" v-html="profilkomunitas.data.content">
                                    </div>
                                    <div class="mt-4 flex gap-4 ">
                                        <a :href="profilkomunitas.data.twitter_link" target="_blank"><img
                                                class="w-[44px] h-[44px]" src="../assets/Logo-X.png" alt="Twitter"></a>
                                        <a :href="profilkomunitas.data.fb_link" target="_blank"><img
                                                class="w-[44px] h-[44px]" src="../assets/Logo-Facebook.png"
                                                alt="Facebook"></a>
                                        <a :href="profilkomunitas.data.ig_link" target="_blank"><img
                                                class="w-[44px] h-[44px]" src="../assets/Logo-Instagram.png"
                                                alt="Instagram"></a>
                                    </div>
                                </div>
                                <img class="w-3/12 max-w-[438px] max-h-[463px] max-xl:h-full" src="../assets/together.png"
                                    alt="foto">
                            </div>
                            <div class="flex flex-col gap-12">
                                <div
                                    class="border-2 border-grey flex flex-col items-center px-4 pt-1 max-[900px]:w-auto w-[972px] m-auto relative">
                                    <p
                                        class="absolute bg-orange bottom-[75%] right-[46%] px-4 py-1 rounded-lg font-inter font-bold text-[20px] text-white">
                                        VISI</p>
                                    <p class="p-4 font-poppins font-normal text-[20px] text-darkgrey">{{
                                        profilkomunitas.data.visi }}</p>
                                </div>
                                <div
                                    class="border-2 border-grey flex flex-col items-center px-4 pt-1 max-[900px]:w-auto w-[972px] m-auto relative">
                                    <p
                                        class="absolute bg-orange bottom-[75%] right-[46%] px-4 py-1 rounded-lg font-inter font-bold text-[20px] text-white">
                                        MISI</p>
                                    <p class="p-4 font-poppins font-normal text-[20px] text-darkgrey">{{
                                        profilkomunitas.data.misi }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end items-end py-4 pr-4">
                            <a :href="'editprofilkomunitas'"><button
                                    class="bg-orange py-2 px-8 font-poppins font-bold text-xl text-white leading-6 rounded-lg text-orange">Edit</button></a>
                        </div>
                    </div>
                    <!-- Ubah Foto Sampul -->
                    <div v-if="profilkomunitas.currentPage === 1"
                        class="bg-offwhite w-[1022px] left-[24rem] top-[40rem] isolate rounded-xl shadow-lg border-2 border-orange">
                        <div class="flex justify-between ">
                            <div class="flex">
                                <img class="max-w-[340px] p-4 max-h-[200px]" :src="url + profilkomunitas.data.image_url"
                                    alt="foto-sampul">
                                <div>
                                    <p class="font-bold font-poppins text-base text-black  py-4">Ubah Foto Sampul
                                    </p>
                                    <p
                                        class="text-base text-[#FFFFFFB2] font-normal text-black font-poppins leading-6 pb-4 ">
                                        Terakhir
                                        Diubah : {{
                                            formatDateTime(profilkomunitas.data.updatedAt) }}</p>
                                </div>
                            </div>
                            <div class="flex justify-end items-end py-4 pr-4">
                                <button v-on:click="toggleModalEditFotoSampul()"
                                    class="bg-orange py-2 px-8 font-poppins font-bold text-xl text-white leading-6 rounded-lg">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

        <!-- Pop up modal buat foto sampul komunitas... -->
        <div>
            <form v-if="ShowEditFotoSampul" @submit.prevent="editcoverphoto()"
                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                <div class="relative w-auto my-6 mx-auto max-w-6xl">
                    <!--content-->
                    <div
                        class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <!--header-->
                        <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                            <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                Edit Foto Sampul
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
                                <label for="Foto Sampul" class="font-poppins font-bold text-base text-orange">Foto Sampul
                                </label>
                                <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="file"
                                    name="Foto Sampul" id="foto-sampul-input" @change="handleFileChange">
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                            <button
                                class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                type="submit">
                                Simpan
                            </button>
                            <button
                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button" v-on:click="toggleModalEditFotoSampul()">
                                batal
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div v-if="ShowEditFotoSampul" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    </div>
</template>

<style>
#container {
    background: url("../assets/kerjasama.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: auto;
}

ol {
    list-style-type: decimal;
}

ul {
    list-style-type: disc;
}
</style>