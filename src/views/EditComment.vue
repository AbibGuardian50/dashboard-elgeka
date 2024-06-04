<script>
import Sidebar from "./Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        const toast = useToast();
        try {
            const id = this.$route.params.id
            const response_commentblog = await axios.get(`https://elgeka-web-api-production.up.railway.app/api/v1/blogComment/${id}`)
            this.commentblog = response_commentblog.data.result.data
            // console.log(this.usertoken)
        } catch (error) {
            console.error(error);
            toast.error('Terdapat kesalahan sistem, mohon coba lagi')
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            commentblog: [],
        }
    },
    methods: {
        formatDate(dateString) {
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
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
    }
}
</script>

<template>
    <div class="flex">
        <Sidebar />

        <div>
            <p class="pl-16 font-poppins font-bold text-[24px] text-black">Komentar :</p>

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