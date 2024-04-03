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
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.daftarkegiatan = response.data.result.data
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
            daftarkegiatan: {
                title: '',
                content: '',
                tempat: '',
                date: '',
            }
        }
    },
    methods: {
        editkegiatan(id) {
            const tokenlogin = VueCookies.get('tokenlogin')
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas/${id}`
            axios.patch(url, this.daftarkegiatan, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    this.$router.push('/kegiatan')
                    console.log(response.data)

                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/kegiatan')
                })
        },
    }
}
</script>

<template>
    <div>
        <form v-if="daftarkegiatan" @submit.prevent="editkegiatan(daftarkegiatan.id)"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-orange font-semibold font-poppins">
                            Edit Kegiatan Komunitas
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
                        <div class="flex gap-2 flex-col">
                            <label for="Judul" class="font-poppins font-bold text-base text-orange">Judul</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="daftarkegiatan.title" name="Judul" id="" :placeholder="daftarkegiatan.title">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="tempat" class="font-poppins font-bold text-base text-orange">Tempat</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" name="tempat" 
                            v-model="daftarkegiatan.tempat" :placeholder="daftarkegiatan.tempat">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Deskripsi Kegiatan" class="font-poppins font-bold text-base text-orange">Deskripsi
                                Kegiatan</label>
                            <div class="border border-black py-2 min-w-[550px] pl-2 rounded-md" id="app">
                                <quill-editor theme="snow" contentType="html"
                                    v-model:content="daftarkegiatan.content"><p>{{ daftarkegiatan.content }}</p></quill-editor>
                            </div>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Tanggal" class="font-poppins font-bold text-base text-orange">Tanggal</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" name="Tanggal"
                                v-model="daftarkegiatan.date" id="" :placeholder="daftarkegiatan.date">
                        </div>


                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/kegiatan">
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