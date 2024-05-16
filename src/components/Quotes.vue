<script>
import Sidebar from "./Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import moment from 'moment';
import 'moment/locale/id';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
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
                console.log(this.daftarquotes);
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
                console.log(this.quote);
                console.log(this.token);
            } catch (error) {
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
                    }
                } catch (error) {
                    console.log(error);
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
                    }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        formatDateTime(dateTimeString) {
            moment.locale('id');
            return moment(dateTimeString).format('LLL');
        },
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            this.form.image = selectedFile;

            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

            if (!allowedExtensions.exec(selectedFile.name)) {
                this.errorMessage = 'Hanya file JPEG, JPG, dan PNG yang diizinkan';
                this.form.image = null;  // Reset the image if validation fails
            } else {
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
    <div class="flex">
        <sidebar />
        <div class="px-8">
            <p class="text-[30px] text-teal font-gotham font-bold">Quotes</p>
            <hr>
            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                    <thead class="bg-gray-50">
                        <tr class="border-b-[0.5px] border-b-teal">
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
                                    class="py-1 px-6 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="data in PaginatedDaftarQuotes" :key="data.id" class="bg-white divide-y divide-gray-200">
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
                                        class="py-1 px-8 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Edit</button>
                                </a>
                                <button href="#" @click="deletequotes(data.id)"
                                    class="py-1 px-8 rounded-[5px] shadow-xl bg-offwhite bg-opacity-64 text-teal  ml-2 font-inter font-bold text-base">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination navigation -->
                <div class="ml-8 mt-4 flex justify-center">
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
                        <h2 class="text-[40px] text-teal font-poppins font-semibold mb-4 border-b border-teal">Buat Quotes Baru</h2>
                        <div class="mb-4">
                            <label for="author" class="block text-[14px] font-verdana font-normal mb-1">Author</label>
                            <input v-model="form.author_name" id="author" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded" />
                            <span v-if="formErrors.author_name" class="text-red text-sm font-bold">{{ formErrors.author_name }}</span>
                        </div>
                        <div class="mb-4">
                            <label for="quote" class="block text-[14px] font-verdana font-normal mb-1">Quotes</label>
                            <textarea v-model="form.quote" id="quote" rows="3"
                                class="w-full px-3 py-2 border border-gray-300 rounded"></textarea>
                            <span v-if="formErrors.quote" class="text-red text-sm font-bold">{{ formErrors.quote }}</span>
                        </div>
                        <div class="mb-4">
                            <label for="image" class="block text-[14px] font-verdana font-normal mb-1">Gambar</label>
                            <input @change="handleFileChange" id="image" type="file"
                                class="w-full px-3 py-2 border border-gray-300 rounded" required />
                            <span v-if="formErrors.image" class="text-red text-sm font-bold">{{ formErrors.image }}</span>
                        </div>
                        <div v-if="errorMessage" class="text-red text-sm font-bold mb-4">{{ errorMessage }}</div>
                        <div class="flex flex-col gap-4">
                            <div>
                                <input type="text" class="bg-grey pl-4 py-2 w-full rounded-md" v-model="prompt"
                                    placeholder="Enter your prompt here">
                                <button class="px-8 py-2 bg-teal text-white font-poppins rounded-md my-2"
                                    @click.prevent="generateQuote">Generate Quote</button>
                                <div class="bg-teal text-white font-bold font-poppins px-2" v-if="quote">{{
                                    quote.generated_quote
                                }}</div>
                            </div>

                        </div>
                        <div class="flex justify-end">
                            <button @click="toggleModalCreateQuotes()"
                                class="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2">Cancel</button>
                            <button type="submit" class="px-4 py-2 bg-teal text-white rounded">Buat</button>
                        </div>
                    </div>
                </form>
            </div>
                <!-- Pop up modal buat Quotes baru... -->
            </div>
        </div>
    </div>
</template>

