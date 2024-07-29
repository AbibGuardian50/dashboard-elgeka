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
        toggleModalEditAdmin() {
            this.showeditadmin = !this.showeditadmin;
        },
        async editadmin(id) {
            const toast = useToast();
            if (this.validateForm()) {
                const tokenlogin = VueCookies.get('tokenlogin');
                const AdminId = VueCookies.get('id_user');
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`;
                // Clone daftaradmin to avoid modifying the original object directly
                let updatedAdmin = { ...this.daftaradmin };
                // Convert boolean to string for is_active
                updatedAdmin.is_active = String(updatedAdmin.is_active);
                // Remove superAdmin from the payload
                delete updatedAdmin.superAdmin;
                console.log("Updated Admin Data before sending:", updatedAdmin);
                try {
                    const response = await axios.patch(url, updatedAdmin, {
                        headers: {
                            Authorization: `Bearer ${tokenlogin}`
                        }
                    });
                    console.log(response.data);
                    this.statuscode = response.data.code;
                    if (response.data.code === 200) {
                        // Check if the status was changed from nonaktif to aktif
                        if (this.daftaradmin.is_active && updatedAdmin.is_active === 'true' || updatedAdmin.is_active === 'false') {
                            if (id === AdminId) {
                                // Log out the user and redirect to login page
                                VueCookies.remove('tokenlogin');
                                VueCookies.remove('superAdmin');
                                VueCookies.remove('id_user');
                                VueCookies.remove('status_akun');
                                toast.success('Status akun berhasil diubah, mohon untuk login kembali')
                                setTimeout(() => {
                                    this.$router.push('/');
                                }, 1000);

                            } else {
                                // Redirect to /kelolaakun
                                toast.success('Status admin berhasil diubah')
                                setTimeout(() => {
                                    this.$router.push('/kelolaakun');
                                }, 1000);
                            }
                        } else {
                            setTimeout(() => {
                                this.$router.push('/kelolaakun');
                            }, 1000);
                        }
                    } else if (response.data.code === 400) {
                        console.log(response);
                    }
                } catch (error) {
                    toast.error('Terdapat kesalahan pada sistem, mohon coba lagi')
                    console.log(error);
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
            class="fixed inset-0 z-50 flex justify-center overflow-y-auto outline-none focus:outline-none">
            <div class="relative w-full max-w-4xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
                <!-- Alert Error -->
                <div v-if="resulterror.message === 'Error Update Admin by ID: Unauthorized, Superadmins cannot update other superadmins'"
                    class="px-2 mt-4">
                    <div class="bg-[#fecdd3] px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center max-w-lg mx-auto">
                        <svg viewBox="0 0 24 24" class="text-[#dc2626] w-5 h-5 sm:w-5 sm:h-5 mr-3">
                            <path fill="currentColor"
                                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                            </path>
                        </svg>
                        <span class="text-[#991b1b]">Error, superadmin tidak bisa edit superadmin lainnya</span>
                    </div>
                </div>
                <!--content-->
                <div
                    class="border border-black rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[24px] sm:text-[32px] md:text-[40px] text-teal font-semibold font-poppins">
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
                    <div class="flex flex-col gap-6 p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="nama lengkap" class="font-poppins font-bold text-base text-teal">Nama
                                Lengkap</label>
                            <input class="border border-black py-2 sm:py-3 w-full rounded-md" type="text" required
                                v-model="daftaradmin.full_name" name="nama lengkap" id="">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="username" class="font-poppins font-bold text-base text-teal">Username</label>
                            <input class="border border-black py-2 sm:py-3 w-full rounded-md" type="text" name="username"
                                required v-model="daftaradmin.username" id="">
                            <p v-if="formErrors.username" class="text-red text-sm mt-1">{{ formErrors.username }}</p>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Status" class="font-poppins font-bold text-base text-teal">Status Aktif</label>
                            <select required class="border border-black py-2 sm:py-3 w-full rounded-md" name="Status" id=""
                                v-model="daftaradmin.is_active">
                                <option value="false">Nonaktif</option>
                                <option value="true">Aktif</option>
                            </select>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-6 sm:px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/kelolaakun">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                Batal
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
    <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</div></template>

