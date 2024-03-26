<script>
import Sidebar from "./Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies';

export default {
    components: {
        Sidebar
    },
    data() {
        return {
            prompt: '',
            quote: '',
            errorMessage: '',
            statuscode: '',
            form: {
                quote: '',
                author_name: '',
                image: [],

            }
        };
    },
    methods: {
        async generateQuote() {
            try {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes/generate'
                const response = await axios.post(url, { prompt: this.prompt }, { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
                this.token = tokenlogin
                this.quote = response.data.result;
                
                console.log(this.quote);
                console.log(this.token)
            } catch (error) {
                console.error('Error generating quote:', error);
            }
        },
        createquote() {
            const tokenlogin = VueCookies.get('tokenlogin')
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes'
            
            const formData = new FormData();
            formData.append('image', this.form.image);
            formData.append('quote', this.form.quote);
            formData.append('author_name', this.form.author_name);
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data);
                    this.statuscode = response.data.code;
                    console.log(this.statuscode);
                    if (response.data.code === 201) {
                        setTimeout(() => {
                        window.location.reload();
                        }, 5000);
                    } else if (response.data.code === 400){
                        cons
                    }
                    
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.form.image = selectedFile;

            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

            if (!allowedExtensions.exec(selectedFile.name)) {
                this.errorMessage = 'Hanya file JPEG, JPG, dan PNG yang diizinkan';
            } else {
                // Lakukan proses upload file
                // this.uploadFile(file);
                this.errorMessage = ''; // Bersihkan pesan error jika file valid
            }
        },
    }
}
</script>

<template>
    <div class="flex">
        <sidebar />

        <div class="ml-8 w-[1042px]">
            <p class="font-bold font-gotham text-3xl text-sulfurblack py-4">Quotes</p>
            <hr>

            <div class="flex flex-col gap-4">
                <div>
                    <!-- <p class="font-gotham font-normal text-2xl text-black mb-2">Quotes</p> -->
                    <input type="text" class="bg-grey pl-4 py-1 w-full rounded-full" v-model="prompt"
                        placeholder="Enter your prompt here">
                    <button class="px-8 py-2 bg-orange text-white font-poppins rounded-md my-2"
                        @click="generateQuote">Generate Quote</button>
                    <div class="bg-orange text-white font-bold font-poppins px-2" v-if="quote">{{ quote.generated_quote
                    }}</div>
                    <div v-else>(Hasil Generate Quote akan tampil disini)</div>
                </div>

            </div>

            <form @submit.prevent="createquote()" class="flex flex-col gap-4">
                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Quotes</p>
                    <input class="bg-grey pl-4 py-1 w-full rounded-full" type="text" name="Judul" id=""
                        v-model="form.quote">
                </div>

                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Author</p>
                    <input class="bg-grey pl-4 py-8 w-full rounded-lg" type="text" name="Author" id=""
                        v-model="form.author_name">
                </div>

                <div>
                    <p class="font-gotham font-normal text-2xl text-black mb-2">Media</p>
                    <input accept="image/jpeg, image/jpg, image/png" class="bg-grey pl-4 py-28 w-full rounded-lg"
                        type="file" name="Media" id="" @change="handleFileChange">
                    <p v-if="errorMessage" class="text-[#EF0307] font-semibold">{{ errorMessage }}</p>
                </div>

                <div class="flex flex-col items-center">
                    <button type="submit"
                        class="bg-grey py-2 px-8 font-gotham font-bold text-black rounded-full">Simpan</button>
                </div>
            </form>


        </div>

        <div v-if="statuscode === 201" class="px-2 mt-4">

            <!-- Alert Error -->
            <div class="bg-[#473FE8] px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
                <svg viewBox="0 0 24 24" class="text-[#4576F5] w-5 h-5 sm:w-5 sm:h-5 mr-3">
                    <path fill="currentColor"
                        d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                    </path>
                </svg>
                <span class="text-white">Berhasil membuat quotes, halaman akan refresh dalam 2 detik</span>
            </div>
            <!-- End Alert Error -->

        </div>
    </div>
</template>