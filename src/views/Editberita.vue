<script>
import { useToast } from 'vue-toastification';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    async created() {
        try {
            const id = this.$route.params.id;
            const tokenlogin = VueCookies.get('tokenlogin');
            if (tokenlogin) {
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/berita/${id}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                });
                this.daftarberita = response.data.result.data;
                this.editedData = this.daftarberita.content;
                console.log(this.daftarberita);
            } else {
                this.error = 'dilarang akses halaman ini';
            }
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        QuillEditor
    },
    data() {
        return {
            errorMessage: '',
            daftarberita: {
                title: '',
                content: '',
                kategori: '',
                show: '',
                doi_link: '',
                image: null,
            },
            editedData: ""
        };
    },
    methods: {
        async editberita(id) {
            const toast = useToast();
            const tokenlogin = VueCookies.get('tokenlogin');
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/berita/${id}`;
            const formData = new FormData();
            formData.append('title', this.daftarberita.title);
            formData.append('content', this.daftarberita.content);
            formData.append('kategori', this.daftarberita.kategori);
            formData.append('doi_link', this.daftarberita.doi_link);
            formData.append('show', this.daftarberita.show);
            if (this.daftarberita.image) {
                formData.append('image', this.daftarberita.image);
            }
            try {
                const response = await axios.patch(url, formData, {
                    headers: {
                        'Authorization': `Bearer ${tokenlogin}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.message === "Update Berita by ID Successfully") {
                    toast.success('Berita berhasil diubah')
                    setTimeout(function () {
                        window.location.href = '/berita'
                    }, 1000);
                    console.log(response);
                }
                else if (response.data.message === "Your admin status is not active, authorization denied!") {
                    toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                }

            } catch (error) {
                console.log(error);
                this.$router.push('/berita');
            }
        },
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

            if (!allowedExtensions.exec(selectedFile.name)) {
                const toast = useToast();
                this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                toast.warning('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                event.target.value = ''; // Clear the input
            } else if (selectedFile.size > 1024 * 1024) { // 1024 KB * 1024 = 1MB
                this.errorMessage = 'Ukuran gambar tidak boleh lebih dari 1MB!';
                // Bersihkan nilai input file
                event.target.value = '';
            } else {
                this.daftarberita.image = selectedFile; // Update the image in daftarberita
                this.errorMessage = ''; // Clear the error message if the file is valid
            }
        }
    },
}
</script>


<template>
    <div>
        <form v-if="daftarberita" @submit.prevent="editberita(daftarberita.id)"
            class="fixed inset-0 z-50 flex justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div class="relative w-full max-w-6xl mx-auto my-6">
                <div class="flex flex-col w-full bg-white border border-black rounded-lg shadow-lg outline-none focus:outline-none">
                    <!-- Header -->
                    <div class="flex items-start justify-between p-5 border-b border-gray-300 rounded-t">
                        <h3 class="text-2xl font-semibold text-teal">Edit Berita (Informasi CML)</h3>
                    </div>
                    <!-- Body -->
                    <div class="relative flex flex-col gap-6 p-6">
                        <div class="flex flex-col gap-2">
                            <label for="Judul" class="text-base font-bold text-teal">Judul</label>
                            <input class="w-full px-3 py-2 border rounded-md" type="text" v-model="daftarberita.title" required name="Judul"
                                placeholder="Masukkan judul">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="doi_link" class="text-base font-bold text-teal">DOI Link</label>
                            <input class="w-full px-3 py-2 border rounded-md" type="text" name="doi_link" v-model="daftarberita.doi_link" required
                                placeholder="Masukkan DOI Link">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="Kategori" class="text-base font-bold text-teal">Kategori</label>
                            <select name="Kategori" id="Kategori" class="w-full px-3 py-2 border rounded-md" required v-model="daftarberita.kategori">
                                <option value="perkembanganCML">Perkembangan CML</option>
                                <option value="perkembanganKomunitas">Perkembangan Komunitas</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="Kategori" class="text-base font-bold text-teal">Kategori</label>
                            <select name="Kategori" id="Kategori" class="w-full px-3 py-2 border rounded-md" required v-model="daftarberita.show">
                                <option value="false">Disembunyikan</option>
                                <option value="true">Tampil</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="Deskripsi berita" class="text-base font-bold text-teal">Deskripsi Berita</label>
                            <div class="w-full p-2 border rounded-md">
                                <quill-editor theme="snow" contentType="html" required class="w-full font-normal text-base" v-model:content="daftarberita.content"
                                    :content="editedData"></quill-editor>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="Gambar" class="text-base font-bold text-teal">Gambar</label>
                            <input class="w-full px-3 py-2 border rounded-md" type="file" name="Gambar" accept=".jpg,.jpeg,.png" id="foto-sampul-input" @change="handleFileChange">
                            <p v-if="errorMessage" class="text-red-600 font-semibold">{{ errorMessage }}</p>
                        </div>
                    </div>
                    <!-- Footer -->
                    <div class="flex items-center justify-center p-6 border-t border-gray-300 rounded-b">
                        <button class="px-6 py-3 text-sm font-bold text-white uppercase bg-teal rounded hover:bg-teal-600 focus:outline-none"
                            type="submit">Simpan</button>
                        <router-link to="/berita">
                            <button class="px-6 py-3 ml-4 text-sm font-bold text-teal uppercase bg-white border border-teal rounded hover:bg-teal-600 focus:outline-none"
                                type="button">Batal</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

