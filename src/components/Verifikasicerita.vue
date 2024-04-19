<script>
import Sidebar from "./Sidebar.vue"
import axios from "axios"
import VueCookies from 'vue-cookies';
import moment from 'moment';
import 'moment/locale/id';

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
        formatDateTime(dateTimeString) {
            moment.locale('id');
            return moment(dateTimeString).format('LLL');
        },
    }
}
</script>

<template>
    <div class="flex ">
        <Sidebar />
        <div class="px-8">
            <p class="font-gotham font-bold text-[30px] text-sulfurblack">Verifikasi Cerita User</p>
            <hr class="border-[#D0D5DD]">

            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Nomor
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Tanggal Dibuat
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Nama
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Media
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Judul
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left font-gotham text-black text-base w-[300px] font-normal">
                                Cerita
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Status
                            </th>
                        </tr>
                    </thead>


                    <tbody v-for="data in DaftarVerifCerita" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-base text-black text-center">
                                1
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-base text-black">
                                {{ formatDateTime(data.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">

                                    <div class="">
                                        <div class="text-base font-medium text-gray-900">
                                            {{ data.author_name }}
                                        </div>

                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-base font-medium">
                                <button href="#"
                                    class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Lihat</button>
                            </td>
                            <td class="px-6 py-4 max-w-[300px]">
                                <p class="text-base text-gray-900">{{ data.title }}</p>
                            </td>
                            <td class="px-6 py-4 max-w-[300px]">
                                <div class="text-base text-gray-900" v-html="data.content"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span v-if="data.isVerified === true"
                                    class="inline-flex text-base text-black leading-5 font-bold font-inter rounded-md">
                                   Sudah di Verifikasi
                                </span>

                                <span v-if="data.isVerified === false"
                                    class="inline-flex text-base text-black leading-5 font-bold font-inter rounded-md">
                                   Pending
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-base font-medium">
                                <a :href="'editcerita/' + data.id"><button
                                        class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button></a>
                                <button href="#"
                                    class="py-1 px-8 rounded-[5px] shadow-xl bg-offwhite bg-opacity-64 text-orange  ml-2 font-inter font-bold text-base">Hapus</button>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>

    </div>
</template>
