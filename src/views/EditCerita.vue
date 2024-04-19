<script>
import axios from 'axios'
import Quill from "quill";
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
            const response = await axios.get(`https://elgeka-web-api-production.up.railway.app/api/v1/blog/${id}`);
            this.storyblog = response.data.result.data;
            console.log(this.storyblog)
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        QuillEditor
    },
    data() {
        return {
            prompt: '',
            storyblog: [],
            storyblog: {
                author_id: [],
                author_name: [],
                title: [],
                content: [],
                isVerified: [],
            },
        }
    },
    methods: {
        deletestory(id) {
            if (confirm('Apakah kamu yakin untuk menghapus Cerita Blog ini?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/blog/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data)
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
        editstory(id) {
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/blog/${id}`
            const tokenlogin = VueCookies.get('tokenlogin')
            axios.patch(url, this.storyblog, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    this.$router.push('/verifikasicerita')
                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/verifikasicerita')
                })
        },
        async generateQuote() {
            try {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/blog/generate'
                const response = await axios.post(url, { prompt: this.prompt }, { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
                this.storyblog.content = response.data.result.generated_blog;
                console.log(response.data);
            } catch (error) {
                console.error('Error generating quote:', error);
            }
        },
    }
}
</script>

<template>
    <div>
        <form v-if="storyblog" @submit.prevent="editstory(storyblog.id)"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-[600px] my-6 mx-auto max-w-6xl">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-fit bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-orange font-semibold font-poppins">
                            Edit Cerita
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
                            <label for="Nama" class="font-poppins font-bold text-base text-orange">Nama
                            </label>
                            <input class="border border-black py-2 min-w-[520px] max-w-[531px] pl-2 rounded-md" type="text"
                                name="Nama" id="" v-model="storyblog.author_name">
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="Deskripsi Komunitas"
                                class="font-poppins font-bold text-base text-orange">Cerita</label>
                            <div class="border border-black py-2 min-w-[520px] max-w-[531px] pl-2 rounded-md" id="app">
                                <quill-editor :toolbar="['bold', 'italic', 'underline', 'image']" theme="snow"
                                    contentType="html" v-model:content="storyblog.content"></quill-editor>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="Status" class="font-poppins font-bold text-base text-orange">Status</label>
                            <select
                                class="border bg-white border-black py-4 min-w-[520px] max-w-[531px] pl-2 rounded-md font-poppins font-medium text-base text-[#00000080]"
                                name="Status" id="" v-model="storyblog.isVerified">
                                <option value="false">Pending</option>
                                <option value="true">Verified</option>
                            </select>
                        </div>

                    </div>

                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="Generate Quote" class="font-poppins font-bold text-base text-orange">Generate Quote
                                (ChatGPT)</label>
                            <div class="flex flex-col">
                                <input class="border border-black py-4 min-w-[520px] max-w-[531px] pl-2 rounded-md"
                                    type="text" name="username" id="" v-model="prompt" placeholder="Enter prompt here">
                                <button type="button"
                                    class="w-[150px] py-1 bg-orange text-white font-poppins rounded-md my-2 flex flex-col"
                                    @click="generateQuote">Generate</button>

                            </div>
                        </div>

                    </div>

                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Update
                        </button>
                        <router-link to="/verifikasicerita">
                            <button
                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                Cancel
                            </button>
                        </router-link>

                    </div>
                </div>
            </div>
        </form>
    </div>
</template>