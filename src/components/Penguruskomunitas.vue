<script>
import { useToast } from 'vue-toastification';
import Sidebar from "./Sidebar.vue"
import axios from "axios"
import VueCookies from 'vue-cookies';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    async created() {
        const toast = useToast();
        try {
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                VueCookies.get('tokenlogin')
                this.daftarpengurus = response.data.result.data
                // this.daftarpengurus.sort((x, y) => x.id - y.id) supaya urut menurut id nya
                this.daftarpengurus.forEach((item, index) => {
                    item.no = index + 1;
                });
                this.totalPages = Math.ceil(this.daftarpengurus.length / this.perPage);
                this.updatePaginatedData();
                if (response.data.message === "Get Member Komunitas Successfully") {
                    toast.success('Data Member Komunitas Berhasil Dimuat')
                }
                console.log(response)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
            toast.error('Data Member Komunitas Gagal Dimuat')
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
            perPage: 5,
            currentPage: 1,
            totalPages: 0,
            PaginatedDaftarPengurus: [],
            errorMessage: '',
        }
    },
    methods: {
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.PaginatedDaftarPengurus = this.daftarpengurus.slice(startIndex, endIndex);
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
        createpengurus() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('full_name', this.form.full_name);
            formData.append('jabatan', this.form.jabatan);
            formData.append('quote', this.form.quote);
            formData.append('image', this.form.image);
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas'
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                })
                .catch(error => {
                    console.log(error)
                    toast.error('Tidak bisa menambahkan pengurus, mohon coba lagi')
                })
        },
        deletepengurus(id) {
            if (confirm('Are you sure you want to delete this admin account?')) {
                const toast = useToast();
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response)
                        if (response.data.message === "Your admin status is not active, authorization denied!") {
                            toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                        }
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
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
        toggleModalCreatePengurus: function () {
            this.showcreatepengurus = !this.showcreatepengurus;
        },
    }
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="px-8 max-md:px-2 bg-offwhite max-lg:h-screen">
            <p class="title-style">Pengurus Komunitas</p>
            <hr>
            <div>
                <table
                    class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px] max-[1400px]:w-full max-[1400px]:max-w-[1200px]">
                    <thead>
                        <tr class="border-b-[0.5px] border-b-teal">
                            <th scope="col" class="th-general max-sm:pl-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="black" stroke-width="2" />
                                </svg>

                            </th>
                            <th scope="col" class="th-general max-sm:text-[14px]">
                                Nama Lengkap
                            </th>
                            <th scope="col" class="th-general max-sm:text-[14px]">
                                Role
                            </th>
                            <th scope="col" class="th-general max-sm:text-[14px]">
                                Gambar
                            </th>
                            <th scope="col" class="max-w-[200px]">
                                <button v-on:click="toggleModalCreatePengurus()" class="btn-add">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="data in PaginatedDaftarPengurus" :key="data.id"
                        class="bg-offwhite divide-y divide-gray-200">
                        <tr>
                            <td
                                class="td-general whitespace-nowrap font-poppins font-normal text-sulfurblack md:text-base max-[565px]:px-1">
                                {{ data.no }}
                            </td>
                            <td class="td-general whitespace-nowrap max-[565px]:px-1">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class="font-poppins font-normal text-sulfurblack md:text-base">
                                            {{ data.full_name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-general whitespace-nowrap max-[565px]:px-1">
                                <p class="font-poppins font-normal text-sulfurblack md:text-base ">{{ data.jabatan }}</p>
                            </td>
                            <td class="td-general whitespace-nowrap max-[565px]:px-1">
                                <span class="pr-4 inline-flex text-base leading-5 font-semibold rounded-full">
                                    <img class="bg-[url('https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg')] bg-cover bg-center w-[160px] max-h-[160px]"
                                        :src="url + data.image_url">

                                </span>
                            </td>
                            <td
                                class="mt-4 whitespace-nowrap text-sm font-medium max-w-[200px] max-[1150px]:flex max-[1150px]:flex-col max-[1150px]:gap-2 max-[1150px]:items-center">
                                <a :href="'editpengurus/' + data.id">
                                    <button class="btn-edit">Edit</button>
                                </a>
                                <button href="#" @click="deletepengurus(data.id)" class="btn-hapus">Hapus</button>
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

                <!-- Pop up modal buat Pengurus baru... -->
                <div>
                    <form v-if="showcreatepengurus" @submit.prevent="createpengurus()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-teal font-semibold font-poppins">
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
                                    <p class="font-poppins font-normal text-[20px] leading-6 text-sulfurblack">Input
                                        Pengurus
                                        Komunitas</p>
                                    <div class="flex gap-2 flex-col">
                                        <label for="nama lengkap" class="font-poppins font-bold text-base text-teal">Nama
                                            Lengkap</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            v-model="form.full_name" name="nama lengkap" id=""
                                            placeholder="Isi Nama Lengkap">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Peran" class="font-poppins font-bold text-base text-teal">Role
                                        </label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            v-model="form.jabatan" name="Peran" id="" placeholder="Peran/Jabatan">
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Quote" class="font-poppins font-bold text-base text-teal">Deskripsi
                                        </label>
                                        <div class="flex gap-2 flex-col">
                                            <quill-editor class="border border-black py-4 min-w-[550px] pl-2 rounded-md"
                                                theme="snow" contentType="html" v-model:content="form.quote"></quill-editor>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 flex-col">
                                        <label for="Foto Profil" class="font-poppins font-bold text-base text-teal">Gambar
                                            Lengkap</label>
                                        <input @change="handleFileChange"
                                            class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="file"
                                            accept=".jpg,.jpeg,.png" name="Foto Profil" id="">
                                        <div v-if="errorMessage" class="text-red text-sm font-bold mb-4">{{ errorMessage }}
                                        </div>
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button
                                        class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Simpan
                                    </button>
                                    <button @click="toggleModalCreatePengurus()"
                                        class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
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
                                    <h3 class="text-[40px] text-teal font-semibold font-poppins">
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
                                        class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Hapus
                                    </button>
                                    <button
                                        class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                        type="button" v-on:click="toggleModalDeleteAdmin()">
                                        batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div v-if="showdeleteadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>



                <div v-if="error" class="text-red font-poppins font-bold text-2xl pt-4">{{ error }}</div>
            </div>
        </div>
</div></template>