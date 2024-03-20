<script>
import Sidebar from "./Sidebar.vue"
import axios from "axios"

import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    async created() {
        try {
            const tokenlogin = sessionStorage.getItem('tokenlogin')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                sessionStorage.getItem('tokenlogin')
                this.daftarpengurus = response.data.result.data
                // this.daftarpengurus.sort((x, y) => x.id - y.id) supaya urut menurut id nya
                this.daftarpengurus.forEach((item, index) => {
                    item.no = index + 1;
                });
                console.log(this.daftarpengurus)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar,
        QuillEditor
    },
    computed: {
        creatorImage() {
            return this.imageError ? this.defaultImage : "creator-image.jpg";
        }
    },
    data() {
        return {
            daftarpengurus: [],
            url: 'https://elgeka-web-api-production.up.railway.app/',
            showcreatepengurus: false,
            form: {
                full_name: '',
                jabatan: '',
                quote: '',
                image: [],
            },
        }
    },
    methods: {
        createpengurus() {
            const tokenlogin = sessionStorage.getItem('tokenlogin')
            const formData = new FormData();
            formData.append('full_name', this.form.full_name);
            formData.append('jabatan', this.form.jabatan);
            formData.append('quote', this.form.quote);
            formData.append('image', this.form.image);

            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas'
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    console.log(response.data);
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deletepengurus(id) {
            if (confirm('Are you sure you want to delete this admin account?')) {
                const tokenlogin = sessionStorage.getItem('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data)
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
        toggleModalCreateKegiatan: function () {
            this.showcreatekegiatan = !this.showcreatekegiatan;
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.form.image = selectedFile;
        },
        toggleModalCreatePengurus: function () {
            this.showcreatepengurus = !this.showcreatepengurus;
        },
    }
}
</script>

<template>
    <div class="flex">
        <Sidebar />

        <div class="px-8">
            <p class="text-[30px] text-orange font-gotham font-bold">Pengurus Komunitas</p>
            <hr>
            <p class="font-gotham font-normal text-[20px] text-sulfurblack mt-4">Pengurus Komunitas</p>
            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                    <thead class="bg-gray-50">
                        <tr class="border-b-[0.5px] border-b-orange">
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                NO
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                Nama Lengkap
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                Role
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                Gambar
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreatePengurus()"
                                    class="bg-orange px-2 py-1 text-left font-gotham text-black text-base">+</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="data in daftarpengurus" :key="data.id" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-sulfurblack text-base">
                                {{ data.no }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class="font-gotham font-normal text-sulfurblack text-base">
                                            {{ data.full_name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <p class="font-gotham font-normal text-sulfurblack text-base">{{ data.jabatan }}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="pr-4 inline-flex text-base leading-5 font-semibold rounded-full">
                                    <img class="bg-[url('https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg')] bg-cover bg-center w-[160px] max-h-[160px]"
                                        :src="url + data.image_url">

                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                <a :href="'editpengurus/' + data.id">
                                    <button
                                        class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button>
                                </a>
                                <button href="#" @click="deletepengurus(data.id)"
                                    class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
                            </td>
                        </tr>
                        <!-- More rows... -->

                    </tbody>
                </table>

                <!-- Pop up modal buat Pengurus baru... -->
                <div>
                    <form v-if="showcreatepengurus" @submit.prevent="createpengurus()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                        Input
                                    </h3>
                                    <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        v-on:click="toggleModalCreatePengurus()">
                                        <span
                                            class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        </span>
                                    </button>

                                </div>

                                <!--body-->
                                <div class="flex flex-col gap-8 relative p-6">
                                    <p class="font-gotham font-normal text-[20px] leading-6 text-sulfurblack">Input Pengurus
                                        Komunitas</p>
                                    <div class="flex gap-2 flex-col">
                                        <label for="nama lengkap" class="font-poppins font-bold text-base text-orange">Nama
                                            Lengkap</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            v-model="form.full_name" name="nama lengkap" id=""
                                            placeholder="Isi Nama Lengkap">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Peran" class="font-poppins font-bold text-base text-orange">Role
                                        </label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            v-model="form.jabatan" name="Peran" id="" placeholder="Peran/Jabatan">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Quote" class="font-poppins font-bold text-base text-orange">Deskripsi
                                        </label>
                                        <div class="flex gap-2 flex-col">
                                            <quill-editor class="border border-black py-4 min-w-[550px] pl-2 rounded-md"
                                                theme="snow" contentType="html"
                                                v-model:content="form.quote"></quill-editor>
                                        </div>

                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Foto Profil" class="font-poppins font-bold text-base text-orange">Gambar
                                            Lengkap</label>
                                        <input @change="handleFileChange"
                                            class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="file"
                                            name="Foto Profil" id="">
                                    </div>




                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button
                                        class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Simpan
                                    </button>
                                    <button @click="toggleModalCreatePengurus()"
                                        class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                        type="button">
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div v-if="showcreatepengurus" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>

                <!-- Pop up modal buat hapus akun admin -->

                <div>
                    <form v-if="showdeleteadmin"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                        Konfirmasi Hapus Akun Admin
                                    </h3>
                                    <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        v-on:click="toggleModalDeleteAdmin()">
                                        <span
                                            class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        </span>
                                    </button>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button @click="deleteAdmin(id)"
                                        class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Hapus
                                    </button>
                                    <button
                                        class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                        type="button" v-on:click="toggleModalDeleteAdmin()">
                                        batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div v-if="showdeleteadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>



                <div v-if="error" class="text-red font-gotham font-bold text-2xl pt-4">{{ error }}</div>
            </div>
        </div>
</div></template>