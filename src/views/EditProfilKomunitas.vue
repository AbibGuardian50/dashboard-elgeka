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
                    toast.error('Profil komunitas gagal diubah, mohon coba lagi')
                })
        }

    }
}
</script>

<template>
    <div>
        <form v-if="communityprofile" @submit.prevent="editprofile()"
            class="fixed inset-0 z-50 flex justify-center overflow-y-auto mb-4 outline-none focus:outline-none">
            <div class="relative w-full max-w-4xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
                <!--content-->
                <div
                    class="border border-teal rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[24px] sm:text-[32px] md:text-[40px] text-teal font-semibold font-poppins">
                            Edit Profil Komunitas
                        </h3>
                    </div>
                    <!--body-->
                    <div class="flex flex-col gap-6 p-6">
                        <div>
                            <label for="Judul" class="font-poppins font-bold text-base text-teal">Judul</label>
                            <input class="border border-black py-2 w-full pl-2 rounded-md" type="text" name="Judul" required
                                v-model="communityprofile.title" :placeholder="communityprofile.title">
                        </div>
                        <div>
                            <label for="Deskripsi Komunitas" class="font-poppins font-bold text-base text-teal">Deskripsi
                                Komunitas</label>
                            <div class="border border-black py-2 w-full pl-2 rounded-md">
                                <quill-editor :toolbar="[{ 'header': [1, 2, false] },'bold', 'italic', 'underline', 'link',  , {'list': 'ordered'}, {'list': 'bullet'}]" theme="snow"
                                    contentType="html" v-model:content="communityprofile.content" required></quill-editor>
                                <p v-if="isContentEmpty" class="text-red text-sm mt-1">Konten tidak boleh kosong.</p>
                            </div>
                        </div>
                        <div>
                            <label for="Link Instagram" class="font-poppins font-bold text-base text-teal">Link
                                Instagram</label>
                            <input class="border border-black py-2 w-full pl-2 rounded-md" type="text" name="Link Instagram"
                                v-model="communityprofile.ig_link" :placeholder="communityprofile.ig_link">
                        </div>
                        <div>
                            <label for="Link Facebook" class="font-poppins font-bold text-base text-teal">Link
                                Facebook</label>
                            <input class="border border-black py-2 w-full pl-2 rounded-md" type="text" name="Link Facebook"
                                v-model="communityprofile.fb_link" :placeholder="communityprofile.fb_link">
                        </div>
                        <div>
                            <label for="Link Twitter" class="font-poppins font-bold text-base text-teal">Link
                                Twitter</label>
                            <input class="border border-black py-2 w-full pl-2 rounded-md" type="text" name="Link Twitter"
                                v-model="communityprofile.twitter_link" :placeholder="communityprofile.twitter_link">
                        </div>
                        <div>
                            <label for="Visi" class="font-poppins font-bold text-base text-teal">Visi</label>
                            <input class="border border-black py-2 w-full pl-2 rounded-md" type="text" name="Visi"
                                v-model="communityprofile.visi" :placeholder="communityprofile.visi">
                        </div>
                        <div>
                            <label for="Misi" class="font-poppins font-bold text-base text-teal">Misi</label>
                            <input class="border border-black py-2 w-full pl-2 rounded-md" type="text" name="Misi"
                                v-model="communityprofile.misi" :placeholder="communityprofile.misi">
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-end p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-2 rounded outline-none focus:outline-none mr-2"
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/profilkomunitas">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-2 rounded outline-none focus:outline-none"
                                type="button">
                                Batal
                            </button>
                        </router-link>
                    </div>
                </div>
        </div>
    </form>
</div></template>