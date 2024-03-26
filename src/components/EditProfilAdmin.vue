<script>
import Sidebar from './Sidebar.vue'
import VueCookies from 'vue-cookies';
import axios from 'axios';
export default {
    async created() {
        try {
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const AdminId = VueCookies.get('id_user')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${AdminId}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.profiladmin = response.data.result.data
                console.log(this.profiladmin)
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
            profiladmin: [],
            edited: {
                full_name: '',
                email: ''
            },
            statuscode: '',
        }
    },
    methods: {
        editprofiladmin() {
            const tokenlogin = VueCookies.get('tokenlogin')
            const AdminId = VueCookies.get('id_user')
            // const toast = useToast();
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${AdminId}`
            axios.patch(url, this.edited, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    this.statuscode = response.data.code
                    if (response.data.code === 200) {
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000);

                    } else if (response.data.code === 400) {
                        console.log(response)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
    }

}
</script>

<template>
    <div class="flex">
        <Sidebar />

        <div>
            <p class="pt-[4rem] ml-4 font-poppins font-semibold text-orange text-[32px]">Informasi Tentang anda</p>
            <div class="flex gap-16">
                <div v-if="profiladmin.is_active === true" class="border border-orange mt-4 ml-4 pb-8 px-8">
                    <div class="flex my-8 gap-8 items-center">

                        <div class="flex flex-col">
                            <p class="font-poppins font-bold text-2xl text-orange">{{ profiladmin.full_name }}</p>
                            <p class="font-poppins font-medium text-xl text-lightorange">{{ profiladmin.email }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-8">
                        <div class="w-96 pb-8 border border-orange flex flex-col">
                            <p class="pl-8 py-8 font-poppins font-bold text-2xl text-orange text-left">Roles</p>
                            <p v-if="profiladmin.superAdmin === true"
                                class="pl-8 text-lightorange font-poppins font-medium">
                                SuperAdmin</p>
                            <p v-if="profiladmin.superAdmin === false"
                                class="pl-8 text-lightorange font-poppins font-medium">Admin
                            </p>
                        </div>
                    </div>
                </div>

                <form class="flex flex-col items-center gap-4" @submit.prevent="editprofiladmin()">
                    <div v-if="statuscode===200" class="px-2 max-w-[250px] mt-4">

                        <!-- Alert Error -->
                        <div class="bg-[#86efac] px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
                            <svg viewBox="0 0 24 24" class="text-[#16a34a] w-5 h-5 sm:w-5 sm:h-5 mr-3">
                                <path fill="currentColor"
                                    d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                                </path>
                            </svg>
                            <span class="text-[#14532D]">Berhasil, halaman akan refresh otomatis dalam 3 detik</span>
                        </div>
                        <!-- End Alert Error -->

                    </div>
                    <div class="w-full flex flex-col">
                        <p class="font-poppins font-bold text-[16px] text-orange text-center">Nama Lengkap</p>
                        <input type="text" name="" id="" :placeholder="profiladmin.full_name"
                            class="border border-black py-1 px-2" v-model="edited.full_name">
                    </div>

                    <div class="w-full flex flex-col">
                        <p class="font-poppins font-bold text-[16px] text-orange text-center">Email</p>
                        <input type="email" name="" id="" :placeholder="profiladmin.email"
                            class=" py-1 px-2 border border-black" v-model="edited.email">
                    </div>

                    <button type="submit" class="bg-orange mt-4 py-1 px-6">Ganti</button>
                </form>

                <div>




                </div>
            </div>
        </div>

    </div>
</template>