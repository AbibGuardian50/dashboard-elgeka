<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default {
    async created() {
        try {
            const toast = useToast();
            const id = this.$route.params.id;
            const tokenlogin = VueCookies.get('tokenlogin');
            if (tokenlogin) {
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                });
                this.daftaradmin = response.data.result.data;
                const superAdmin = VueCookies.get('superAdmin');
                this.getRoles = superAdmin;
                console.log(response);
                if (response.data.message === "Get Admin by ID Successfully") {
                    toast.success('Data Admin berhasil dimuat');
                }
            } else {
                this.error = 'dilarang akses halaman ini';
            }
        } catch (error) {
            const toast = useToast();
            toast.error('Data Admin gagal dimuat');
            console.error(error);
        }
    },
    methods: {
        toggleModalEditAdmin: function () {
            this.showeditadmin = !this.showeditadmin;
        },
        async editadmin(id) {
            const toast = useToast();
            if (this.validateForm()) {
                const tokenlogin = VueCookies.get('tokenlogin');
                this.daftaradmin.is_active = this.daftaradmin.is_active.toString();
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`;
                try {
                    const response = await axios.patch(url, this.daftaradmin, {
                        headers: {
                            Authorization: `Bearer ${tokenlogin}`
                        }
                    });
                    console.log(response);
                    this.resulterror = response.data;
                    if (response.data.message === "Update Admin by ID Successfully") {
                        toast.success('Data Admin berhasil diubah');
                        setTimeout(() => {
                            this.$router.push('/kelolaakun');
                        }, 5000);
                    } else if (response.data.message === "Error Data Request") {
                        toast.error('Data Admin gagal diubah, mohon coba lagi');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Terjadi kesalahan, mohon coba lagi');
                }
            }
        },
        validateForm() {
            const toast = useToast();
            let valid = true;
            this.formErrors.username = '';

            if (this.daftaradmin.username.length < 6 || this.daftaradmin.username.length > 16) {
                toast.warning('Username harus memiliki panjang antara 6 dan 16 karakter');
                this.formErrors.username = 'Username harus memiliki panjang antara 6 dan 16 karakter.';
                valid = false;
            } else if (/[A-Z]/.test(this.daftaradmin.username)) {
                toast.warning('Username tidak boleh mengandung huruf kapital');
                this.formErrors.username = 'Username tidak boleh mengandung huruf kapital.';
                valid = false;
            } else if (/\s/.test(this.daftaradmin.username)) {
                toast.warning('Username tidak boleh mengandung spasi');
                this.formErrors.username = 'Username tidak boleh mengandung spasi.';
                valid = false;
            }

            console.log('Validasi Form:', valid, this.formErrors); // Debug log

            return valid;
        },
    },
    data() {
        return {
            showeditadmin: false,
            getRoles: false,
            formErrors: {
                username: '',
            },
            resulterror: '',
            daftaradmin: {
                full_name: '',
                username: '',
                is_active: '',
            }
        };
    },
};
</script>



<template>
    <div>
        <form v-if="daftaradmin" @submit.prevent="editadmin(daftaradmin.id)"
            class="overflow-x-hidden overflow-y-auto inset-0 justify-center items-center flex">
            <div v-if="getRoles === 'true'" class="relative w-auto my-6 mx-auto max-w-6xl flex flex-col-reverse">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-teal font-semibold font-poppins">
                            Edit Akun Admin
                        </h3>
                        <button
                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            v-on:click="toggleModalCreateAdmin()">
                            <span
                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            </span>
                        </button>
                    </div>
                    <!--body-->
                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="nama lengkap" class="font-poppins font-bold text-base text-teal">Nama
                                Lengkap</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" required
                                v-model="daftaradmin.full_name" name="nama lengkap" id="">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="username" class="font-poppins font-bold text-base text-teal">Username</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="username" required v-model="daftaradmin.username" id="">
                            <p v-if="formErrors.username" class="text-red text-sm mt-1">{{ formErrors.username }}</p>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Status" class="font-poppins font-bold text-base text-teal">Status Aktif</label>
                            <!-- <input class="border border-black py-4 min-w-[550px] pr-2 rounded-md" type="text" name="nama lengkap" id="" placeholder="  Muhammad Abieb Basnuril"> -->
                            <select required class="border border-black py-4 min-w-[550px] pl-2 rounded-md" name="Status"
                                id="" v-model="daftaradmin.is_active">
                                <option value="false">Nonaktif</option>
                                <option value="true">Aktif</option>
                            </select>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/kelolaakun">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                batal
                            </button>
                        </router-link>
                    </div>
                </div>
                <div v-if="resulterror.message === 'Error Update Admin by ID: Unauthorized, Superadmins cannot update other superadmins'"
                    class="px-2 mt-4">

                    <!-- Alert Error -->
                    <div class="bg-[#fecdd3] px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
                        <svg viewBox="0 0 24 24" class="text-[#dc2626] w-5 h-5 sm:w-5 sm:h-5 mr-3">
                            <path fill="currentColor"
                                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                            </path>
                        </svg>
                        <span class="text-[#991b1b]">Error, superadmin tidak bisa edit superadmin lainnya</span>
                    </div>
                    <!-- End Alert Error -->

                </div>
            </div>
            <!-- <div v-else>
                <p class="font-bold font-poppins text-5xl">Dilarang Akses Halaman Ini</p>
                <a href="/kelolaakun" class="hover:text-teal hover:underline font-bold font-poppins text-5xl">Klik Disini
                    Untuk Kembali ke Halaman Sebelumnya</a>
            </div> -->



        </form>
        <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>


    </div>
</template>