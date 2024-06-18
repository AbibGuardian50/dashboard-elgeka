<script>
import axios from 'axios'
import Quill from "quill";
import VueCookies from 'vue-cookies';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
            const toast = useToast();
            const response = await axios.get(`https://elgeka-web-api-production.up.railway.app/api/v1/profilKomunitas`);
            this.communityprofile = response.data.result.data;
            console.log(response)
            if (response.data.message === "Get Profil Komunitas Successfully") {
                toast.success('Data profil komunitas berhasil dimuat')
            }
            this.datacontent = this.communityprofile
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        QuillEditor
    },
    data() {
        return {
            isContentEmpty: false,
            communityprofile: [],
            communityprofile: {
                title: [],
                content: [],
                ig_link: [],
                fb_link: [],
                twitter_link: [],
                visi: [],
                misi: [],
            },
        }
    },
    methods: {
        editprofile() {
            if (!this.communityprofile.content) {
                this.isContentEmpty = true; // Set isContentEmpty menjadi true jika konten Quill Editor kosong
                return; // Berhenti jika konten Quill Editor kosong
            }
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/profilKomunitas'
            const tokenlogin = VueCookies.get('tokenlogin')
            axios.patch(url, this.communityprofile, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response)
                    if (response.data.message === "Update Profil Komunitas Successfully") {
                        const toast = useToast();
                        toast.success('Data profil komunitas berhasil diubah, halaman akan redirect otomatis dalam beberapa detik')
                        setTimeout(() => { // Menggunakan arrow function di sini
                            this.$router.push('/profilkomunitas')
                        }, 2000);
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                })
                .catch(error => {
                    console.log(error)
                    toast.error ('Profil komunitas gagal diubah, mohon coba lagi')
                })
        }

    }
}
</script>

<template>
    <div>
        <form v-if="communityprofile" @submit.prevent="editprofile()"
            class="overflow-x-hidden max-[600px]:overflow-x-visible overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center flex">
            <div class="relative w-[100rem] my-6 mx-auto max-w-6xl">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-teal font-semibold font-poppins">
                            Edit Profil Komunitas
                        </h3>
                        <button
                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
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
                            <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text" name="Judul"
                                required id="" v-model="communityprofile.title" :placeholder="communityprofile.title">
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="Deskripsi Komunitas" class="font-poppins font-bold text-base text-teal">Deskripsi
                                Komunitas
                            </label>
                            <div class="border border-black py-2 min-w-[550px] pl-2 rounded-md" id="app">
                                <quill-editor :toolbar="['bold', 'italic', 'underline', 'image']" theme="snow"
                                    contentType="html" v-model:content="communityprofile.content" required></quill-editor>
                                <p v-if="isContentEmpty" class="text-red text-sm mt-1">Konten tidak boleh kosong.</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6 py-4">
                        <div class="flex gap-2 flex-col">
                            <label for="Link Instagram" class="font-poppins font-bold text-base text-teal">Link
                                Instagram
                            </label>
                            <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                name="Link Instagram" v-model="communityprofile.ig_link" id=""
                                :placeholder="communityprofile.ig_link">
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6 py-4">
                        <div class="flex gap-2 flex-col">
                            <label for="Link Facebook" class="font-poppins font-bold text-base text-teal">Link
                                Facebook
                            </label>
                            <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                name="Link Facebook" id="" v-model="communityprofile.fb_link"
                                :placeholder="communityprofile.fb_link">
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6 py-4">
                        <div class="flex gap-2 flex-col">
                            <label for="Link Twitter" class="font-poppins font-bold text-base text-teal">Link Twitter
                            </label>
                            <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text"
                                name="Link Twitter" id="" v-model="communityprofile.twitter_link"
                                :placeholder="communityprofile.twitter_link">
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6 py-4">
                        <div class="flex gap-2 flex-col">
                            <label for="Visi" class="font-poppins font-bold text-base text-teal">Visi
                            </label>
                            <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text" name="Visi"
                                id="" v-model="communityprofile.visi" :placeholder="communityprofile.visi">
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6 py-4">
                        <div class="flex gap-2 flex-col">
                            <label for="Misi" class="font-poppins font-bold text-base text-teal">Misi
                            </label>
                            <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="text" name="Misi"
                                id="" v-model="communityprofile.misi" :placeholder="communityprofile.misi">
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/profilkomunitas">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                Batal
                            </button>
                        </router-link>

                    </div>
                </div>
            </div>
        </form>
    </div>
</template>