<script>
import Sidebar from "../components/Sidebar.vue"
import axios from "axios"
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import VueCookies from 'vue-cookies';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useToast } from 'vue-toastification';

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
                this.totalPages = Math.ceil(this.daftarkegiatan.length / this.perPage);
                this.updatePaginatedData();
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
            url: 'https://elgeka-web-api-production.up.railway.app/',
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
            },
            perPage: 5,
            currentPage: 1,
            totalPages: 0,
            PaginatedDaftarKegiatan: [],
            errorMessage: '',
        }
    },
    methods: {
        formatDate(dateString) {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: idLocale });
        },
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.PaginatedDaftarKegiatan = this.daftarkegiatan.slice(startIndex, endIndex);
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
            const toast = useToast();
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
            }
            else {
                // Lakukan proses upload file
                // this.uploadFile(file);
                this.errorMessage = ''; // Bersihkan pesan error jika file valid
            }
        },
        createkegiatan() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('image', this.form.image);
            formData.append('title', this.form.title);
            formData.append('content', this.form.content);
            formData.append('tempat', this.form.tempat);
            formData.append('date', this.form.date);
            // tambahkan validasi file tidak boleh lebih besar dari 1mb / 1024 kb dengan parameter 1024kb
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas'
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Create Kegiatan Komunitas Successfully") {
                        toast.success('Kegiatan Komunitas berhasil dibuat')
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);

                    }
                })
                .catch(error => {
                    console.log(error)
                    toast.error('Kegiatan Komunitas gagal dibuat, mohon coba lagi')
                })
        },
        deletekegiatan(id) {
            if (confirm('Are you sure you want to delete this admin account?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response)
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
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <div class="px-8 max-[842px]:px-2 bg-offwhite">
            <p class="title-style">Update Kegiatan</p>
            <hr class="border-teal">
            <div class="container-table-general">
                <table class="table-general">
                    <thead>
                        <tr>
                            <th scope="col" class="th-general max-md:px-2 max-md:pl-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="black" stroke-width="2" />
                                </svg>

                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Tanggal
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Judul
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Tempat
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Deskripsi
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Status
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Gambar
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateKegiatan()" class="btn-add">Tambah</button>
                            </th>
                        </tr>
                    </thead>

                    <tbody v-for="data in PaginatedDaftarKegiatan" :key="data.id"
                        class="bg-offwhite divide-y divide-gray-200">
                        <tr>
                            <td class="td-general whitespace-nowrap">
                                {{ data.no }}
                            </td>
                            <td class="td-general whitespace-nowrap">
                                <div class="max-[975px]:max-w-[10%] td-text-general">
                                    {{ formatDate(data.date) }}
                                </div>
                            </td>
                            <td class="td-general max-w-[250px] ">
                                <p class="td-text-general">{{ data.title }}</p>
                            </td>
                            <td class="td-general max-w-[200px] ">
                                <p class="td-text-general">{{ data.tempat }}</p>
                            </td>
                            <td class="td-general max-w-[300px] ">
                                <span v-html="data.content" class="line-clamp-4 td-text-general">
                                </span>
                            </td>
                            <td class="td-general max-w-[250px]">
                                <p v-if="data.show === true" class="td-text-general text-[#52FF00] font-bold">Tampil</p>
                                <p v-if="data.show === false" class="td-text-general text-[#FF0000] font-bold">Disembunyikan</p>
                            </td>
                            <td class="td-general max-w-[200px]">
                                <img :src="data.image_url ? url + data.image_url : 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'"
                                    alt="foto kegiatan">
                            </td>
                            <td
                                class="td-general whitespace-nowrap text-sm font-medium max-[1150px]:flex max-[1150px]:flex-col max-[1150px]:gap-2 max-[1150px]:items-center">
                                <a :href="'editkegiatan/' + data.id"><button class="btn-edit">Edit</button></a>
                                <button href="#" @click="deletekegiatan(data.id)" class="btn-hapus">Hapus</button>
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

                <!-- Pop up Modal buat kegiatan baru... -->
                <div>
                    <form v-if="showcreatekegiatan" @submit.prevent="createkegiatan()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-teal font-semibold font-poppins">
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
                                        <label for="Judul" class="font-poppins font-bold text-base text-teal">Judul</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            required v-model="form.title" name="Judul" id=""
                                            :placeholder="daftarkegiatan.title">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="tempat"
                                            class="font-poppins font-bold text-base text-teal">Tempat</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            required v-model="form.tempat" name="tempat"
                                            :placeholder="daftarkegiatan.tempat">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Upload Foto" class="font-poppins font-bold text-base text-teal">Upload
                                            Foto</label>
                                        <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="file"
                                            required accept=".jpg,.jpeg,.png" name="Foto Sampul" id="foto-sampul-input"
                                            @change="handleFileChange">
                                        <div v-if="errorMessage" class="text-red text-sm font-bold mb-4">{{ errorMessage }}
                                        </div>
                                    </div>
                                    <div class="flex gap-2 flex-col">
                                        <label for="Deskripsi Kegiatan"
                                            class="font-poppins font-bold text-base text-teal">Deskripsi
                                            Kegiatan</label>
                                        <div class="border border-black py-2 min-w-[550px] pl-2 rounded-md" id="app">
                                            <quill-editor theme="snow" :toolbar="[{ 'header': [1, 2, false] },'bold', 'italic', 'underline', 'image', 'link',  , {'list': 'ordered'}, {'list': 'bullet'}]" contentType="html"
                                                v-model:content="form.content"></quill-editor>
                                        </div>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Tanggal"
                                            class="font-poppins font-bold text-base text-teal">Tanggal</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="date"
                                            required name="Tanggal" v-model="form.date" id=""
                                            :placeholder="daftarkegiatan.date">
                                    </div>


                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button
                                        class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Simpan
                                    </button>

                                    <button
                                        class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
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
}</style>