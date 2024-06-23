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
            rememberedPassword: ''
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
            const passwordInput = document.getElementById('password');
            if (this.showPassword) {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
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
                        <div class="flex relative">
                            <input type="password" id="password" name="password" v-model="password" required
                                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                autocomplete="off" placeholder="Enter password" />
                            <!-- Container untuk tombol show password -->
                            <!-- <span class="inset-y-0 right-0 flex items-center pr-3"> -->
                                <!-- Tombol show/hide password -->
                                <!-- <button type="button" @click="togglePasswordVisibility"
                                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                    class="h-full bg-transparent text-gray-400 focus:outline-none">
                                    <svg v-if="showPassword" width="30" height="30" viewBox="0 0 64 64" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        xml:space="preserve" xmlns:serif="http://www.serif.com/"
                                        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                                        <rect id="Icons" x="-896" y="-256" width="1280" height="800" style="fill:none;" />
                                        <g id="Icons1" serif:id="Icons">
                                            <g id="Strike"></g>
                                            <g id="H1"></g>
                                            <g id="H2"></g>
                                            <g id="H3"></g>
                                            <g id="list-ul"></g>
                                            <g id="hamburger-1"></g>
                                            <g id="hamburger-2"></g>
                                            <g id="list-ol"></g>
                                            <g id="list-task"></g>
                                            <g id="trash"></g>
                                            <g id="vertical-menu"></g>
                                            <g id="horizontal-menu"></g>
                                            <g id="sidebar-2"></g>
                                            <g id="Pen"></g>
                                            <g id="Pen1" serif:id="Pen"></g>
                                            <g id="clock"></g>
                                            <g id="external-link"></g>
                                            <g id="hr"></g>
                                            <g id="info"></g>
                                            <g id="warning"></g>
                                            <g id="plus-circle"></g>
                                            <g id="minus-circle"></g>
                                            <g id="vue"></g>
                                            <g id="cog"></g>
                                            <g id="logo"></g>
                                            <g id="eye-slash"></g>
                                            <g id="eye">
                                                <path
                                                    d="M32.513,13.926c10.574,0.15 19.249,9.657 23.594,17.837c0,0 -1.529,3.129 -2.963,5.132c-0.694,0.969 -1.424,1.913 -2.191,2.826c-0.547,0.65 -1.112,1.283 -1.698,1.898c-5.237,5.5 -12.758,9.603 -20.7,8.01c-8.823,-1.77 -16.02,-9.33 -20.346,-17.461c0,0 1.536,-3.132 2.978,-5.132c0.646,-0.897 1.324,-1.77 2.034,-2.617c0.544,-0.649 1.108,-1.282 1.691,-1.897c4.627,-4.876 10.564,-8.63 17.601,-8.596Zm-0.037,4c-5.89,-0.022 -10.788,3.267 -14.663,7.35c-0.527,0.555 -1.035,1.127 -1.527,1.713c-0.647,0.772 -1.265,1.569 -1.854,2.386c-0.589,0.816 -1.193,1.846 -1.672,2.721c3.814,6.409 9.539,12.198 16.582,13.611c6.563,1.317 12.688,-2.301 17.016,-6.846c0.529,-0.555 1.04,-1.128 1.534,-1.715c0.7,-0.833 1.366,-1.694 1.999,-2.579c0.586,-0.819 1.189,-1.851 1.667,-2.727c-3.958,-6.625 -10.73,-13.784 -19.082,-13.914Z" />
                                                <path
                                                    d="M32.158,23.948c4.425,0 8.018,3.593 8.018,8.017c0,4.425 -3.593,8.017 -8.018,8.017c-4.424,0 -8.017,-3.592 -8.017,-8.017c0,-4.424 3.593,-8.017 8.017,-8.017Zm0,4.009c2.213,0 4.009,1.796 4.009,4.008c0,2.213 -1.796,4.009 -4.009,4.009c-2.212,0 -4.008,-1.796 -4.008,-4.009c0,-2.212 1.796,-4.008 4.008,-4.008Z" />
                                            </g>
                                            <g id="toggle-off"></g>
                                            <g id="shredder"></g>
                                            <g id="spinner--loading--dots-" serif:id="spinner [loading, dots]"></g>
                                            <g id="react"></g>
                                        </g>
                                    </svg>
                                    <svg v-else width="30" height="30" viewBox="0 0 64 64" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        xml:space="preserve" xmlns:serif="http://www.serif.com/"
                                        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                                        <rect id="Icons" x="-960" y="-256" width="1280" height="800" style="fill:none;" />
                                        <g id="Icons1" serif:id="Icons">
                                            <g id="Strike"></g>
                                            <g id="H1"></g>
                                            <g id="H2"></g>
                                            <g id="H3"></g>
                                            <g id="list-ul"></g>
                                            <g id="hamburger-1"></g>
                                            <g id="hamburger-2"></g>
                                            <g id="list-ol"></g>
                                            <g id="list-task"></g>
                                            <g id="trash"></g>
                                            <g id="vertical-menu"></g>
                                            <g id="horizontal-menu"></g>
                                            <g id="sidebar-2"></g>
                                            <g id="Pen"></g>
                                            <g id="Pen1" serif:id="Pen"></g>
                                            <g id="clock"></g>
                                            <g id="external-link"></g>
                                            <g id="hr"></g>
                                            <g id="info"></g>
                                            <g id="warning"></g>
                                            <g id="plus-circle"></g>
                                            <g id="minus-circle"></g>
                                            <g id="vue"></g>
                                            <g id="cog"></g>
                                            <g id="logo"></g>
                                            <g id="eye-slash">
                                                <path
                                                    d="M13.673,10.345l-3.097,3.096l39.853,39.854l3.097,-3.097l-39.853,-39.853Z" />
                                                <path
                                                    d="M17.119,19.984l2.915,2.915c-3.191,2.717 -5.732,6.099 -7.374,9.058l-0.005,0.01c4.573,7.646 11.829,14.872 20.987,13.776c2.472,-0.296 4.778,-1.141 6.885,-2.35l2.951,2.95c-4.107,2.636 -8.815,4.032 -13.916,3.342c-9.198,-1.244 -16.719,-8.788 -21.46,-17.648c2.226,-4.479 5.271,-8.764 9.017,-12.053Zm6.63,-4.32c2.572,-1.146 5.355,-1.82 8.327,-1.868c0.165,-0.001 2.124,0.092 3.012,0.238c0.557,0.092 1.112,0.207 1.659,0.35c8.725,2.273 15.189,9.649 19.253,17.248c-1.705,3.443 -3.938,6.803 -6.601,9.682l-2.827,-2.827c1.967,-2.12 3.607,-4.48 4.87,-6.769c0,0 -1.27,-2.042 -2.233,-3.324c-0.619,-0.824 -1.27,-1.624 -1.954,-2.395c-0.54,-0.608 -2.637,-2.673 -3.136,-3.103c-3.348,-2.879 -7.279,-5.138 -11.994,-5.1c-1.826,0.029 -3.582,0.389 -5.249,0.995l-3.127,-3.127Z"
                                                    style="fill-rule:nonzero;" />
                                                <path
                                                    d="M25.054,27.92l2.399,2.398c-0.157,0.477 -0.243,0.987 -0.243,1.516c0,2.672 2.169,4.841 4.841,4.841c0.529,0 1.039,-0.085 1.516,-0.243l2.399,2.399c-1.158,0.65 -2.494,1.02 -3.915,1.02c-4.425,0 -8.017,-3.592 -8.017,-8.017c0,-1.421 0.371,-2.756 1.02,-3.914Zm6.849,-4.101c0.049,-0.001 0.099,-0.002 0.148,-0.002c4.425,0 8.017,3.593 8.017,8.017c0,0.05 0,0.099 -0.001,0.148l-8.164,-8.163Z" />
                                            </g>
                                            <g id="eye"></g>
                                            <g id="toggle-off"></g>
                                            <g id="shredder"></g>
                                            <g id="spinner--loading--dots-" serif:id="spinner [loading, dots]"></g>
                                            <g id="react"></g>
                                        </g>
                                    </svg>
                                </button> -->
                            <!-- </span> -->
                        </div>

                    </div>
                </div>



                <!-- Remember Me Checkbox -->
                <div class="mb-4 flex flex-col">
                    <div>
                        <input type="checkbox" id="remember" name="remember" class="outline-[#D4A02C]" v-model="rememberMe">
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
    </div>
</template>