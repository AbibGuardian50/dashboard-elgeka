<script>
import Sidebar from "./Sidebar.vue"
import axios from "axios"
import VueCookies from 'vue-cookies';
import moment from 'moment';
import 'moment/locale/id';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import idLocale from 'date-fns/locale/id';

export default {
    async created() {
        try {
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/blog'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.DaftarVerifCerita = response.data.result.data
                // this.DaftarVerifCerita.sort((x, y) => x.id - y.id)
                this.DaftarVerifCerita.forEach((item, index) => {
                    item.no = index + 1;
                });
                this.StatusVerifCerita = response.data.result.data.isVerified
                console.log(this.StatusVerifCerita)
                console.log(this.DaftarVerifCerita)
                // this.daftaradmin.sort((x, y) => x.id - y.id)
                // this.daftaradmin.forEach((item, index) => {
                //     item.no = index + 1;
                // });
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            DaftarVerifCerita: [],
            StatusVerifCerita: ''
        }
    },
    methods: {
        formatDate(dateString) {
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
        deletecerita(id) {
            if (confirm('Apakah kamu yakin untuk menghapus cerita ini?')) {
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
    }
}
</script>

<template>
    <div class="flex ">
        <Sidebar />
        <div class="px-8">
            <p class="font-gotham font-bold text-[30px] text-sulfurblack py-2">Verifikasi Cerita</p>
            <hr class="border-[#D0D5DD]">
            <p class="font-gotham font-normal text-[20px] text-sulfurblack py-2">Cerita User</p>
            <hr class="border-[#D0D5DD]">

            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">

                    <tbody v-for="data in DaftarVerifCerita" :key="data.id" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <div class="px-6 py-4 max-w-[400px] mr-32">
                                <p class="text-[20px] leading-5 font-inter font-bold text-fullblack">{{ data.title }}</p>
                                <div class="flex gap-1">
                                    <p class="font-poppins font-normal text-[12px] leading-4 text-transparentblack">{{ data.author_name }}</p>
                                    <p class="font-poppins font-normal text-[12px] leading-4 text-transparentblack">-</p>
                                    <p class="font-poppins font-normal text-[12px] leading-4 text-transparentblack">{{ formatDate(data.createdAt) }}</p>
                                    <p class="font-poppins font-normal text-[12px] leading-4 text-transparentblack ml-4" v-if="data.isVerified === false">Pending</p>
                                    <p class="font-poppins font-normal text-[12px] leading-4 text-transparentblack ml-4" v-else-if="data.isVerified === true">Disetujui</p>
                                </div>
                            </div>

                            <td class="px-6 py-4 whitespace-nowrap  text-base font-medium">
                                <a :href="'editcerita/' + data.id"><button
                                        class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button></a>
                                <button href="#" @click="deletecerita(data.id)"
                                    class="py-1 px-8 rounded-[5px] shadow-xl bg-offwhite bg-opacity-64 text-orange  ml-2 font-inter font-bold text-base">Hapus</button>
                            </td>
                            <!-- <td class="px-6 py-4 whitespace-nowrap">
                                <span v-if="data.isVerified === true"
                                    class="inline-flex text-base text-black leading-5 font-bold font-inter rounded-md">
                                    Sudah di Verifikasi
                                </span>

                                <span v-if="data.isVerified === false"
                                    class="inline-flex text-base text-black leading-5 font-bold font-inter rounded-md">
                                    Pending
                                </span>
                            </td> -->
                            
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>

    </div>
</template>
