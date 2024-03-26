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
                            <!-- <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500 font-normal">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500 font-normal">
                Email
              </th> -->
                            <th scope="col" class="">
                                <button
                                    class="bg-orange px-2 py-1 text-left font-gotham text-black text-base font-normal ml-24">+</button>
                            </th>
                        </tr>
                    </thead>

                    
                        <tbody v-for="data in DaftarVerifCerita" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-base text-black text-center">
                                    1
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-base text-black">
                                    {{formatDateTime(data.createdAt)}}
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
                                    <p class="text-base text-gray-900">{{ data.content }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="py-2 px-8 inline-flex text-base text-white leading-5 font-bold font-inter rounded-md bg-yellow">
                                        Pending
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap  text-base font-medium">
                                    <button href="#"
                                        class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Setuju</button>
                                    <button href="#"
                                        class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
                                </td>
                            </tr>
                        </tbody>

                </table>
            </div>
        </div>

    </div>
</template>
