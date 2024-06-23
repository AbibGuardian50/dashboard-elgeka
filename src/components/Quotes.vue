<script>
import Sidebar from "./Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import { useToast } from 'vue-toastification';


export default {
    async created() {
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('tokenlogin');
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes';
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                });
                VueCookies.get('tokenlogin');
                this.daftarquotes = response.data.result.data;
                this.daftarquotes.forEach((item, index) => {
                    item.no = index + 1;
                });
                this.totalPages = Math.ceil(this.daftarquotes.length / this.perPage);
                this.updatePaginatedData();
                console.log(response);
                if (response.data.message === "Get Quotes Successfully") {
                    toast.success('Data Quotes berhasil dimuat')
                }
            } else {
                this.error = 'dilarang akses halaman ini';
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
            formErrors: {
                author_name: '',
                quote: '',
                image: '',
            },
            daftarquotes: [],
            showcreatequotes: false,
            showdeletequotes: false,
            perPage: 5,
            currentPage: 1,
            totalPages: 0,
            PaginatedDaftarQuotes: []
        };
    },
    methods: {
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.PaginatedDaftarQuotes = this.daftarquotes.slice(startIndex, endIndex);
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
        async generateQuote(event) {
            event.preventDefault();
            try {
                const tokenlogin = VueCookies.get('tokenlogin');
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes/generate';
                const response = await axios.post(url, { prompt: this.prompt }, { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
                this.token = tokenlogin;
                this.form.quote = response.data.result.generated_quote;
                console.log(response)
                const toast = useToast();
                if (response.data.message === "Generated Quote Successfully") {
                    toast.success('Generate AI Berhasil Dimuat')
                }
            } catch (error) {
                const toast = useToast();
                toast.error('Generate AI Gagal Dimuat')
                console.error('Error generating quote:', error);
            }
        },
        validateForm() {
            let isValid = true;
            this.formErrors = { author_name: '', quote: '', image: '' };

            if (!this.form.author_name) {
                this.formErrors.author_name = 'Author tidak boleh kosong';
                isValid = false;
            }
            if (!this.form.quote) {
                this.formErrors.quote = 'Quotes tidak boleh kosong';
                isValid = false;
            }
            if (!this.form.image) {
                this.formErrors.image = 'Gambar tidak boleh kosong';
                isValid = false;
            }

            return isValid;
        },
        async createquote() {
            const toast = useToast();
            if (this.validateForm()) {
                const tokenlogin = VueCookies.get('tokenlogin');
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/quotes';
                const formData = new FormData();
                formData.append('image', this.form.image);
                formData.append('quote', this.form.quote);
                formData.append('author_name', this.form.author_name);
                try {
                    const response = await axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
                    console.log(response.data);
                    this.statuscode = response.data.code;
                    console.log(this.statuscode);
                    if (response.data.code === 201 && response.data.message === 'Create Quote Successfully') {
                        toast.success('Quotes berhasil dibuat');
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                } catch (error) {
                    console.log(error);
                    toast.error('Quotes gagal dibuat, mohon coba lagi');
                }
            }
        },
        deletequotes(id) {
            const toast = useToast();
            if (confirm('Apakah kamu yakin untuk menghapus Quotes ini?')) {
                const tokenlogin = VueCookies.get('tokenlogin');
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/quotes/${id}`;
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data);
                        if (response.data.code === 200 && response.data.message === 'Delete Quote by ID Successfully') {
                            toast.success('Quotes berhasil dihapus');
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                            toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        toast.error('Quotes gagal dihapus, mohon coba lagi');
                    });
            }
        },
        formatDate(dateString) {
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            this.form.image = selectedFile;
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
        toggleModalCreateQuotes() {
            this.showcreatequotes = !this.showcreatequotes;
        },
        toggleModalDeleteQuotes() {
            this.showdeletequotes = !this.showdeletequotes;
        },
    }
}
</script>

<template>
    <div class="flex bg-offwhite max-lg:h-screen">
        <sidebar />
        <div class="px-8 max-[1400px]:px-2">
            <p class="title-style">Quotes</p>
            <hr>
            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                    <thead>
                        <tr class="border-b-[0.5px] border-b-teal bg-offwhite">
                            <th scope="col" class="th-general max-[1000px]:text-[14px]">
                                No
                            </th>
                            <th scope="col" class="th-general max-[1000px]:text-[14px]">
                                Tanggal dibuat
                            </th>
                            <th scope="col" class="th-general max-[1000px]:text-[14px]">
                                Author
                            </th>
                            <th scope="col" class="th-general max-[1000px]:text-[14px]">
                                Media
                            </th>
                            <th scope="col" class="th-general max-[1000px]:text-[14px]">
                                Quotes
                            </th>
                            <th scope="col" class="flex">
                                <button v-on:click="toggleModalCreateQuotes()"
                                    class="py-1 px-6 rounded-[5px] bg-teal font-inter font-bold text-base text-white mt-2 max-[1000px]:px-2 max-[1000px]:mt-4 max-[1000px]:text-[14px] max-md:text-[12px] max-md:px-1">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="data in PaginatedDaftarQuotes" :key="data.id" class="divide-y divide-gray-200">
                        <tr class="bg-offwhite">
                            <td class="td-general whitespace-nowrap font-poppins font-normal text-sulfurblack max-[1300px]:w-[50px] max-md:w-[30px] max-md:text-[12px]">
                                {{ data.no }}
                            </td>
                            <td class="td-general whitespace-nowrap max-[1300px]:w-[130px] max-[1000px]:w-[80px] max-md:w-[50px] max-[1000px]:whitespace-normal max-md:text-[12px]">
                                <div class="flex items-center ">
                                    <div class="">
                                        <div class="font-poppins font-normal text-sulfurblack ">
                                            {{ formatDate(data.createdAt) }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-general max-[1300px]:w-[130px] max-md:w-[70px] break-words max-md:text-[12px]">
                                <p class="font-poppins font-normal break-words text-sulfurblack ">{{ data.author_name }}</p>
                            </td>
                            <td class="td-general whitespace-nowrap max-[1300px]:w-[160px] max-md:w-[100px] max-md:text-[12px]">
                                <span class="pr-4 inline-flex leading-5 font-semibold rounded-full">
                                    <img class="bg-[url('https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg')] bg-cover bg-center w-[160px] max-h-[160px]"
                                        :src="url + data.image_url">
                                </span>
                            </td>
                            <td class="td-general max-w-[300px] max-[1300px]:w-[150px] max-md:text-[12px] max-md:w-[100px] ">
                                <p class="font-poppins  font-normal text-sulfurblack whitespace-normal break-words max-md:line-clamp-4">{{ data.quote }}</p>
                            </td>
                            <td class="td-general whitespace-nowrap text-sm font-medium max-[850px]:flex max-[850px]:flex-col max-[850px]:items-center max-[850px]:justify-center max-[850px]:w-[50px] max-[850px]:gap-1">
                                <a :href="'editquotes/' + data.id">
                                    <button
                                        class="btn-edit">Edit</button>
                                </a>
                                <button href="#" @click="deletequotes(data.id)"
                                    class="btn-hapus">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination navigation -->
                <div class="ml-8 mt-4 flex justify-center max-[1000px]:w-[50%] max-[600px]:justify-start">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2 mr-2 bg-teal  text-white rounded-md">Previous</button>
                    <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                        :class="{ 'bg-teal  text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                        class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-teal  text-white rounded-md">Next</button>
                </div>

                <!-- Pop up modal buat Quotes baru... -->
                <!-- Pop up modal buat Quotes baru... -->
                <div>
                    <form v-if="showcreatequotes" @submit.prevent="createquote()"
                        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div class="bg-white p-6 rounded-lg min-w-[600px] max-w-[650px]">
                            <h2 class="text-[40px] text-teal font-poppins font-semibold mb-4 border-b border-teal">Buat
                                Quotes Baru</h2>
                            <div class="mb-4">
                                <label for="author" class="block text-[14px] font-verdana font-normal mb-1">Author</label>
                                <input v-model="form.author_name" id="author" type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded" />
                                <span v-if="formErrors.author_name" class="text-red text-sm font-bold">{{
                                    formErrors.author_name }}</span>
                            </div>
                            <div class="mb-4">
                                <label for="quote" class="block text-[14px] font-verdana font-normal mb-1">Quotes</label>
                                <textarea v-model="form.quote" id="quote" rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded"></textarea>
                                <span v-if="formErrors.quote" class="text-red text-sm font-bold">{{ formErrors.quote
                                }}</span>
                            </div>
                            <div class="mb-4">
                                <label for="image" class="block text-[14px] font-verdana font-normal mb-1">Gambar</label>
                                <input @change="handleFileChange" id="image" type="file" accept=".jpg,.jpeg,.png"
                                    class="w-full px-3 py-2 border border-gray-300 rounded" required />
                                <span v-if="formErrors.image" class="text-red text-sm font-bold">{{ formErrors.image
                                }}</span>
                            </div>
                            <div v-if="errorMessage" class="text-red text-sm font-bold mb-4">{{ errorMessage }}</div>
                            <div class="flex flex-col gap-4">
                                <div>
                                    <div class="relative">
                                        <input type="text" class="bg-grey pl-4 py-2 w-full rounded-md" v-model="prompt"
                                            placeholder="Enter your prompt here">
                                        <a target="_blank" href="/UserGuideQuote"><span
                                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_1706_972)">
                                                        <path
                                                            d="M6.06016 6.00004C6.2169 5.55449 6.52626 5.17878 6.93347 4.93946C7.34067 4.70015 7.81943 4.61267 8.28495 4.69252C8.75047 4.77236 9.17271 5.01439 9.47688 5.37573C9.78106 5.73706 9.94753 6.19439 9.94683 6.66671C9.94683 8.00004 7.94683 8.66671 7.94683 8.66671M8.00016 11.3334H8.00683M14.6668 8.00004C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8.00004C1.3335 4.31814 4.31826 1.33337 8.00016 1.33337C11.6821 1.33337 14.6668 4.31814 14.6668 8.00004Z"
                                                            stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round"
                                                            stroke-linejoin="round" />
                                                    </g>
                                                </svg>
                                            </span></a>
                                    </div>
                                    <button class="px-8 py-2 bg-teal text-white font-poppins rounded-md my-2"
                                        @click.prevent="generateQuote">Generate Quote</button>
                                    <div class="bg-teal text-white font-bold font-poppins px-2" v-if="quote">{{
                                        quote.generated_quote
                                    }}</div>
                                </div>

                            </div>
                            <div class="flex gap-2 justify-end">
                                <button type="submit" class="px-4 py-2 bg-teal text-white rounded">Simpan</button>
                                <button @click="toggleModalCreateQuotes()"
                                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2">Batal</button>

                            </div>
                        </div>
                    </form>
                </div>
                <!-- Pop up modal buat Quotes baru... -->
            </div>
        </div>
    </div>
</template>

