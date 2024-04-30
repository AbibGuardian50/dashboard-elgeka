<script>
import axios from 'axios';
import Quill from "quill";
import Sidebar from "./Sidebar.vue"
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
        QuillEditor,
        Sidebar
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
                isVerified: '',
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
            this.storyblog.isVerified = this.storyblog.isVerified.toString();
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
                const response = await axios.post(url, { prompt: this.prompt + "" + this.storyblog.content }, { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
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
    <div class="flex">
        <Sidebar />

        <div class="pl-8">
            <div class="flex border-b border-silver mb-1 justify-between">
                <p class="font-gotham font-bold text-[30px] text-sulfurblack py-2">Edit</p>
            </div>


            <div>
                <form class="flex" v-if="storyblog" @submit.prevent="editstory(storyblog.id)">
                    <div class="bg-[#EEE8E7] p-4">
                        <p class="font-gotham font-bold text-[30px] text-sulfurblack py-2">{{ storyblog.title }}</p>
                        <div class="py-2 min-w-[720px] max-w-[721px] rounded-md" id="app">
                                <quill-editor class="font-poppins font-normal text-[20px] leading-7" :toolbar="['bold', 'italic', 'underline', 'image']"
                                    contentType="html" v-model:content="storyblog.content"></quill-editor>
                            </div>
                    </div>

                    <div class="max-w-[325px] flex-col">


                        <div class="flex gap-2 flex-col mt-8 px-2">
                            <label for="Status" class="font-poppins font-bold text-base text-orange">Status</label>
                            <!-- <input class="border border-black py-4 min-w-[550px] pr-2 rounded-md" type="text" name="nama lengkap" id="" placeholder="  Muhammad Abieb Basnuril"> -->
                            <select
                                class="border bg-white border-silver py-4 min-w-[320px] max-w-[325px] pl-2 rounded-lg shadow-[0px_1px_2px_0px_rgba(16, 24, 40, 0.05)] px-2 font-poppins font-medium text-base text-[#00000080]"
                                name="Status" id="" v-model="storyblog.isVerified">
                                <option value="false">Pending</option>
                                <option value="true">Disetujui</option>
                            </select>
                        </div>

                        <div class="flex flex-col gap-8 relative mt-8 px-2">
                            <div class="flex gap-2 flex-col">
                                <label for="Generate Quote" class="font-poppins font-bold text-base text-orange">Generate
                                    Quote
                                    (ChatGPT)</label>
                                <div class="flex flex-col justify-center items-center">
                                    <input
                                        class="border bg-white border-silver py-4 min-w-[320px] max-w-[325px] pl-2 rounded-lg shadow-[0px_1px_2px_0px_rgba(16, 24, 40, 0.05)] px-2 font-poppins font-medium text-base text-[#00000080]"
                                        type="text" name="username" id="" v-model="prompt" placeholder="Enter prompt here">
                                    <button type="button"
                                        class=" px-4 py-1 bg-orange text-white font-poppins font-bold rounded-lg my-2 flex flex-col"
                                        @click="generateQuote">Generate</button>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 py-4 mt-4 flex items-center justify-center text-base font-medium">
                            <a><button type="submit"
                                    class="py-1 px-4 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Simpan</button></a>
                            <button href="/verifikasicerita"
                                class="py-1 px-4 rounded-[5px] shadow-xl bg-offwhite bg-opacity-64 text-orange  ml-2 font-inter font-bold text-base border border-orange">Batal</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style>
/* select {
    direction: rtl;
}

select option {
    direction: ltr;
} */

/* .ql-toolbar.ql-snow {
    border : 0
} */

.ql-container {
    font-size : 20px;
    font-weight: 400;
    line-height: 30px;
    color: #000000B2;
}
</style>