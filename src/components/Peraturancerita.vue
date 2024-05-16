<script>
import Sidebar from './Sidebar.vue'
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
            const tokenlogin = VueCookies.get('tokenlogin')
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/aturanBlog'
            axios.patch(url, this.aturanblog.data, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error)
                })
        },
    }

}

</script>

<template>
    <div class="flex">
        <Sidebar />

        <div class="w-[1200px] pl-8 my-4">
            <p class="font=gotham font-bold text-[30px] leading-6 text-sulfurblack mt-8 border-b border-[#D0D5DD] pb-4">Update Aturan Cerita</p>

            <div v-if="aturanblog.currentPage === 1"
                class="flex flex-col text-center bg-oceanteal rounded-md mt-16 py-8 px-16 mb-8 m-auto">
                <div class="font-poppins font-semibold text-[40px] p-8 text-white">
                    {{ aturanblog.data.title }}
                </div>
                <div v-html="aturanblog.data.content"
                    class="font-poppins font-normal text-[16px] flex flex-col items-center justify-center text-left m-auto w-[673px] text-offwhite px-8 whitespace-break-spaces">
                    
                </div>
                <div class="flex flex-col justify-end items-end" @click="toggleModalEditAturanBlog()">
                    <button
                        class="py-1 px-8 bg-white font-poppins font-bold text-[14px] text-teal rounded-lg">Edit</button>
                </div>


                <!-- Pop up Modal Aturan Blog -->
                <div>
                    <form v-if="showeditaturanblog" @submit.prevent="editaturan()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col max-w-[600px] bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-teal font-semibold font-poppins">
                                        Edit Aturan Blog
                                    </h3>
                                    <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        v-on:click="toggleModalEditAturanBlog()">
                                        <span
                                            class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        </span>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="flex flex-col gap-8 relative p-6">
                                    <div class="flex gap-2 flex-col">
                                        <label for="Judul" class="font-poppins font-bold text-base text-teal">Aturan Blog
                                        </label>
                                        <quill-editor theme="snow" contentType="html"
                                            v-model:content="aturanblog.data.content"></quill-editor>
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
                                        type="button" v-on:click="toggleModalEditAturanBlog()">
                                        batal
                                    </button>
                                </div>
                            </div>

                        </div>

                    </form>
                    <div v-if="showeditaturanblog" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>

            </div>
        </div>
    </div>
</template>

<style>
ol {
    list-style-type: decimal;
    margin-left: 1rem;
}
</style>