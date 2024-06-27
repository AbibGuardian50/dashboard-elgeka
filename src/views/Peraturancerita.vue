<script>
import Sidebar from './Sidebar.vue'
import axios from 'axios'
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
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/aturanBlog');
            this.aturanblog = response.data.result;
            console.log(this.aturanblog)
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar,
        QuillEditor,
    },
    data() {
        return {
            aturanblog: [],
            showeditaturanblog: false,
            aturanblog: {
                data: {
                    content: [],
                }
            }
        }
    },
    methods: {
        toggleModalEditAturanBlog: function () {
            this.showeditaturanblog = !this.showeditaturanblog;
        },
        editaturan() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('tokenlogin')
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/aturanBlog'
            axios.patch(url, this.aturanblog.data, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response)
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                    if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
    }

}

</script>

<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <div class="max-w-[1200px] w-full pl-1 pr-[0.4rem]  my-4 bg-offwhite flex-grow">
            <p class="title-style">Update Aturan Cerita</p>

            <div v-if="aturanblog.currentPage === 1"
                class="flex flex-col text-center bg-oceanteal rounded-md mt-8 py-8 px-6 mb-8 mx-auto">
                <div class="text-[30px] max-lg:text-[25px] max-md:text-[20px] max-sm:text-[17px] text-white font-poppins font-bold">
                    {{ aturanblog.data.title }}
                </div>
                <div v-html="aturanblog.data.content"
                    class="font-poppins font-normal text-[14px] md:text-[16px] flex flex-col items-center justify-center text-left mx-auto w-full md:w-[673px] text-semitransparentwhite px-4 md:px-8 whitespace-break-spaces">
                </div>
                <div class="flex justify-end items-end mt-4" @click="toggleModalEditAturanBlog()">
                    <button
                        class="py-1 px-6 md:px-8 bg-white font-poppins font-bold text-[14px] text-teal rounded-lg">Edit</button>
                </div>

                <!-- Pop up Modal Aturan Blog -->
                <div v-if="showeditaturanblog">
                    <form @submit.prevent="editaturan()" class="fixed inset-0 z-50 flex items-center justify-center">
                        <div class="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
                            <!--content-->
                            <div class="border rounded-lg shadow-lg flex flex-col bg-white outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[24px] md:text-[40px] text-teal font-semibold font-poppins">Edit Aturan
                                        Blog</h3>
                                    <button
                                        class="ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        @click="toggleModalEditAturanBlog()">
                                        <span
                                            class="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">&times;</span>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="flex flex-col gap-4 md:gap-8 p-6">
                                    <div class="flex flex-col gap-2">
                                        <label for="Judul" class="font-poppins font-bold text-base text-teal">Aturan
                                            Blog</label>
                                        <quill-editor theme="snow" contentType="html"
                                            v-model:content="aturanblog.data.content"></quill-editor>
                                    </div>
                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b gap-4">
                                    <button type="submit"
                                        class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-8 md:px-12 py-2 md:py-3 rounded outline-none focus:outline-none">Simpan</button>
                                    <button type="button" @click="toggleModalEditAturanBlog()"
                                        class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 md:px-8 py-2 md:py-3 rounded outline-none focus:outline-none">Batal</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="fixed inset-0 z-40 bg-black opacity-25"></div>
                </div>
        </div>
    </div>
</div></template>

<style>ol {
    list-style-type: decimal;
    margin-left: 1rem;
}</style>