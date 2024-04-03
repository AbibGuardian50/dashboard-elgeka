<script>
import axios from 'axios'
import VueCookies from 'vue-cookies';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    async created() {
        try {
            const id = this.$route.params.id
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.daftarpengurus = response.data.result.data
                console.log(this.daftarkegiatan)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        QuillEditor
    },
    data() {
        return {
            daftarkegiatan: '',
            daftarpengurus: '',
            daftarpengurus: {
                full_name: '',
                jabatan: '',
                quote: '',
                image: [],
            },
        }
    },
    methods: {
        editpengurus(id) {
            const tokenlogin = VueCookies.get('tokenlogin')
            const formData = new FormData();
            formData.append('full_name', this.daftarpengurus.full_name);
            formData.append('jabatan', this.daftarpengurus.jabatan);
            formData.append('quote', this.daftarpengurus.quote);
            formData.append('image', this.daftarpengurus.image);

            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/memberKomunitas/${id}`
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    this.$router.push('/penguruskomunitas')
                    console.log(response.data)

                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/kegiatan')
                })
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.daftarpengurus.image = selectedFile;
        },
    }
}
</script>

<template>
    <div>
        <form v-if="daftarpengurus" @submit.prevent="editpengurus(daftarpengurus.id)"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-orange font-semibold font-poppins">
                            Edit
                        </h3>
                        <button
                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            v-on:click="toggleModalCreateAdmin()">
                            <span
                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            </span>
                        </button>
                    </div>
                    <!--body-->
                    <div class="flex flex-col gap-8 relative p-6">
                        <p class="font-gotham font-normal text-[20px] leading-6 text-sulfurblack">Edit Pengurus Komunitas</p>
                        <div class="flex gap-2 flex-col">
                            <label for="nama lengkap" class="font-poppins font-bold text-base text-orange">Nama
                                Lengkap</label>
                            <input required class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="daftarpengurus.full_name" name="nama lengkap" id=""
                                :placeholder="daftarpengurus.full_name">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Peran" class="font-poppins font-bold text-base text-orange">Role
                            </label>
                            <input required class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="daftarpengurus.jabatan" name="Peran" id="" :placeholder="daftarpengurus.jabatan">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Quote" class="font-poppins font-bold text-base text-orange">Deskripsi
                            </label>
                            <quill-editor required class="border border-black py-4 min-w-[550px] pl-2 rounded-md" theme="snow"
                                contentType="html" v-model:content="daftarpengurus.quote"></quill-editor>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Foto Profil" class="font-poppins font-bold text-base text-orange">Gambar
                                Lengkap</label>
                            <input @change="handleFileChange" class="border border-black py-4 min-w-[550px] pl-2 rounded-md"
                                type="file" name="Foto Profil" id="">
                        </div>




                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/penguruskomunitas">
                            <button
                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                batal
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>