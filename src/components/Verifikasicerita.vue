<script>
import Sidebar from "./Sidebar.vue"
import axios from "axios"
import VueCookies from 'vue-cookies';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import { useToast } from 'vue-toastification';


export default {
    async created() {
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/blog'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })

                this.DaftarVerifCerita = response.data.result.data
                this.DaftarVerifCerita.forEach((item, index) => {
                    item.no = index + 1;
                });
                this.totalPages = Math.ceil(this.DaftarVerifCerita.length / this.perPage);
                this.updatePaginatedData();
                console.log(response)
                if (response.data.message === "Get Blog Successfully") {
                    toast.success('Data cerita pengguna berhasil dimuat')
                }
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
            paginatedData: [],
            currentPage: 1,
            perPage: 10,
            totalPages: 0,
            error: '',
        }
    },
    methods: {
        formatDate(dateString) {
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
        updatePaginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = this.currentPage * this.perPage;
            this.paginatedData = this.DaftarVerifCerita.slice(start, end);
        },
        goToPage(pageNumber) {
            this.currentPage = pageNumber;
            this.updatePaginatedData();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updatePaginatedData();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePaginatedData();
            }
        },
        deletecerita(id) {
            const toast = useToast();
            if (confirm('Apakah kamu yakin untuk menghapus cerita ini?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/blog/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response)
                        window.location.reload();
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
    <div class="flex bg-offwhite">
        <Sidebar />
        <div class="max-[800px]:px-1 px-8 bg-offwhite">
            <p class="title-style">Verifikasi Cerita</p>
            <hr class="border-[#D0D5DD]">
            <p class="font-gotham font-normal text-[20px] max-md:text-[15px] text-sulfurblack py-2">Cerita User</p>
            <hr class="border-[#D0D5DD]">

            <div>
                <table class="min-w-full divide-y divide-gray-200 max-[1300px]:overflow-x-visible overflow-x-auto">

                    <tbody v-for="data in paginatedData" :key="data.id" class="bg-offwhite divide-y divide-gray-200">
                        <tr>
                            <div class="px-6 max-[800px]:px-1 py-4 max-w-[400px] max-md:mr-2 mr-32">
                                <p class="text-[20px] max-md:text-[15px] leading-5 font-inter font-bold text-fullblack">{{ data.title }}</p>
                                <div class="flex gap-1">
                                    <p class="font-poppins font-normal max-md:text-[10px] text-[12px] leading-4 text-transparentblack">{{
                                        data.author_name }}</p>
                                    <p class="font-poppins font-normal max-md:text-[10px] text-[12px] leading-4 text-transparentblack">-</p>
                                    <p class="font-poppins font-normal max-md:text-[10px] text-[12px] leading-4 text-transparentblack">{{
                                        formatDate(data.createdAt) }}</p>
                                    <p class="font-poppins font-normal max-md:text-[10px] text-[12px] leading-4 text-transparentblack ml-4"
                                        v-if="data.isVerified === false">Pending</p>
                                    <p class="font-poppins font-normal max-md:text-[10px] text-[12px] leading-4 text-transparentblack ml-4"
                                        v-else-if="data.isVerified === true">Disetujui</p>
                                </div>
                            </div>

                            <td class="px-6 py-4 whitespace-nowrap text-base font-medium max-[800px]:flex max-[800px]:flex-col max-[800px]:gap-2 max-[800px]:items-center">
                                <a :href="'editcerita/' + data.id"><button
                                        class="btn-edit">Edit</button></a>
                                <!-- <a :href="'EditComment/' + data.id"><button
                                        class="py-1 px-8 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Edit Komentar</button></a> -->
                                <button href="#" @click="deletecerita(data.id)"
                                    class="btn-hapus">Hapus</button>
                            </td>
                        </tr>
                    </tbody>

                </table>

                <div class="flex justify-center mt-4">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2 mr-2 bg-teal text-white rounded-md">Previous</button>
                    <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                        :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                        class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-teal text-white rounded-md">Next</button>
                </div>
            </div>
        </div>
    </div>
</template>
