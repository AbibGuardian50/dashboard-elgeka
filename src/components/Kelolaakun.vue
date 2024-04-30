<script>
import axios from "axios"
import Sidebar from "./Sidebar.vue"
import VueCookies from 'vue-cookies';
import useToast from "vue-toastification";
import 'vue-toastification/dist/index.css';

export default {
  components: {
    Sidebar
  },
  async created() {
    try {
      const tokenlogin = VueCookies.get('tokenlogin')
      if (tokenlogin) {
        const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin'
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${tokenlogin}`
          },
        })
        if (response.data.code === 400) {
          console.log('Superadmin tidak bisa edit superadmin lainnya')
        }
        const superAdmin = VueCookies.get('superAdmin')
        this.getRoles = superAdmin
        this.daftarid = response.data.result.data.id
        this.daftaradmin = response.data.result.data
        this.daftaradmin.sort((x, y) => x.id - y.id)
        this.daftaradmin.forEach((item, index) => {
          item.no = index + 1;
        });
        console.log(this.daftaradmin)
      } else {
        this.error = 'dilarang akses halaman ini'
      }
    } catch (error) {
      console.error(error);
    }
  },


  data() {
    // const tokenlogin = sessionStorage.getItem('tokenlogin')
    // console.log(tokenlogin)
    return {
      daftaradmin: [],
      error: '',
      noUrut: 0,
      showcreateadmin: false,
      showeditadmin: false,
      showdeleteadmin: false,
      getRoles: false,
      idAdmin: "",
      daftarid: "",
      form: {
        full_name: [],
        username: '',
        password: '',
        superAdmin: [],
      },
      edited: {
        full_name: [],
        email: [],
      },

    }
  },

  methods: {
    toggleModalCreateAdmin: function () {
      this.showcreateadmin = !this.showcreateadmin;
    },

    toggleModalEditAdmin: function () {
      this.showeditadmin = !this.showeditadmin;
    },

    toggleModalDeleteAdmin: function () {
      this.showdeleteadmin = !this.showdeleteadmin;
    },

    createadmin() {
      const tokenlogin = VueCookies.get('tokenlogin')
      const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin/create'
      axios.post(url, this.form, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
        .then(response => {
          console.log(response.data);
          window.location.reload();
        })
        .catch(error => {
          console.log(error)
        })
    },
    editadmin(id) {
      const tokenlogin = VueCookies.get('tokenlogin')
      const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`
      axios.patch(url, this.edited, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
        .then(response => {
          console.log(response.data)
          window.location.reload();
          this.showErrorToast('Pesan kesalahan disini')
        })
        .catch(error => {
          console.log(error)
          
        })
    },
    deleteadmin(id) {
      if (confirm('Apakah kamu yakin untuk menghapus akun admin ini?')) {
        const tokenlogin = VueCookies.get('tokenlogin')
        const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`
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
    
  },

}
</script>

<template>
  <div class="flex ">
    <Sidebar />
    <div class="px-8">
      <p class="text-[30px] text-orange font-gotham font-bold">Kelola Akun Admin</p>
      <hr>
      <div>
        <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
          <thead class="bg-gray-50">
            <tr class="border-b-[0.5px] border-b-orange">
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                NO
              </th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                Nama Lengkap
              </th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                Username
              </th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">
                Roles
              </th>
              <th v-if="getRoles === 'true'" scope="col" class="">
                <button v-on:click="toggleModalCreateAdmin()"
                  class="bg-orange px-4 py-1 rounded-md text-left font-inter font-semibold text-white text-base">Tambah</button>
              </th>
            </tr>
          </thead>
          <tbody v-for="data in daftaradmin" :key="data.id" class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal  text-sulfurblack text-base">
                {{ data.no }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                  <div class="">
                    <div class="font-gotham font-normal text-sulfurblack text-base">
                      {{ data.full_name }}
                    </div>
                    <!-- <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="font-gotham font-normal text-sulfurblack text-base underline">{{ data.username }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="data.is_active === true" class="inline-flex font-inter text-base text-[#52FF00] leading-5 font-extrabold rounded-md">
                  Aktif
                </span>

                <span v-if="data.is_active === false" class="inline-flex font-inter text-base text-red leading-5 font-extrabold rounded-md">
                  Nonaktif
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="data.superAdmin === true"
                  class="inline-flex font-inter text-base leading-5 font-bold rounded-md">
                  Super Admin
                </span>

                <span v-else class="inline-flex font-inter text-base leading-5 font-bold rounded-md">
                  Admin
                </span>
              </td>
              <td v-if="getRoles === 'true'" class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <a :href="'editadmin/' + data.id">
                  <button
                    class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button>
                </a>
                <button href="#" @click="deleteadmin(data.id)"
                  class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 shadow-xl bg-offwhite bg-opacity-64 text-orange font-inter font-bold text-base ">Hapus</button>
              </td>
              <!-- <td v-if="getRoles === 'false' && idAdmin === daftarid"
                class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <a :href="'editadmin/' + data.id">
                  <button class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit
                    admin</button>
                </a>
                <button href="#" @click="deleteadmin(data.id)"
                  class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
              </td> -->
            </tr>
            <!-- More rows... -->

          </tbody>
        </table>

        <!-- Pop up modal buat akun admin baru... -->
        <div>
          <form v-if="showcreateadmin" @submit.prevent="createadmin()"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
              <!--content-->
              <div
                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <!--header-->
                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                  <h3 class="text-[40px] text-orange font-semibold font-poppins">
                    Akun Admin
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
                    <label for="nama lengkap" class="font-poppins font-bold text-base text-orange">Nama Lengkap</label>
                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" name="nama lengkap"
                      v-model="form.full_name" id="" placeholder="Muhammad Abieb Basnuril">
                  </div>

                  <div class="flex gap-2 flex-col">
                    <label for="username" class="font-poppins font-bold text-base text-orange">username</label>
                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" name="username" id=""
                      v-model="form.username" placeholder="admin abib">
                  </div>

                  <div class="flex gap-2 flex-col">
                    <label for="Password" class="font-poppins font-bold text-base text-orange">Password</label>
                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="password" name="Password"
                      v-model="form.password" id="" placeholder="Masukkan Password">
                  </div>

                  <div class="flex gap-2 flex-col">
                    <label for="Status" class="font-poppins font-bold text-base text-orange">Status</label>
                    <!-- <input class="border border-black py-4 min-w-[550px] pr-2 rounded-md" type="text" name="nama lengkap" id="" placeholder="  Muhammad Abieb Basnuril"> -->
                    <select
                      class="border bg-white border-black py-4 min-w-[550px] pl-2 rounded-md font-poppins font-medium text-base text-[#00000080]"
                      name="Status" id="" v-model="form.superAdmin">
                      <option value="true">SuperAdmin</option>
                      <option value="false">Admin</option>
                    </select>
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
                    type="button" v-on:click="toggleModalCreateAdmin()">
                    Tidak Simpan
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div v-if="showcreateadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>

        <!-- Pop up modal buat edit akun admin... -->
        <div v-for="data in daftaradmin" :key="data.id">
          <form v-if="showeditadmin"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
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
                      v-model="edited.full_name" name="nama lengkap" id="" :placeholder="data.full_name">
                  </div>
                  <div class="flex gap-2 flex-col">
                    <label for="Email" class="font-poppins font-bold text-base text-orange">Email</label>
                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="email" name="Email"
                      v-model="edited.email" id="">
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
                  <button @click="editadmin(data.id)"
                    class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                    type="submit">
                    Simpan
                  </button>
                  <button
                    class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                    type="button" v-on:click="toggleModalEditAdmin()">
                    batal
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>

        <!-- Pop up modal buat hapus akun admin -->

        <div>
          <form v-if="showdeleteadmin"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl">
              <!--content-->
              <div
                class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <!--header-->
                <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                  <h3 class="text-[40px] text-orange font-semibold font-poppins">
                    Konfirmasi Hapus Akun Admin
                  </h3>
                  <button
                    class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    v-on:click="toggleModalDeleteAdmin()">
                    <span
                      class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    </span>
                  </button>
                </div>
                <!--footer-->
                <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                  <button @click="deleteAdmin(id)"
                    class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                    type="submit">
                    Hapus
                  </button>
                  <button
                    class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                    type="button" v-on:click="toggleModalDeleteAdmin()">
                    batal
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div v-if="showdeleteadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>



        <div v-if="error" class="text-red font-gotham font-bold text-2xl pt-4">{{ error }}</div>
      </div>
    </div>

  </div>
</template>
