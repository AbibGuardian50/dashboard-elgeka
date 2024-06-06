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
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-teal font-semibold font-poppins">
                            Edit berita Komunitas
                        </h3>
                        <button
                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            v-on:click="toggleModalCreateAdmin()">
                            <span
                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"></span>
                        </button>
                    </div>
                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="Judul" class="font-poppins font-bold text-base text-teal">Judul</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="daftarberita.title" required name="Judul" id="" :placeholder="daftarberita.title">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="doi_link" class="font-poppins font-bold text-base text-teal">doi_link</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="doi_link" v-model="daftarberita.doi_link" required
                                :placeholder="daftarberita.doi_link">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Kategori" class="font-verdana font-normal text-base text-teal">Kategori</label>
                            <select name="Kategori" id="Kategori"
                                class="border border-silver py-4 min-w-[550px] pl-2 rounded-md" required
                                v-model="daftarberita.kategori">
                                <option value="perkembanganCML" selected>Perkembangan CML</option>
                                <option value="perkembanganKomunitas">Perkembangan Komunitas</option>
                            </select>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Deskripsi berita" class="font-poppins font-bold text-base text-teal">Deskripsi
                                berita</label>
                            <div class="border border-black py-2 min-w-[550px] pl-2 rounded-md">
                                <quill-editor theme="snow" contentType="html" required
                                    class="font-poppins font-normal text-[16px]" v-model:content="daftarberita.content"
                                    :content="editedData"></quill-editor>
                            </div>
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Gambar" class="font-poppins font-bold text-base text-teal">Gambar</label>
                            <input class="border border-black py-2 min-w-[550px] pl-2 rounded-md" type="file" name="Gambar" accept=".jpg,.jpeg,.png"
                                id="foto-sampul-input" @change="handleFileChange">
                            <p v-if="errorMessage" class="text-[#EF0307] font-semibold">{{ errorMessage }}</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/berita">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                batal
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

