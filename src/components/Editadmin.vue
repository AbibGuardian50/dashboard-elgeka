<script>
import axios from 'axios'
export default {
    async created() {
        try {
            const id = this.$route.params.id
            const tokenlogin = sessionStorage.getItem('tokenlogin')
            if (tokenlogin) {
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.daftaradmin = response.data.result.data
                console.log(this.daftaradmin)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        toggleModalEditAdmin: function () {
            this.showeditadmin = !this.showeditadmin;
        },

        editadmin(id) {
            const tokenlogin = sessionStorage.getItem('tokenlogin')
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`
            axios.patch(url, this.edited, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    this.$router.push('/kelolaakun')
                    console.log(response.data)

                })
                .catch(error => {
                    console.log(error)
                    this.$router.push('/kelolaakun')
                })
        },
    },

    data() {
        return {
            showeditadmin: false,
            daftaradmin: '',
            edited: {
                full_name: '',
                email:''
            }

        }
    }
}
</script>

<template>
    <div>
        <form v-if="daftaradmin" @submit.prevent="editadmin(daftaradmin.id)"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div  class="relative w-auto my-6 mx-auto max-w-6xl">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-orange font-semibold font-poppins">
                            Edit Akun Admin
                        </h3>
                        <button
                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            v-on:click="toggleModalCreateAdmin()">
                            <span
                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            </span>
                        </button>
                    </div>
                    <!--body-->
                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="nama lengkap" class="font-poppins font-bold text-base text-orange">Nama
                                Lengkap</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="edited.full_name" name="nama lengkap" id="" :placeholder="daftaradmin.full_name">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Email" class="font-poppins font-bold text-base text-orange">Email</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="email" name="Email"
                                v-model="edited.email" id="" :placeholder="daftaradmin.email">
                        </div>

                        <!-- <div class="flex gap-2 flex-col">
                        <label for="Status" class="font-poppins font-bold text-base text-orange">Status</label>
                         <input class="border border-black py-4 min-w-[550px] pr-2 rounded-md" type="text" name="nama lengkap" id="" placeholder="  Muhammad Abieb Basnuril">
                        <select
                          class="border bg-white border-black py-4 min-w-[550px] pl-2 rounded-md font-poppins font-medium text-base text-[#00000080]"
                          name="Status" id="">
                          <option value="aktif" selected> aktif</option>
                          <option value="nonaktif">nonaktif</option>
                        </select>
                      </div> -->


                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/kelolaakun">
                            <button
                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                batal
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
        <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>