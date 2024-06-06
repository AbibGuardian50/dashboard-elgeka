<script>
import axios from 'axios'
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
            const id = this.$route.params.id
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/quotes/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.quotesdata = response.data.result.data
                console.log(this.quotesdata)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    data() {
        return {
            showcreatequotes: false,
            prompt: '',
            errorMessage: '',
            statuscode: '',
            resulterror: '',
            quotesdata: [],
            quote: '',
            quotesdata: {
                quote: '',
                author_name: '',
                image: [],
            }
        }
    },
    methods: {
        generateQuote() {
            const tokenlogin = VueCookies.get('tokenlogin');
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes/generate';
            axios.post(url, { prompt: this.prompt }, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    // Mengatur nilai quote sesuai dengan respons yang diterima
                    this.quotesdata.quote = response.data.result.generated_quote;
                    console.log(this.quotesdata.quote); // Mencetak kutipan yang dihasilkan dari respons
                    const toast = useToast();
                    if (response.data.message === "Generated Quote Successfully") {
                        toast.success('Generate AI Berhasil Dimuat')
                    }
                })
                .catch(error => {
                    const toast = useToast();
                    toast.error('Generate AI Gagal Dimuat')
                    console.error('Error generating quote:', error);
                    // Handle error here
                });
        },
        editquotes(id) {
            const tokenlogin = VueCookies.get('tokenlogin')
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/quotes/${id}`
            const formData = new FormData();
            formData.append('image', this.quotesdata.image);
            formData.append('quote', this.quotesdata.quote);
            formData.append('author_name', this.quotesdata.author_name);
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response)
                    this.resulterror = response.data
                    const toast = useToast();
                    if (response.data.message === "Update Quote by ID Successfully") {
                        toast.success('Quotes berhasil diubah')
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                    setTimeout(() => {
                        this.$router.push('/quotes')
                    }, 2000);
                })
                .catch(error => {
                    const toast = useToast();
                    toast.success('Quotes gagal diubah, mohon coba lagi')
                    console.log(error)
                })
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];

            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.quotesdata.image = selectedFile;

            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
            if (!allowedExtensions.exec(selectedFile.name)) {
                const toast = useToast();
                this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                toast.warning('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                // alert('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                // Atau, Anda dapat mengatur pesan kesalahan pada variabel data untuk ditampilkan dalam template
                // this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                // Bersihkan nilai input file
                event.target.value = '';
            } else if (selectedFile.size > 1024 * 1024) { // 1024 KB * 1024 = 1MB
                this.errorMessage = 'Ukuran gambar tidak boleh lebih dari 1MB!';
                // Bersihkan nilai input file
                event.target.value = '';
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
        toggleModalEditAdmin: function () {
            this.showeditadmin = !this.showeditadmin;
        },
    },

}
</script>

<template>
    <div>
        <form v-if="quotesdata" @submit.prevent="editquotes(quotesdata.id)"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
                <!-- Alert Error -->
                <div v-if="statuscode === 200" class="px-2 mt-4">
                    <div class="bg-[#473FE8] px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
                        <svg viewBox="0 0 24 24" class="text-[#4576F5] w-5 h-5 sm:w-5 sm:h-5 mr-3">
                            <path fill="currentColor"
                                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                            </path>
                        </svg>
                        <span class="text-white">Berhasil mengedit quote, halaman akan refresh dalam beberapa detik</span>
                    </div>
                    <!-- End Alert Error -->
                </div>
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-teal font-semibold font-poppins">
                            Edit Quotes
                        </h3>
                        <!-- <button
                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            v-on:click="toggleModalCreateQuotes()">
                            <span
                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            </span>
                        </button> -->
                    </div>
                    <!--body-->
                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="Author" class="font-poppins font-bold text-base text-teal">Author</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" name="Author"
                                v-model="quotesdata.author_name" id="" placeholder="Muhammad Abieb Basnuril" required>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="username" class="font-poppins font-bold text-base text-teal">Quotes</label>
                            <textarea class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="username" id="" v-model="quotesdata.quote" placeholder="Masukkan Quotes"
                                required></textarea>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Gambar" class="font-poppins font-bold text-base text-teal">Gambar</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="file" accept=".jpg,.jpeg,.png"
                                name="Password" @change="handleFileChange" id="">
                            <p v-if="errorMessage" class="text-[#EF0307] font-semibold" required>{{ errorMessage
                            }}</p>
                        </div>

                        <div class="flex gap-2 flex-col justify-end">
                            <label for="Generate Quote" class="font-poppins font-bold text-base text-teal">Generate Quote
                                (ChatGPT)</label>
                            <div class="flex flex-col">
                                <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                    name="username" id="" v-model="prompt" placeholder="Enter prompt here">
                                <p class="w-[150px] hover:cursor-pointer text-center py-1 bg-teal text-white font-poppins rounded-md my-2 flex flex-col"
                                    @click="generateQuote">Generate</p>

                            </div>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <a href="/quotes"><button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                Batal
                            </button></a>

                    </div>
                </div>

            </div>

        </form>
        <div v-if="showcreatequotes" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>