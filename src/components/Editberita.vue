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
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/berita/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.daftarberita = response.data.result.data
                this.editedData = this.daftarberita
                console.log(this.daftarberita)
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
            daftarberita: '',
            edited: {
                title: '',
                content: '',
                kategori: '',
                doi_link: '',
            },
            editedData: ""
        }
    },
    methods: {
        editberita(id) {
            const tokenlogin = VueCookies.get('tokenlogin')
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/berita/${id}`
            axios.patch(url, this.edited, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    this.$router.push('/berita')
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/berita')
                })
        },
    },
}
</script>

<template>
    <div>
        <form v-if="daftarberita" @submit.prevent="editberita(daftarberita.id)"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-teal font-semibold font-poppins">
                            Edit berita Komunitas
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
                            <label for="Judul" class="font-poppins font-bold text-base text-teal">Judul</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="edited.title" required name="Judul" id="" :placeholder="daftarberita.title">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="doi_link" class="font-poppins font-bold text-base text-teal">doi_link</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" name="tempat"
                                v-model="edited.doi_link" required :placeholder="daftarberita.doi_link">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Kategori" class="font-verdana font-normal text-base text-teal">Kategori</label>
                            <select name="" id="" class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" required
                                v-model="edited.kategori">
                                <option value="perkembanganCML" selected>Perkembangan CML</option>
                                <option value="perkembanganKomunitas">Perkembangan Komunitas</option>
                            </select>
                        </div>

                        <div class="flex gap-2 flex-col" required>
                            <label for="Deskripsi berita" class="font-poppins font-bold text-base text-teal">Deskripsi
                                berita</label>
                            <div class="border border-black py-2 min-w-[550px] pl-2 rounded-md" id="app">
                                <input type="text" name="" id="">
                                <quill-editor theme="snow" contentType="html" required
                                    v-model:content="edited.content" :content="editedData"></quill-editor>
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
                        <router-link to="/kegiatan">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
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