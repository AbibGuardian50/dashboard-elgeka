<script>
import Sidebar from "./Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies';
import moment from 'moment';
import 'moment/locale/id';

export default {
    async created() {
        try {
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                VueCookies.get('tokenlogin')
                this.daftarquotes = response.data.result.data
                // this.daftarquotes.sort((x, y) => x.id - y.id) supaya urut menurut id nya
                this.daftarquotes.forEach((item, index) => {
                    item.no = index + 1;
                });
                console.log(this.daftarquotes)
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
            url: 'https://elgeka-web-api-production.up.railway.app/',
            prompt: '',
            quote: '',
            errorMessage: '',
            statuscode: '',
            form: {
                quote: '',
                author_name: '',
                image: [],
            },
            daftarquotes: [],
            showcreatequotes: false,
            showdeletequotes: false,
        };
    },
    methods: {
        async generateQuote() {
            try {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes/generate'
                const response = await axios.post(url, { prompt: this.prompt }, { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
                this.token = tokenlogin
                this.form.quote = response.data.result.generated_quote;
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
                        }, 2000);
                    } else if (response.data.code === 400) {
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deletequotes(id) {
            if (confirm('Apakah kamu yakin untuk menghapus Quotes ini?')) {
                const tokenlogin = VueCookies.get('tokenlogin')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/quotes/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data)
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
        formatDateTime(dateTimeString) {
            moment.locale('id');
            return moment(dateTimeString).format('LLL');
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
        toggleModalCreateQuotes: function () {
            this.showcreatequotes = !this.showcreatequotes;
        },
        toggleModalDeleteQuotes: function () {
            this.showdeletequotes = !this.showdeletequotes;
        },
    }
}
</script>

<template>
    <div class="flex">
        <sidebar />

        <div class="px-8">
            <p class="text-[30px] text-orange font-gotham font-bold">Quotes</p>
            <hr>
            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                    <thead class="bg-gray-50">
                        <tr class="border-b-[0.5px] border-b-orange">
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                No
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                Tanggal dibuat
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                Author
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                Media
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                                Quotes
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateQuotes()"
                                    class="py-1 px-6 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="data in daftarquotes" :key="data.id" class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-sulfurblack text-base">
                                {{ data.no }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class="font-gotham font-normal text-sulfurblack text-base">
                                            {{ formatDateTime(data.createdAt) }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 max-w-[250px]">
                                <p class="font-gotham font-normal text-sulfurblack text-base ">{{ data.author_name }}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="pr-4 inline-flex text-base leading-5 font-semibold rounded-full">
                                    <img class="bg-[url('https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg')] bg-cover bg-center w-[160px] max-h-[160px]"
                                        :src="url + data.image_url">
                                </span>
                            </td>
                            <td class="px-6 py-4 w-[300px]">
                                <p class="font-gotham font-normal text-sulfurblack text-base">{{ data.quote }}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                <a :href="'editquotes/' + data.id">
                                    <button
                                        class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button>
                                </a>
                                <button href="#" @click="deletequotes(data.id)"
                                    class="py-1 px-8 rounded-[5px] shadow-xl bg-offwhite bg-opacity-64 text-orange  ml-2 font-inter font-bold text-base">Hapus</button>
                            </td>
                        </tr>
                        <!-- More rows... -->

                        <!-- Pop up modal buat hapus Quotes -->
                        <div>
                            <form v-if="showdeletequotes" @submit.prevent="deletequotes(data.id)"
                                class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                                <div class="relative w-auto my-6 mx-auto max-w-6xl">
                                    <!--content-->
                                    <div
                                        class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        <!--header-->
                                        <div
                                            class="flex items-start justify-between p-5 border-b-2 border-orange rounded-t">
                                            <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                                Konfirmasi Hapus Quotes
                                            </h3>
                                        </div>
                                        <!--footer-->
                                        <div
                                            class="flex items-center justify-center p-6 border-t-2 border-orange rounded-b">
                                            <button
                                                class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                                type="submit">
                                                Hapus
                                            </button>
                                            <button
                                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                                type="button" v-on:click="toggleModalDeleteQuotes()">
                                                batal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div v-if="showdeletequotes" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </div>
                    </tbody>
                </table>

                <!-- Pop up modal buat Quotes baru... -->
                <div>
                    <form v-if="showcreatequotes" @submit.prevent="createquote()"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                        <div class="relative w-auto my-6 mx-auto max-w-6xl">
                             <!-- Alert Error -->
                            <div v-if="statuscode === 201" class="px-2 mt-4">
                                <div
                                    class="bg-[#473FE8] px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
                                    <svg viewBox="0 0 24 24" class="text-[#4576F5] w-5 h-5 sm:w-5 sm:h-5 mr-3">
                                        <path fill="currentColor"
                                            d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                                        </path>
                                    </svg>
                                    <span class="text-white">Berhasil membuat quotes, halaman akan refresh dalam 2
                                        detik</span>
                                </div>
                                <!-- End Alert Error -->
                            </div>
                            <!--content-->
                            <div
                                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                    <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                        Tambah Quotes
                                    </h3>
                                    <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        v-on:click="toggleModalCreateQuotes()">
                                        <span
                                            class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        </span>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="flex flex-col gap-8 relative p-6">
                                    <div class="flex gap-2 flex-col">
                                        <label for="Author"
                                            class="font-poppins font-bold text-base text-orange">Author</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            name="Author" v-model="form.author_name" id=""
                                            placeholder="Muhammad Abieb Basnuril" required>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="username"
                                            class="font-poppins font-bold text-base text-orange">Quotes</label>
                                        <textarea class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                            name="username" id="" v-model="form.quote" placeholder="Masukkan Quotes"
                                            required></textarea>
                                    </div>

                                    <div class="flex gap-2 flex-col">
                                        <label for="Gambar"
                                            class="font-poppins font-bold text-base text-orange">Gambar</label>
                                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="file"
                                            name="Password" @change="handleFileChange" id="" required>
                                        <p v-if="errorMessage" class="text-[#EF0307] font-semibold" >{{ errorMessage
                                        }}</p>
                                    </div>

                                    <div class="flex gap-2 flex-col justify-end">
                                        <label for="Generate Quote"
                                            class="font-poppins font-bold text-base text-orange">Generate Quote
                                            (ChatGPT)</label>
                                        <div class="flex flex-col">
                                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md"
                                                type="text" name="username" id="" v-model="prompt"
                                                placeholder="Enter prompt here">
                                            <button
                                                class="w-[150px] py-1 bg-orange text-white font-poppins rounded-md my-2 flex flex-col"
                                                @click="generateQuote">Generate</button>
                                            <!-- <textarea class="bg-offwhite text-black font-bold font-poppins px-2"
                                                v-model="quote"></textarea> -->

                                        </div>
                                    </div>


                                </div>
                                <!--footer-->
                                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                    <button
                                        class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                        type="submit">
                                        Simpan
                                    </button>
                                    <button
                                        class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                        type="button" v-on:click="toggleModalCreateQuotes()">
                                        Tidak Simpan
                                    </button>
                                </div>
                            </div>

                        </div>

                    </form>
                    <div v-if="showcreatequotes" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>





                <div v-if="error" class="text-red font-gotham font-bold text-2xl pt-4">{{ error }}</div>
            </div>
        </div>


        <!-- <div class="flex flex-col gap-4">
                <div>
                    <input type="text" class="bg-grey pl-4 py-1 w-full rounded-full" v-model="prompt"
                        placeholder="Enter your prompt here">
                    <button class="px-8 py-2 bg-orange text-white font-poppins rounded-md my-2"
                        @click="generateQuote">Generate Quote</button>
                    <div class="bg-orange text-white font-bold font-poppins px-2" v-if="quote">{{ quote.generated_quote
                    }}</div>
                    <div v-else>(Hasil Generate Quote akan tampil disini)</div>
                </div>

            </div> -->

        <!-- <form @submit.prevent="createquote()" class="flex flex-col gap-4">
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
            </form> -->





    </div>
</template>