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
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/berita'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                VueCookies.get('tokenlogin')
                this.daftarberita = response.data.result.data
                // this.daftarberita.sort((x, y) => x.id - y.id) supaya urut menurut id nya
                this.daftarberita.forEach((item, index) => {
                    item.no = index + 1;
                });
                console.log(this.daftarberita   )
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    data() {
        return {
            daftarberita: [],
            error: '',
            noUrut: 0,
            showcreateberita: false,
            form: {
                title: '',
                content: '',
                image: [],
                kategori: '',
                doi_link: '',
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
        createberita() {
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('image', this.form.image);
            formData.append('title', this.form.title);
            formData.append('content', this.form.content);
            formData.append('kategori', this.form.kategori);
            formData.append('doi_link', this.form.doi_link);

            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/berita'
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    console.log(response.data);
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deleteberita(id) {
            if (confirm('Yakin Mau menghapus data ini?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/berita/${id}`
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
        toggleModalCreateBerita: function () {
            this.showcreateberita = !this.showcreateberita;
        },
    }
}
</script>

<template>
    <div class="flex ">
        <Sidebar />

        <div class="px-8">
            <p class="font-gotham font-bold text-[30px] text-sulfurblack">Informasi CML</p>
            <hr class="border-[#D0D5DD]">
            <div class="w-[1400px]">
                <table class=" overflow-x-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Nomor
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Judul
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Kategori
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-sulfurblack text-base font-normal">
                                Deskripsi
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateBerita()"
                                    class="bg-orange px-2 py-1 text-left font-gotham text-sulfurblack text-base">+</button>
                            </th>
                        </tr>
                    </thead>

                    <tbody v-for="data in daftarberita" :key="data.id" class="bg-white divide-y divide-gray-200">
                        <tr class="border-b border-black">
                            <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-sulfurblack text-base">
                                {{ data.no }}
                            </td>
                            <td class="px-6 py-4 max-w-[250px]">
                                <p class="font-gotham font-normal text-sulfurblack text-base">{{ data.title }}</p>
                            </td>
                            <td class="px-6 py-4 max-w-[200px]">
                                <p class="font-gotham font-normal text-sulfurblack text-base">{{ data.kategori }}</p>
                            </td>
                            <td class="px-6 py-4 max-w-[400px]">
                                <span v-html="data.content" class="text-base text-gray-900">
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                <a :href="'editberita/' + data.id"><button
                                        class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button></a>
                                        <button href="#" @click="deleteberita(data.id)"
                                    class="py-1 px-8 rounded-[5px] shadow-xl bg-offwhite bg-opacity-64 text-orange  ml-2 font-inter font-bold text-base">Hapus</button>
                            </td>
                        </tr>
                        <!-- More rows... -->
                    </tbody>
                </table>
                <!-- Pop up Modal buat Berita baru... -->
                <div>
                    <form v-if="showcreateberita" @submit.prevent="createberita()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                        Berita CML
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
                                    <p class="font-gotham font-normal text-[20px] leading-6 text-sulfurblack">Masukan Berita CML</p>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Judul"
                                            class="font-verdana font-normal text-base text-orange">Judul</label>
                                        <input class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" type="text" required
                                            v-model="form.title" name="Judul" id="" >
                                    </div>

                                    <div class="flex gap-2 flex-col" required>
                                        <label for="Deskripsi Kegiatan"
                                            class="font-verdana font-normal text-base text-orange">Deskripsi
                                            Berita</label>
                                        <div class="border border-silver py-2 min-w-[550px] pl-2 rounded-md" id="app">
                                            <quill-editor theme="snow" contentType="html" required
                                                v-model:content="form.content"></quill-editor>
                                        </div>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Upload Foto" class="font-verdana font-normal text-base text-orange">Gambar</label>
                                        <input class="border border-silver py-2 min-w-[550px] pl-2 rounded-md" type="file"
                                            name="Foto Berita" id="foto-berita" @change="handleFileChange" required>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Kategori"
                                            class="font-verdana font-normal text-base text-orange">Kategori</label>
                                        <select name="" id="" class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" required v-model="form.kategori">
                                            <option value="perkembanganCML" selected>Perkembangan CML</option>
                                            <option value="perkembanganKomunitas">Perkembangan Komunitas</option>
                                        </select>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="doi_link"
                                            class="font-verdana font-normal text-base text-orange">doi_link</label>
                                        <input class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" type="text" required
                                            v-model="form.doi_link" name="doi_link" id="" >
                                    </div>

                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button
                                        class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded-md outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Simpan
                                    </button>

                                    <button
                                        class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded-md outline-none focus:outline-none mr-1 mb-1"
                                        type="button" v-on:click="toggleModalCreateBerita()">
                                        batal
                                    </button>

                                </div>
                            </div>
                        </div>
                    </form>
                    <div v-if="showcreateberita" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
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