<script>
import Sidebar from "./Sidebar.vue"
import axios from "axios"

export default {
    components: {
        Sidebar
    },

    async created() {
        try {
            const tokenlogin = sessionStorage.getItem('tokenlogin')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                sessionStorage.getItem('tokenlogin')
                this.daftarkegiatan = response.data.result.data
                this.daftarkegiatan.sort((x, y) => x.id - y.id)
                console.log(this.daftarkegiatan)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },

    data() {
        return {
            daftarkegiatan: [],
            error: '',
        }
    },
    methods: {

    }
}
</script>

<template>
    <div class="flex ">
        <Sidebar />

        <div class="px-8">
            <p class="font-gotham font-bold text-[30px] text-sulfurblack">Update Kegiatan</p>
            <hr class="border-[#D0D5DD]">
            <p class="my-4 font-gotham font-normal text-[20px] text-sulfurblack">Tentang Kegiatan</p>

            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto max-w-[1400px]">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Nomor
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Tanggal
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Judul
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Media
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left font-gotham text-black text-base w-[300px] font-normal">
                                
                            </th>
                            <!-- <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500 font-normal">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500 font-normal">
                Email
              </th> -->
                        </tr>
                    </thead>

                    <tbody v-for="data in daftarkegiatan" :key="data.id" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-black text-base">
                                {{ data.id }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                                    <div class="">
                                        <div class="font-gotham font-normal text-black text-base">
                                            {{ data.date }}
                                        </div>
                                        <!-- <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <p class="font-gotham font-normal text-black text-base underline">{{ data.title }}</p>

                            </td>
                            <td class="px-6 py-4 max-w-[300px]">
                                <span class="text-base text-gray-900">
                                    {{ data.content }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                <button href="#" v-on:click="toggleModalEditAdmin()"
                                    class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button>
                                <button href="#"
                                    class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
                            </td>
                        </tr>

                        <!-- More rows... -->

                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>
