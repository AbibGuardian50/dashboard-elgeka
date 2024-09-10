<script>
import Sidebar from "../components/Sidebar.vue"
import VueCookies from 'vue-cookies';
import axios from 'axios'
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';

export default {
    components: {
        Sidebar,
        QuillEditor
    },
    data() {
        return {
            errorMessage: '',
            edited: {
                image: [],
                
            },
            profilkomunitas: [],
            infokontak: [],
            infokontak: {
                email_komunitas: [],
                kontak_komunitas: [],
            },
            content: [],
            ShowEditProfilKomunitas: false,
            ShowEditFotoSampul: false,
            ShowEditKontak: false,
            url: 'https://elgeka-web-api-production.up.railway.app/',
        }
    },
    methods: {
        formatDate(dateString) {
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
        toggleModalEditProfilKomunitas: function () {
            this.ShowEditProfilKomunitas = !this.ShowEditProfilKomunitas;
        },
        toggleModalEditFotoSampul: function () {
            this.ShowEditFotoSampul = !this.ShowEditFotoSampul;
        },
        toggleModalEditKontak: function () {
            this.ShowEditKontak = !this.ShowEditKontak;
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.edited.image = selectedFile;

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
        editcoverphoto() {
            const toast = useToast();
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/profilKomunitas'
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('image', this.edited.image);
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    console.log(response)
                    if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    } else if (response.data.message === "Update Profil Komunitas Successfully") {
                        toast.success('Update profil komunitas berhasil')
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/profilkomunitas')
                })
        },
        editcontact() {
            const toast = useToast();
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/profilKomunitas'
            const tokenlogin = VueCookies.get('tokenlogin')
            // Data yang akan dikirim
            const data = {
                email_komunitas: this.infokontak.email_komunitas,
                kontak_komunitas: this.infokontak.kontak_komunitas
            };
            axios.patch(url, data, {
                headers: {
                    'Authorization': `Bearer ${tokenlogin}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log(response)
                    if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    } else if (response.data.message === "Update Profil Komunitas Successfully") {
                        toast.success('Update Kontak profil komunitas berhasil')
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/profilkomunitas')
                })
        }
    },
    async created() {
        try {
            const toast = useToast();
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/profilKomunitas');
            this.profilkomunitas = response.data.result;
            this.infokontak = response.data.result.data
            console.log(this.profilkomunitas)
            if (response.data.message === "Get Profil Komunitas Successfully") {
                toast.success('Data profil komunitas berhasil dimuat')
            }
            // this.parsed_aturanblog = this.aturanblog.split("\n");
            console.log(response.data)
        } catch (error) {
            console.error(error);
            const toast = useToast();
            toast.error('Data profil komunitas gagal dimuat, mohon coba lagi')
        }
    },
}
</script>

<template>
    <div class="flex bg-offwhite h-full">
        <Sidebar />
        <div class="pl-8 max-[520px]:pl-1 pt-12 bg-offwhite w-full lg:w-3/4">
            <p class="title-style pb-4 text-xl md:text-2xl lg:text-3xl xl:text-4xl">Update Komunitas</p>

            <div id="container" class="flex flex-col md:flex-row">
                <div class="flex flex-col gap-8 w-full">
                    <!-- Ubah profil komunitas -->
                    <div v-if="profilkomunitas.currentPage === 1"
                        class="bg-semitransparentwhite pb-2 w-full max-w-[1022px] isolate rounded-xl shadow-lg border-2 border-teal">
                        <div class="max-w-[2023px] min-[2400px]:mx-auto">
                            <div class="flex flex-col md:flex-row mx-4 md:mx-10 my-8 justify-between">
                                <div class="w-full md:w-9/12">
                                    <p class="font-poppins font-bold text-2xl md:text-3xl lg:text-4xl text-fullblack">
                                        {{ profilkomunitas.data.title }}
                                    </p>
                                    <div class="font-poppins font-normal text-sm md:text-base text-darkgrey pr-8 content-richtext"
                                        v-html="profilkomunitas.data.content">
                                    </div>
                                    <div class="mt-4 flex gap-4 max-md:mb-4">
                                        <a :href="profilkomunitas.data.twitter_link" target="_blank"><img
                                                class="w-[30px] md:w-[44px] h-[30px] md:h-[44px]" src="../assets/Logo-X.png"
                                                alt="Twitter"></a>
                                        <a :href="profilkomunitas.data.fb_link" target="_blank"><img
                                                class="w-[30px] md:w-[44px] h-[30px] md:h-[44px]"
                                                src="../assets/Logo-Facebook.png" alt="Facebook"></a>
                                        <a :href="profilkomunitas.data.ig_link" target="_blank"><img
                                                class="w-[30px] md:w-[44px] h-[30px] md:h-[44px]"
                                                src="../assets/Logo-Instagram.png" alt="Instagram"></a>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-12">
                                <div
                                    class="border-2 border-grey flex flex-col items-center px-4 pt-1 max-[900px]:w-auto w-full max-w-[972px] mx-auto relative">
                                    <p
                                        class="absolute bg-teal bottom-[75%] max-[900px]:right-[43%] right-[46%] px-4 py-1 rounded-lg font-inter font-bold text-lg md:text-xl text-white">
                                        VISI</p>
                                    <p class="p-4 font-poppins font-normal text-base md:text-lg text-darkgrey">
                                        {{ profilkomunitas.data.visi }}</p>
                                </div>
                                <div
                                    class="border-2 border-grey flex flex-col items-center px-4 pt-1 max-[900px]:w-auto w-full max-w-[972px] mx-auto relative">
                                    <p
                                        class="absolute bg-teal bottom-[75%] max-[900px]:right-[43%] right-[46%] px-4 py-1 rounded-lg font-inter font-bold text-lg md:text-xl text-white">
                                        MISI</p>
                                    <p class="p-4 font-poppins font-normal text-base md:text-lg text-darkgrey">
                                        {{ profilkomunitas.data.misi }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end items-end py-4 pr-4">
                            <a :href="'editprofilkomunitas'"><button
                                    class="bg-teal py-2 px-4 md:px-8 font-poppins font-bold text-base md:text-xl text-white leading-6 rounded-lg">Edit</button></a>
                        </div>
                    </div>
                    <!-- Ubah Foto Sampul -->
                    <div v-if="profilkomunitas.currentPage === 1"
                        class="bg-semitransparentwhite w-full max-w-[1022px] isolate rounded-xl shadow-lg border-2 border-teal">
                        <div class="flex flex-col md:flex-row justify-between">
                            <div class="flex flex-col md:flex-row">
                                <img class="max-w-[340px] p-4 max-h-[200px] mx-auto md:mx-0"
                                    :src="url + profilkomunitas.data.image_url" alt="foto-sampul">
                                <div class="p-4">
                                    <p class="font-bold font-poppins text-base md:text-lg lg:text-xl text-black">Ubah Foto
                                        Sampul</p>
                                    <p
                                        class="text-sm md:text-base text-[#FFFFFFB2] font-normal text-black font-poppins leading-6">
                                        Terakhir Diubah : {{ formatDate(profilkomunitas.data.updatedAt) }}</p>
                                </div>
                            </div>
                            <div class="flex justify-end items-end py-4 pr-4">
                                <button v-on:click="toggleModalEditFotoSampul()"
                                    class="bg-teal py-2 px-4 md:px-8 font-poppins font-bold text-base md:text-xl text-white leading-6 rounded-lg">Edit</button>
                            </div>
                        </div>
                    </div>
                    <!-- Ubah Email dan Kontak -->
                    <div v-if="infokontak"
                        class="bg-semitransparentwhite w-full max-w-[1022px] isolate rounded-xl shadow-lg border-2 border-teal mb-4">
                        <div class="flex flex-col md:flex-row justify-between">
                            <div class="flex flex-col md:flex-row">
                                <div class="p-4">
                                    <p class="font-bold font-poppins text-base md:text-lg lg:text-xl text-black">Ubah Email
                                        dan kontak komunitas</p>
                                    <p
                                        class="text-sm md:text-base text-[#FFFFFFB2] font-normal text-black font-poppins leading-6">
                                        Email : {{ infokontak.email_komunitas }}</p>
                                    <p
                                        class="text-sm md:text-base text-[#FFFFFFB2] font-normal text-black font-poppins leading-6">
                                        Kontak : {{ infokontak.kontak_komunitas }}</p>
                                </div>
                            </div>
                            <div class="flex justify-end items-end py-4 pr-4">
                                <button v-on:click="toggleModalEditKontak()"
                                    class="bg-teal py-2 px-4 md:px-8 font-poppins font-bold text-base md:text-xl text-white leading-6 rounded-lg">Edit</button>
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
                            <h3 class="text-2xl md:text-3xl lg:text-4xl text-teal font-semibold font-poppins">
                                Edit Profil Komunitas
                            </h3>
                            <button
                                class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-2xl md:text-3xl leading-none font-semibold outline-none focus:outline-none"
                                v-on:click="toggleModalEditProfilKomunitas()">
                                <span
                                    class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                </span>
                            </button>
                        </div>
                        <!--body-->
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Judul" class="font-poppins font-bold text-base text-teal">Judul</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="text" name="Judul" id="" placeholder="Judul">
                            </div>
                        </div>
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Deskripsi Komunitas"
                                    class="font-poppins font-bold text-base text-teal">Deskripsi Komunitas</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="text" name="Deskripsi Komunitas" id="" placeholder="Deskripsi Komunitas">
                            </div>
                        </div>
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Link Instagram" class="font-poppins font-bold text-base text-teal">Link
                                    Instagram</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="text" name="Link Instagram" id="" placeholder="Link Instagram">
                            </div>
                        </div>
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Link Facebook" class="font-poppins font-bold text-base text-teal">Link
                                    Facebook</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="text" name="Link Facebook" id="" placeholder="Link Facebook">
                            </div>
                        </div>
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Link Twitter" class="font-poppins font-bold text-base text-teal">Link
                                    Twitter</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="text" name="Link Twitter" id="" placeholder="Link Twitter">
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                            <router-link to="/createcerita">
                                <button
                                    class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-4 md:px-12 py-2 md:py-3 rounded outline-none focus:outline-none mr-1 mb-1">
                                    Simpan
                                </button>
                            </router-link>
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-4 md:px-6 py-2 md:py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button" v-on:click="toggleModalEditProfilKomunitas()">
                                Batal
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
                            <h3 class="text-2xl md:text-3xl lg:text-4xl text-teal font-semibold font-poppins">
                                Edit Foto Sampul
                            </h3>
                            <button
                                class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-2xl md:text-3xl leading-none font-semibold outline-none focus:outline-none"
                                v-on:click="toggleModalEditFotoSampul()">
                                <span
                                    class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                </span>
                            </button>
                        </div>
                        <!--body-->
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Foto Sampul" class="font-poppins font-bold text-base text-teal">Foto
                                    Sampul</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="file" accept=".jpg,.jpeg,.png" name="Foto Sampul" id="foto-sampul-input"
                                    @change="handleFileChange">
                                <p v-if="errorMessage" class="text-[#EF0307] font-semibold">{{ errorMessage }}</p>
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                            <button
                                class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-4 md:px-12 py-2 md:py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="submit">
                                Simpan
                            </button>
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-4 md:px-6 py-2 md:py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button" v-on:click="toggleModalEditFotoSampul()">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div v-if="ShowEditFotoSampul" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>

        <!-- Pop up modal buat edit kontak komunitas... -->
        <div>
            <form v-if="ShowEditKontak" @submit.prevent="editcontact()"
                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                <div class="relative w-auto my-6 mx-auto max-w-6xl">
                    <!--content-->
                    <div
                        class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <!--header-->
                        <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                            <h3 class="text-2xl md:text-3xl lg:text-4xl text-teal font-semibold font-poppins">
                                Edit Email dan Kontak Komunitas
                            </h3>
                            <button
                                class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-2xl md:text-3xl leading-none font-semibold outline-none focus:outline-none"
                                v-on:click="toggleModalEditKontak()">
                                <span
                                    class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                </span>
                            </button>
                        </div>
                        <!--body-->
                        <div class="flex flex-col gap-8 relative p-6">
                            <div class="flex gap-2 flex-col">
                                <label for="Email Komunitas" class="font-poppins font-bold text-base text-teal">Email
                                    Komunitas</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="text" name="Email Komunitas" id="email-komunitas"
                                    v-model="infokontak.email_komunitas">
                            </div>

                            <div class="flex gap-2 flex-col">
                                <label for="Kontak Komunitas" class="font-poppins font-bold text-base text-teal">Kontak
                                    Komunitas</label>
                                <input class="border border-black py-2 min-w-full md:min-w-[550px] pl-2 rounded-md"
                                    type="text" name="Kontak Komunitas" id="kontak-komunitas"
                                    v-model="infokontak.kontak_komunitas">
                            </div>
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                            <button
                                class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-4 md:px-12 py-2 md:py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="submit">
                                Simpan
                            </button>
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-4 md:px-6 py-2 md:py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button" v-on:click="toggleModalEditKontak()">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div v-if="ShowEditKontak" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
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

.content-richtext a {
    color: blue;
    text-decoration: underline;
}

.content-richtext b {
    font-weight: bold;
}

.content-richtext i {
    font-style: italic;
}

.content-richtext u {
    text-decoration: underline;
}

.content-richtext h1 {
    display: block;
    font-size: 2em;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
}

.content-richtext h2 {
    display: block;
    font-size: 1.5em;
    margin-top: 0.83em;
    margin-bottom: 0.83em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
}

.content-richtext h3 {
    display: block;
    font-size: 1.17em;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
}

.content-richtext ul {
    display: block;
    list-style-type: disc;
    margin-top: 1em;
    margin-bottom: 1 em;
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;
}

.content-richtext ol {
    display: block;
    list-style-type: decimal;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;
}
</style>