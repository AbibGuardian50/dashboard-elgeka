<script>
import Sidebar from "./Sidebar.vue"
import axios from "axios"
import VueCookies from 'vue-cookies';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    components: {
        QuillEditor,
        Sidebar
    },
    async created() {
        try {
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                VueCookies.get('tokenlogin')
                this.daftarkegiatan = response.data.result.data
                // this.daftarkegiatan.sort((x, y) => x.id - y.id) supaya urut menurut id nya
                this.daftarkegiatan.forEach((item, index) => {
                    item.no = index + 1;
                });
                console.log(this.daftarkegiatan)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    data() {
        return {
            daftarkegiatan: [],
            error: '',
            noUrut: 0,
            showcreatekegiatan: false,
            form: {
                title: '',
                content: '',
                tempat: '',
                date: '',
                image: []
            }
        }
    },
    methods: {
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.form.image = selectedFile;
        },
        createkegiatan() {
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('image', this.form.image);
            formData.append('title', this.form.title);
            formData.append('content', this.form.content);
            formData.append('tempat', this.form.tempat);
            formData.append('date', this.form.date);

            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas'
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    console.log(response.data);
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deletekegiatan(id) {
            if (confirm('Are you sure you want to delete this admin account?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas/${id}`
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
    }
}
</script>

<template>
    <div class="flex ">
        <Sidebar />

        <div class="px-8">
            <p class="font-gotham font-bold text-[30px] text-sulfurblack">Update Kegiatan</p>
            <hr class="border-[#D0D5DD]">
            <p class="my-4 font-gotham font-normal text-[20px] text-sulfurblack">Tentang Kegiatan</p>
            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto max-w-[1400px]">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Nomor
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Tanggal
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Judul
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Tempat
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Deskripsi
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left font-gotham text-sulfurblack text-base w-[300px] font-normal">
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateKegiatan()"
                                    class="bg-orange px-2 py-1 text-left font-gotham text-sulfurblack text-base">+</button>
                            </th>
                        </tr>
                    </thead>

                    <tbody v-for="data in daftarkegiatan" :key="data.id" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-sulfurblack text-base">
                                {{ data.no }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class="font-gotham font-normal text-sulfurblack text-base">
                                            {{ data.date }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 max-w-[250px]">
                                <p class="font-gotham font-normal text-sulfurblack text-base">{{ data.title }}</p>
                            </td>
                            <td class="px-6 py-4 max-w-[200px]">
                                <p class="font-gotham font-normal text-sulfurblack text-base">{{ data.tempat }}</p>
                            </td>
                            <td class="px-6 py-4 max-w-[300px]">
                                <span v-html="data.content" class="text-base text-gray-900">
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                <a :href="'editkegiatan/' + data.id"><button
                                        class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button></a>
                                <button href="#" @click="deletekegiatan(data.id)"
                                    class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
                            </td>
                        </tr>
                        <!-- More rows... -->
                    </tbody>
                </table>
                <!-- Pop up Modal buat kegiatan baru... -->
                <div>
                    <form v-if="showcreatekegiatan" @submit.prevent="createkegiatan()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                        Tambah Kegiatan Komunitas
                                    </h3>
                                    <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        v-on:click="toggleModalCreateKegiatan()">
                                        <span
                                            class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        </span>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="flex flex-col gap-8 relative p-6">
                                    <div class="flex gap-2 flex-col">
                                        <label for="Judul"
                                            class="font-poppins font-bold text-base text-orange">Judul</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            v-model="form.title" name="Judul" id="" :placeholder="daftarkegiatan.title">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="tempat"
                                            class="font-poppins font-bold text-base text-orange">Tempat</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            v-model="form.tempat" name="tempat" :placeholder="daftarkegiatan.tempat">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Upload Foto" class="font-poppins font-bold text-base text-orange">Upload
                                            Foto</label>
                                        <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="file"
                                            name="Foto Sampul" id="foto-sampul-input" @change="handleFileChange">
                                    </div>


                                    <div class="flex gap-2 flex-col">
                                        <label for="Deskripsi Kegiatan"
                                            class="font-poppins font-bold text-base text-orange">Deskripsi
                                            Kegiatan</label>
                                        <div class="border border-black py-2 min-w-[550px] pl-2 rounded-md" id="app">
                                            <quill-editor theme="snow" contentType="html"
                                                v-model:content="form.content"></quill-editor>
                                        </div>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Tanggal"
                                            class="font-poppins font-bold text-base text-orange">Tanggal</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            name="Tanggal" v-model="form.date" id="" :placeholder="daftarkegiatan.date">
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
                                        type="button" v-on:click="toggleModalCreateKegiatan()">
                                        batal
                                    </button>

                                </div>
                            </div>
                        </div>
                    </form>
                    <div v-if="showcreatekegiatan" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<style>
ol {
    list-style-type: decimal;
    margin-left: 1rem;
}
</style>