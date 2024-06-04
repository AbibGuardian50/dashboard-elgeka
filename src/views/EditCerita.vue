<script>
import axios from 'axios';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import Quill from "quill";
import Sidebar from "./Sidebar.vue"
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
            const id = this.$route.params.id
            const response = await axios.get(`https://elgeka-web-api-production.up.railway.app/api/v1/blog/${id}`);
            this.storyblog = response.data.result.data;
            const response_commentblog = await axios.get(`https://elgeka-web-api-production.up.railway.app/api/v1/blogComment/${id}`)
            this.commentblog = response_commentblog.data.result.data
            console.log(response)
            if (response.data.message === "Get Blog by ID Successfully") {
                toast.success('Data cerita pengguna berhasil dimuat')
            }
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
            commentblog: [],
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
        deletecomment(id) {
            const toast = useToast();
            if (confirm('Apakah kamu yakin untuk menghapus komentar ini?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/blogComment/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response)
                        if (response.data.message === "Your admin status is not active, authorization denied!") {
                            toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
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
            const toast = useToast();
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/blog/${id}`
            const tokenlogin = VueCookies.get('tokenlogin')
            this.storyblog.isVerified = this.storyblog.isVerified.toString();
            axios.patch(url, this.storyblog, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response)
                    if (response.data.message === "Update Blog by ID Successfully") {
                        toast.success('Cerita pengguna berhasil diubah')
                        this.$router.push('/verifikasicerita')
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                })
                .catch(error => {
                    console.log(error)
                    const toast = useToast();
                    toast.error('Edit cerita gagal, mohon coba lagi')
                })
        },
        formatDate(dateString) {
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
        async generateQuote() {
            try {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/blog/generate'
                const response = await axios.post(url, { prompt: this.prompt + "" + this.storyblog.content }, { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
                this.storyblog.content = response.data.result.generated_blog;
                console.log(response);
                const toast = useToast();
                if (response.data.message === "Generated Blog Successfully") {
                    toast.success('Hasil Generate AI berhasil')
                } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                    toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                }
            } catch (error) {
                const toast = useToast();
                toast.error('Hasil Generate AI error, mohon coba lagi')
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
                            <quill-editor class="font-poppins font-normal text-[20px] leading-7"
                                :toolbar="['bold', 'italic', 'underline', 'image']" contentType="html"
                                v-model:content="storyblog.content"></quill-editor>
                        </div>
                    </div>

                    <div class="max-w-[325px] flex-col">


                        <div class="flex gap-2 flex-col mt-8 px-2">
                            <label for="Status" class="font-poppins font-bold text-base text-teal">Status</label>
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
                                <label for="Generate Quote"
                                    class="font-poppins font-bold text-base text-teal">Bantuan(ChatGPT)</label>
                                <div class="flex flex-col justify-center items-center">
                                    <input
                                        class="border bg-white border-silver py-4 min-w-[320px] max-w-[325px] pl-2 rounded-lg shadow-[0px_1px_2px_0px_rgba(16, 24, 40, 0.05)] px-2 font-poppins font-medium text-base text-[#00000080]"
                                        type="text" name="username" id="" v-model="prompt" placeholder="Enter prompt here">
                                    <button type="button"
                                        class=" px-4 py-1 bg-teal text-white font-poppins font-bold rounded-lg my-2 flex flex-col"
                                        @click="generateQuote">Generate</button>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 py-4 mt-4 flex items-center justify-center text-base font-medium">
                            <a><button type="submit"
                                    class="py-1 px-4 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Simpan</button></a>
                            <a href="/verifikasicerita"
                                class="py-1 px-4 rounded-[5px] shadow-xl bg-semitransparantwhite bg-opacity-64 text-teal  ml-2 font-inter font-bold text-base border border-teal">Batal</a>
                        </div>
                    </div>
                </form>
            </div>
            <div class="pt-2 flex flex-col items-start mx-16" v-for="kolomkomentar in commentblog" name="kolom komentar">
                <div class="flex flex-col gap-2 py-4 border border-teal rounded-lg justify-start items-start">
                    <p class="max-w-[673px] px-4 text-black font-poppins font-bold text-base"> {{ kolomkomentar.user_name }}
                    </p>
                    <p class="min-w-[152px] max-w-[673px] px-4 text-[#636363D9] font-poppins font-base">{{
                        kolomkomentar.content }}</p>
                </div>
                <button href="#" @click="deletecomment(kolomkomentar.id)"
                                    class="py-1 px-8 rounded-[5px] shadow-xl bg-semitransparentwhite bg-opacity-64 text-teal ml-2 font-inter font-bold text-base">Hapus</button>
                <p class="px-4 text-[#9D9D9D] font-poppins text-[12px] tracking-wide">{{ formatDate(kolomkomentar.createdAt)
                }}</p>
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
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #000000B2;
}
</style>