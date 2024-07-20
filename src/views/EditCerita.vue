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
                    if (error.message === 'Request failed with status code 413') {
                        toast.error('Muatan gambar terlalu besar, mohon untuk melakukan upload foto dengan ukuran di bawah 1mb')
                    }
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

        <div class="pl-8 max-[520px]:pl-1">
            <div class="flex border-b border-silver mb-1 justify-between">
                <p class="font-gotham font-bold text-[30px] max-md:text-[25px] text-sulfurblack py-2">Edit</p>
            </div>


            <div>
                <form class="flex max-[800px]:flex-col" v-if="storyblog" @submit.prevent="editstory(storyblog.id)">
                    <div class="bg-seashell p-4">
                        <p class="font-gotham font-bold text-[30px] max-[520px]:text-[20px] text-sulfurblack py-2">{{
                            storyblog.title }}</p>
                        <div class="py-2 min-w-[720px] max-[800px]:min-w-full max-w-[721px] rounded-md" id="app">
                            <quill-editor class="font-poppins font-normal text-[20px] max-[520px]:text-[14px] leading-7"
                                :toolbar="['bold', 'italic', 'underline', 'image']" contentType="html"
                                v-model:content="storyblog.content"></quill-editor>
                        </div>
                    </div>

                    <div class="w-full max-w-[350px] md:ml-2 ml-1 flex-col">
                        <div class="flex gap-2 w-full flex-col mt-8 px-2 md:px-0 md:mr-[9px]">
                            <label for="Status" class="font-poppins font-bold text-base text-teal">Status</label>
                            <select
                                class="border bg-white border-silver py-4 w-full max-w-[350px] pl-2 rounded-lg shadow-[0px_1px_2px_0px_rgba(16, 24, 40, 0.05)] px-2 font-poppins font-medium text-base text-[#00000080]"
                                name="Status" id="" v-model="storyblog.isVerified">
                                <option value="false">Pending</option>
                                <option value="true">Disetujui</option>
                            </select>
                        </div>

                        <div class="flex flex-col gap-8 relative mt-8 w-full px-2 md:px-0 md:mr-[9px]">
                            <div class="flex gap-2 flex-col">
                                <label for="Generate Quote"
                                    class="font-poppins font-bold text-base text-teal">Bantuan(ChatGPT)</label>
                                <div class="flex flex-col justify-center items-center">
                                    <div class="relative w-full">
                                        <input
                                            class="border bg-white border-silver py-4 w-full  pr-8 rounded-lg shadow-[0px_1px_2px_0px_rgba(16, 24, 40, 0.05)] px-2 font-poppins font-medium text-base text-[#00000080]"
                                            type="text" name="username" id="" v-model="prompt"
                                            placeholder="Enter prompt here">
                                        <a target="_blank" href="/UserGuideCerita"><span
                                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_1706_972)">
                                                        <path
                                                            d="M6.06016 6.00004C6.2169 5.55449 6.52626 5.17878 6.93347 4.93946C7.34067 4.70015 7.81943 4.61267 8.28495 4.69252C8.75047 4.77236 9.17271 5.01439 9.47688 5.37573C9.78106 5.73706 9.94753 6.19439 9.94683 6.66671C9.94683 8.00004 7.94683 8.66671 7.94683 8.66671M8.00016 11.3334H8.00683M14.6668 8.00004C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8.00004C1.3335 4.31814 4.31826 1.33337 8.00016 1.33337C11.6821 1.33337 14.6668 4.31814 14.6668 8.00004Z"
                                                            stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round"
                                                            stroke-linejoin="round" />
                                                    </g>
                                                </svg>
                                            </span></a>
                                    </div>
                                    <button type="button"
                                        class="px-4 py-1 bg-teal text-white font-poppins font-bold rounded-lg my-2 flex flex-col"
                                        @click="generateQuote">Generate</button>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 py-4 mt-4 flex items-center justify-center text-base font-medium">
                            <a><button type="submit"
                                    class="py-1 px-4 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Simpan</button></a>
                            <a href="/verifikasicerita"
                                class="py-1 px-4 rounded-[5px] shadow-xl bg-semitransparantwhite bg-opacity-64 text-teal ml-2 font-inter font-bold text-base border border-teal">Batal</a>
                        </div>

                        <!-- Kolom Komentar -->
                        <div class="pt-2 flex flex-col w-full max-[520px]:pr-4" name="kolom komentar">
                            <h1 class="text-teal mb-4">Komentar :</h1>
                            <div v-for="kolomkomentar in commentblog">
                                <div class="gap-4 mb-1">
                                    <div
                                        class="flex flex-col gap-2 py-4 border border-teal rounded-lg justify-start items-start">
                                        <p class="w-full px-4 text-black font-poppins font-bold text-base">
                                            {{ kolomkomentar.user_name }}
                                        </p>
                                        <p class="w-full px-4 text-[#636363D9] font-poppins font-base">
                                            {{ kolomkomentar.content }}</p>
                                    </div>
                                    <p class="px-4 text-[#9D9D9D] font-poppins text-[12px] tracking-wide">{{
                                        formatDate(kolomkomentar.createdAt) }}</p>
                                </div>
                                <div class="flex items-center justify-center">
                                    <button href="#" @click="deletecomment(kolomkomentar.id)"
                                        class="py-1 px-4 rounded-[5px] bg-teal font-inter font-bold text-base text-white mb-4">Hapus</button>
                                </div>
                            </div>
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
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #000000B2;
}

@media (max-width: 520px) {
    .ql-container {
        font-size: 14px;
    }
}</style>