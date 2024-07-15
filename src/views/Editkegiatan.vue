<script>
import axios from 'axios'
import { useToast } from 'vue-toastification';
import VueCookies from 'vue-cookies';
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    async created() {
        try {
            const id = this.$route.params.id
            const tokenlogin = VueCookies.get('tokenlogin')
            if (tokenlogin) {
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.daftarkegiatan = response.data.result.data
                console.log(this.daftarkegiatan)
            } else {
                this.error = 'dilarang akses halaman ini'
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
            daftarkegiatan: '',
            daftarkegiatan: {
                title: '',
                content: '',
                tempat: '',
                date: '',
                image: null,
            }
        }
    },
    methods: {
        editkegiatan(id) {
            const toast = useToast();
            const tokenlogin = VueCookies.get('tokenlogin')
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/kegiatanKomunitas/${id}`
            const formData = new FormData();
            formData.append('title', this.daftarkegiatan.title);
            formData.append('content', this.daftarkegiatan.content);
            formData.append('tempat', this.daftarkegiatan.tempat);
            formData.append('date', this.daftarkegiatan.date);
            if (this.daftarkegiatan.image) {
                formData.append('image', this.daftarkegiatan.image);
            }
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    this.$router.push('/kegiatan')
                    console.log(response.data)
                    if (response.data.message === "Update Kegiatan Komunitas by ID Successfully") {
                        toast.success('Kegiatan Komunitas berhasil diperbarui')
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status admin masih nonaktif, mohon untuk login kembali jika merasa sudah mengubahnya')
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/kegiatan')
                })
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
                this.daftarkegiatan.image = selectedFile; // Update the image in daftarkegiatan
                this.errorMessage = ''; // Clear the error message if the file is valid
            }
        }
    }
}
</script>

<template>
    <div>
        <form v-if="daftarkegiatan" @submit.prevent="editkegiatan(daftarkegiatan.id)"
            class="fixed inset-0 z-50 flex justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div class="relative w-full max-w-6xl mx-auto my-6">
                <!--content-->
                <div
                    class="flex flex-col w-full bg-white border border-red rounded-lg shadow-lg outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b border-black rounded-t">
                        <h3 class="text-2xl font-semibold text-teal font-poppins">
                            Edit Kegiatan Komunitas
                        </h3>
                    </div>
                    <!--body-->
                    <div class="relative flex flex-col gap-6 p-6">
                        <div class="flex flex-col gap-2">
                            <label for="Judul" class="text-base font-bold text-teal font-poppins">Judul</label>
                            <input class="w-full px-3 py-2 border rounded-md" type="text" required
                                v-model="daftarkegiatan.title" name="Judul" placeholder="Masukkan judul kegiatan">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="tempat" class="text-base font-bold text-teal font-poppins">Tempat</label>
                            <input class="w-full px-3 py-2 border rounded-md" type="text" name="tempat" required
                                v-model="daftarkegiatan.tempat" placeholder="Masukkan tempat kegiatan">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Deskripsi Kegiatan" class="text-base font-bold text-teal font-poppins">Deskripsi
                                Kegiatan</label>
                            <div class="w-full p-2 border rounded-md">
                                <quill-editor theme="snow" contentType="html" class="w-full text-base"
                                    v-model:content="daftarkegiatan.content"></quill-editor>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Tanggal" class="text-base font-bold text-teal font-poppins">Tanggal</label>
                            <input class="w-full px-3 py-2 border rounded-md" type="date" name="Tanggal" required
                                v-model="daftarkegiatan.date" placeholder="Pilih tanggal kegiatan">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Gambar" class="text-base font-bold text-teal font-poppins">Gambar</label>
                            <input class="w-full px-3 py-2 border rounded-md" type="file" name="Gambar"
                                accept=".jpg,.jpeg,.png" @change="handleFileChange">
                            <p v-if="errorMessage" class="font-semibold text-red-600">{{ errorMessage }}</p>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t border-black rounded-b">
                        <button
                            class="px-12 py-3 text-sm font-bold text-white uppercase bg-teal rounded hover:bg-teal-600 focus:outline-none"
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/kegiatan">
                            <button
                                class="px-6 py-3 ml-4 text-sm font-bold text-teal uppercase bg-white border border-teal rounded hover:bg-teal-600 focus:outline-none"
                            type="button">
                            Batal
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </form>
</div></template>