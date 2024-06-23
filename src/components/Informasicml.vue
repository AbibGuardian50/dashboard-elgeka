<script>
import Sidebar from "./Sidebar.vue"
import axios from "axios"
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
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
                const toast = useToast();
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
                this.totalPages = Math.ceil(this.daftarberita.length / this.perPage);
                this.updatePaginatedData();
                console.log(response)
                if (response.data.message === "Get Berita Successfully") {
                    toast.success('Berita berhasil dimuat')
                }
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            const toast = useToast();
            toast.error('Berita gagal dimuat. mohon coba lagi')
            console.error(error);
        }
    },
    data() {
        return {
            errorMessage: '',
            url: 'https://elgeka-web-api-production.up.railway.app/',
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
            },
            perPage: 5,
            currentPage: 1,
            totalPages: 0,
            paginatedBerita: []
        }
    },
    methods: {
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedBerita = this.daftarberita.slice(startIndex, endIndex);
        },
        goToPage(pageNumber) {
            this.currentPage = pageNumber;
            this.updatePaginatedData();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updatePaginatedData();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePaginatedData();
            }
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.form.image = selectedFile;

            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

            if (!allowedExtensions.exec(selectedFile.name)) {
                const toast = useToast();
                this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                toast.warning('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                // alert('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                // Atau, Anda dapat mengatur pesan kesalahan pada variabel data untuk ditampilkan dalam template
                // this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                // Bersihkan nilai input file
                event.target.value = '';
            } else if (selectedFile.size > 1024 * 1024) { // 1024 KB * 1024 = 1MB
                this.errorMessage = 'Ukuran gambar tidak boleh lebih dari 1MB!';
                // Bersihkan nilai input file
                event.target.value = '';
            } else {
                // Lakukan proses upload file
                // this.uploadFile(file);
                this.errorMessage = ''; // Bersihkan pesan error jika file valid
            }
        },
        createberita() {
            const toast = useToast();
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
                    if (response.data.message === "Create Berita Successfully") {
                        toast.success('Berita baru berhasil ditambahkan')
                        console.log(response);
                        window.location.reload();
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                })
                .catch(error => {
                    const toast = useToast();
                    toast.error('Berita baru gagal ditambahkan, mohon coba lagi')
                    console.log(error)
                })
        },
        deleteberita(id) {
            const toast = useToast();
            if (confirm('Yakin Mau menghapus data ini?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/berita/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response)
                        setTimeout(function () {
                            window.location.reload();
                        }, 3000);
                        if (response.data.message === "Delete Berita by ID Successfully") {
                            toast.success('Berita berhasil dihapus, halaman akan auto refresh dalam beberapa detik')
                        } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                            toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                        }
                    })
                    .catch(error => {
                        toast.error('Berita gagal dihapus, mohon coba lagi')
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
    <div class="flex bg-offwhite max-lg:h-screen">
        <Sidebar />

        <div class="px-8 max-md:px-2 bg-offwhite max-lg:h-screen">
            <p class="title-style">Berita (Informasi CML)</p>
            <hr class="border-[#D0D5DD]">
            <div class="max-w-[1400px]">
                <table class=" overflow-x-auto">
                    <thead>
                        <tr>
                            <th scope="col" class="th-general">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="black" stroke-width="2" />
                                </svg>

                            </th>
                            <th scope="col" class="th-general">
                                Judul
                            </th>
                            <th scope="col" class="th-general">
                                Kategori
                            </th>
                            <th scope="col" class="th-general">
                                Deskripsi
                            </th>
                            <th scope="col" class="th-general">
                                Gambar
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateBerita()" class="btn-add">Tambah</button>
                            </th>
                        </tr>
                    </thead>

                    <tbody v-for="data in paginatedBerita" :key="data.id" class="divide-y divide-gray-200">
                        <tr class="border-b border-black">
                            <td class="px-6 py-4 whitespace-nowrap font-poppins font-normal text-sulfurblack md:text-base">
                                {{ data.no }}
                            </td>
                            <td class="td-general max-w-[250px]">
                                <p class="font-poppins font-normal text-sulfurblack md:text-base">{{ data.title }}</p>
                            </td>
                            <td class="td-general max-w-[200px] max-sm:max-w-[100px] truncate">
                                <p
                                    class="font-poppins font-normal text-sulfurblack md:text-base max-md:max-w-[100px] truncate">
                                    {{ data.kategori }}</p>
                            </td>
                            <td class="td-general max-w-[400px]">
                                <span v-html="data.content" class="line-clamp-4 md:text-base text-gray-900">
                                </span>
                            </td>
                            <td class="td-general max-w-[200px]">
                                <img :src="url + data.image_url">
                            </td>
                            <td
                                class="td-general whitespace-nowrap max-[831px]:flex max-[831px]:flex-col max-[831px]:gap-2 max-[831px]:items-center text-sm font-medium">
                                <a :href="'editberita/' + data.id"><button class="btn-edit">Edit</button></a>
                                <button href="#" @click="deleteberita(data.id)" class="btn-hapus">Hapus</button>
                            </td>
                        </tr>
                        <!-- More rows... -->
                    </tbody>
                </table>
                <!-- Pagination navigation -->
                <div class="ml-8 mt-4 flex justify-center">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2 mr-2 bg-teal  text-white rounded-md">Previous</button>
                    <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                        :class="{ 'bg-teal  text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                        class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-teal  text-white rounded-md">Next</button>
                </div>
                <!-- Pop up Modal buat Berita baru... -->
                <div>
                    <form v-if="showcreateberita" @submit.prevent="createberita()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-teal font-semibold font-poppins">
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
                                    <p class="font-poppins font-normal text-[20px] leading-6 text-sulfurblack">Masukan
                                        Berita
                                        CML</p>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Judul"
                                            class="font-verdana font-normal text-base text-teal">Judul</label>
                                        <input class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            required v-model="form.title" name="Judul" id="">
                                    </div>

                                    <div class="flex gap-2 flex-col" required>
                                        <label for="Deskripsi Kegiatan"
                                            class="font-verdana font-normal text-base text-teal">Deskripsi
                                            Berita</label>
                                        <div class="border border-silver py-2 min-w-[550px] pl-2 rounded-md" id="app">
                                            <quill-editor theme="snow" contentType="html" required
                                                v-model:content="form.content"></quill-editor>
                                        </div>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Upload Foto"
                                            class="font-verdana font-normal text-base text-teal">Gambar</label>
                                        <input class="border border-silver py-2 min-w-[550px] pl-2 rounded-md" type="file"
                                            accept=".jpg,.jpeg,.png" name="Foto Berita" id="foto-berita"
                                            @change="handleFileChange" required>
                                        <p v-if="errorMessage" class="text-[#EF0307] font-semibold">{{ errorMessage }}</p>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Kategori"
                                            class="font-verdana font-normal text-base text-teal">Kategori</label>
                                        <select name="" id=""
                                            class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" required
                                            v-model="form.kategori">
                                            <option value="perkembanganCML" selected>Perkembangan CML</option>
                                            <option value="perkembanganKomunitas">Perkembangan Komunitas</option>
                                        </select>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="doi_link"
                                            class="font-verdana font-normal text-base text-teal">doi_link</label>
                                        <input class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            required v-model="form.doi_link" name="doi_link" id="">
                                    </div>

                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button
                                        class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded-md outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Simpan
                                    </button>

                                    <button
                                        class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded-md outline-none focus:outline-none mr-1 mb-1"
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
}</style>