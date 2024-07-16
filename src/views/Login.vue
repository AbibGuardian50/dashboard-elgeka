<script>
import axios from 'axios'
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
export default {
    data() {
        return {
            username: [],
            password: [],
            showPassword: false,
            error: '',
            rememberMe: false,
            rememberedUsername: '',
            rememberedPassword: '',
            showPassword: false
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        async login() {
            const toast = useToast();
            try {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin/login'
                const response = await axios.post(url, {
                    username: this.username,
                    password: this.password
                })
                if (response.data.code === 200) {
                    this.$router.push('/kelolaakun');
                    console.log(response)
                    VueCookies.set('tokenlogin', response.data.result.token)
                    toast.success('Login Berhasil!');
                    // VueCookies.set('fullname', response.data.result.user.full_name)
                    // VueCookies.set('email', response.data.result.user.email)
                    VueCookies.set('id_user', response.data.result.user.id)
                    VueCookies.set('superAdmin', response.data.result.user.superAdmin)
                    VueCookies.set('status_akun', response.data.result.user.is_active)
                    if (this.rememberMe) {
                        localStorage.setItem('rememberedUsername', this.username);
                        localStorage.setItem('rememberedPassword', this.password);
                    }
                } else {
                    toast.error('username atau password yang dimasukkan salah, mohon coba lagi');
                }
            } catch (error) {
                toast.error('ada kesalahan dari sistem, mohon coba lagi');
            }
        }
    },
    mounted() {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        const rememberedPassword = localStorage.getItem('rememberedPassword');
        if (rememberedUsername && rememberedPassword) {
            this.username = rememberedUsername; // Perbaikan disini
            this.password = rememberedPassword;
            this.rememberMe = true;
        }

    }
}
</script>

<template>
    <!-- component -->
    <div class="bg-gray-100 flex flex-row-reverse">
        <!-- Left: Image -->
        <div class="w-1/2 hidden lg:block">
            <router-link to="/"><img src="../assets/sign.png" alt="Placeholder Image"
                    class="object-cover w-full h-full"></router-link>
        </div>
        <!-- Right: Login Form -->
        <div class="flex flex-col lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
            <img class="w-[120px] bg-teal mb-20 rounded-md" src="../assets/logoElgekaPutih1.png" alt="Logo">
            <h1 class="text-2xl font-bold font-[verdana] text-[32px] mb-4">Dashboard Admin</h1>
            <form @submit.prevent="login">
                <!-- username Input -->
                <div class="mb-4">
                    <label for="username"
                        class="block font-[verdana] font-normal text-[14px] text-[#344054] mb-2">username</label>
                    <input type="text" id="username" name="username" v-model="username" required
                        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autocomplete="off" placeholder="enter your username">
                </div>
                <!-- Password Input -->
                <div class="mb-4 relative flex">
                    <div class="relative w-full">
                        <label for="password" class="block text-[#344054] mb-2">Password</label>
                        <div class= "relative">
                            <div class="flex relative">
                                <input :type="showPassword ? 'text' : 'password'" id="password" name="password" v-model="password" required
                                    class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    autocomplete="off" placeholder="Enter password" />
                                <button type="button" @click="togglePasswordVisibility"
                                    class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none">
                                    <span v-if="showPassword"><svg width="25px" height="25px" viewBox="0 0 24 24"
                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 2L22 22" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                                                stroke="#000000" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                                                stroke="#000000" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg></span>
                                    <span v-else><svg width="25px" height="25px" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#000000" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#000000"
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="#000000" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg></span>
                                </button>
                            </div>
                        </div>


                    </div>
                </div>



                <!-- Remember Me Checkbox -->
                <div class="mb-4 flex flex-col">
                    <div>
                        <input type="checkbox" id="rememberMe" name="remember" class="outline-[#D4A02C]"
                            v-model="rememberMe">
                        <label for="rememberMe" class="font-[verdana] text-[#344054] font-normal text[14px] ml-2">Remember
                            Me</label>
                    </div>
                    <p class="pl-5 font-[verdana] font-normal text[14px] text-[#667085]">Save my login details for next
                        time.</p>
                </div>
                <!-- Login Button -->
                <div class="flex flex-col">
                    <button type="submit"
                        class="bg-teal text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                    <!-- <div class="mt-6 text-blue-500">
                        <a href="#" class="hover:underline font-[verdana] font-normal text-[14px] text-center text-[#4D4D4F]">Forgot
                            Password?</a>
                    </div> -->
                </div>

                <!-- Error Message, hanya muncul jika ada kesalahan dari user atau sistem -->
                <div v-if="error" class="text-red font-poppins font-bold text-2xl pt-4">{{ error }}</div>

            </form>
            <!-- Forgot Password Link -->

        </div>
</div></template>