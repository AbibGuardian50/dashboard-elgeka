<script>
import axios from 'axios'

export default {
    data() {
        return {
            email: [],
            password: [],
            error: ''
        }
    },
    methods: {
        async login() {
            try {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin/login'
                const response = await axios.post(url, {
                    email: this.email,
                    password: this.password
                })
                if (response.data.code === 200) {
                    this.$router.push('/kelolaakun');
                    console.log(response)
                    sessionStorage.setItem('tokenlogin', response.data.result.token)
                } else {
                    this.error = 'email dan password yang dimasukkan salah, mohon coba lagi'
                }
            } catch (error) {
                this.error = 'ada kesalahan dari sistem, mohon coba lagi'
            }
        }
    }
}
</script>

<template>
    <!-- component -->
    <div class="bg-gray-100 flex flex-row-reverse">
        <!-- Left: Image -->
        <div class="w-1/2 h-screen hidden lg:block">
            <router-link to="/"><img src="../assets/sign.png" alt="Placeholder Image"
                    class="object-cover w-full h-full"></router-link>
        </div>
        <!-- Right: Login Form -->
        <div class="flex flex-col lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
            <img class="w-[120px] pb-20" src="../assets/logo.png" alt="Logo">
            <h1 class="text-2xl font-bold font-[verdana] text-[32px] mb-4">Dashboard Admin</h1>
            <form @submit.prevent="login">
                <!-- email Input -->
                <div class="mb-4">
                    <label for="email"
                        class="block font-[verdana] font-normal text-[14px] text-[#344054] mb-2">Email</label>
                    <input type="text" id="email" name="email" v-model="email" required
                        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autocomplete="off" placeholder="enter your email address">
                </div>
                <!-- Password Input -->
                <div class="mb-4">
                    <label for="password" class="block text-[#344054] mb-2">Password</label>
                    <input type="password" id="password" name="password" v-model="password" required
                        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autocomplete="off" placeholder="enter password">
                </div>
                <!-- Remember Me Checkbox -->
                <div class="mb-4 flex flex-col">
                    <div>
                        <input type="checkbox" id="remember" name="remember" class="outline-[#D4A02C]">
                        <label for="remember" class="font-[verdana] text-[#344054] font-normal text[14px] ml-2">Remember
                            Me</label>
                    </div>
                    <p class="pl-5 font-[verdana] font-normal text[14px] text-[#667085]">Save my login details for next
                        time.</p>
                </div>
                <!-- Login Button -->
                <div class="flex flex-col">
                    <button type="submit"
                        class="bg-orange text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                    <!-- <div class="mt-6 text-blue-500">
                        <a href="#" class="hover:underline font-[verdana] font-normal text-[14px] text-center text-[#4D4D4F]">Forgot
                            Password?</a>
                    </div> -->
                </div>

                <!-- Error Message, hanya muncul jika ada kesalahan dari user atau sistem -->
                <div v-if="error" class="text-red font-gotham font-bold text-2xl pt-4">{{ error }}</div>

            </form>
            <!-- Forgot Password Link -->

        </div>
    </div>
</template>