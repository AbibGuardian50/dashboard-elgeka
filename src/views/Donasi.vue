<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    async created() {
        try {
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/donasi'
            const response = await axios.get(url);
            this.donasielgeka = response.data.result
            console.log(this.donasielgeka)
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar,
        QuillEditor
    },
    data() {
        return {
            donasielgeka: [],
            gambar_url: 'https://elgeka-web-api-production.up.railway.app/',
            ShowEditDonasi: false,
            errorMessage: '',
            donasielgeka: {
                data: {
                    title: '',
                    donate_link: '',
                    content: '',
                }
            },
            edited: {
                image: [],
            },  
            
        }
    },
    methods: {
        editdonasi() {
            const toast = useToast();
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/donasi'
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('title', this.donasielgeka.data.title);
            formData.append('donate_link', this.donasielgeka.data.donate_link);
            formData.append('content', this.donasielgeka.data.content);
            formData.append('image', this.donasielgeka.data.image);
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    if (response.data.message === "Update Info Donasi Successfully") {
                        toast.success ('Data donasi berhasil diubah')
                        window.location.reload();
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                })
                .catch(error => {
                    console.log(error)
                    toast.error ('Data donasi gagal diubah, mohon coba lagi')
                })
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.donasielgeka.data.image = selectedFile;

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
        toggleModalEditDonasi: function () {
            this.ShowEditDonasi = !this.ShowEditDonasi;
        },
    }
}
</script>

<template>
    <div class="flex bg-offwhite max-lg:h-screen">
        <sidebar class="min-w-[250px]"/>
        <div class="ml-8 max-sm:ml-1 max-sm:mr-1 bg-offwhite">
            <p class="font-poppins font-bold text-[24px] sm:text-[30px] leading-6 text-sulfurblack my-4 border-b border-teal pb-4">
                Donasi</p>
            <div v-if="donasielgeka.currentPage === 1"
                class="bg-semitransparentwhite flex flex-col justify-center items-center border-2 border-teal mx-auto lg:min-w-7/12 p-4">
                <p class="title-style bg-white text-center w-full lg:w-auto">{{ donasielgeka.data.title }}</p>
                <img class="w-full max-w-[314px] max-h-[283px] border-8 border-teal my-4"
                    :src="gambar_url + donasielgeka.data.image_url" alt="Gambar QR" srcset="">
                <a :href="donasielgeka.data.donate_link"
                    class="font-poppins font-bold text-[24px] sm:text-[30px] lg:text-[40px] text-center hover:underline mb-2" target="_blank">{{
                        donasielgeka.data.donate_link }}</a>
                <p v-html="donasielgeka.data.content"
                    class="font-poppins font-normal w-full sm:w-[673px] text-[14px] sm:text-[16px] text-[#000000B2]"></p>
                <button @click="toggleModalEditDonasi()"
                    class="px-8 my-4 py-2 bg-teal flex justify-center items-center font-bold rounded-md text-white text-center text-[14px]">Edit</button>


                <!-- Pop up modal edit tampilan Donasi... -->
                <div>
                    <form v-if="ShowEditDonasi" @submit.prevent="editdonasi()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-black rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[24px] sm:text-[30px] lg:text-[40px] text-teal font-semibold font-poppins">
                                        Edit Donasi
                                    </h3>
                                    <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        v-on:click="toggleModalEditDonasi()">
                                        <span
                                            class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        </span>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="flex flex-col gap-8 relative p-6">
                                    <div class="flex gap-2 flex-col">
                                        <label for="Judul" class="font-poppins font-bold text-base text-teal">Judul
                                        </label>
                                        <input class="border border-black py-2 w-full lg:min-w-[550px] pl-2 rounded-md" type="text" required
                                            name="Judul" id="Judul" :placeholder="donasielgeka.data.title"
                                            v-model="donasielgeka.data.title">
                                    </div>
                                    <div class="flex gap-2 flex-col">
                                        <label for="Link" class="font-poppins font-bold text-base text-teal">Link
                                        </label>
                                        <input class="border border-black py-2 w-full lg:min-w-[550px] pl-2 rounded-md" type="text"
                                            name="Link" id="Link" :placeholder="donasielgeka.data.donate_link"
                                            v-model="donasielgeka.data.donate_link">
                                    </div>
                                    <div class="flex gap-2 flex-col">
                                        <label for="Deskripsi"
                                            class="font-poppins font-bold text-base text-teal">Deskripsi
                                        </label>
                                        <div class="border border-black py-2 w-full lg:min-w-[550px] pl-2 rounded-md" id="app">
                                            <quill-editor theme="snow" contentType="html" required class="text-[16px]"
                                                v-model:content="donasielgeka.data.content"></quill-editor>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 flex-col">
                                        <label for="Foto Sampul" class="font-poppins font-bold text-base text-teal">Foto
                                            Sampul
                                        </label>
                                        <input class="border border-black py-2 w-full lg:min-w-[550px] pl-2 rounded-md" type="file" accept=".jpg,.jpeg,.png"
                                            name="Foto Sampul" id="foto-sampul-input" @change="handleFileChange">
                                            <p v-if="errorMessage" class="text-[#EF0307] font-semibold" >{{ errorMessage
                                        }}</p>
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex flex-col sm:flex-row items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button
                                        class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                        type="submit">
                                        Simpan
                                    </button>
                                    <button
                                        class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                        type="button" v-on:click="toggleModalEditDonasi()">
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div v-if="ShowEditDonasi" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>

            </div>


        </div>


    </div>
</template>



<style>
ol {
    list-style-type: decimal;
}

ul {
    list-style-type: disc;
}
</style>