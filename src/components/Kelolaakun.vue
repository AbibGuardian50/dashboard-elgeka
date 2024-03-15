<script>
import axios from "axios"
import Sidebar from "./Sidebar.vue"

export default {
  components: {
    Sidebar
  },
  async created() {
    try {
      const tokenlogin = sessionStorage.getItem('tokenlogin')
      if (tokenlogin) {
        const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin'
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${tokenlogin}`
          },
        })
        sessionStorage.getItem('tokenlogin')
        this.daftaradmin = response.data.result.data
        this.daftaradmin.sort((x, y) => x.id - y.id)
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
      akunadmin: [
        { no: 1, name: "Jane Cooper", email: "ABIB@gmail.com", status: "Aktif" },
        { no: 2, name: "John Price", email: "John@gmail.com", status: "Aktif" },
        { no: 3, name: "Jane Basnuril", email: "Basnuril@gmail.com", status: "Aktif" },
      ],
      daftaradmin: [],
      error: '',
      showcreateadmin: false,
      showeditadmin: false,
      showdeleteadmin: false,
      form: {
        full_name: [],
        email: [],
        password: [],
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
      const tokenlogin = sessionStorage.getItem('tokenlogin')
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
      const tokenlogin = sessionStorage.getItem('tokenlogin')
      const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`
      axios.patch(url, this.edited, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
        .then(response => {
          console.log(response.data)
          window.location.reload();
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteadmin(id) {
      if (confirm('Are you sure you want to delete this admin account?')) {
        const tokenlogin = sessionStorage.getItem('tokenlogin')
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

    }

  },



}
</script>

<template>
  <div class="flex ">
    <Sidebar />

    <div class="px-8">
      <p class="text-[30px] text-orange font-gotham font-bold">Kelola Akun</p>
      <hr>
      <p class="font-gotham font-normal text-[20px] text-sulfurblack mt-4">Akun Admin</p>

      <div>
        <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
          <thead class="bg-gray-50">
            <tr class="border-b-[0.5px] border-b-orange">
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                NO
              </th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                Nama Lengkap
              </th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                Status
              </th>
              <th scope="col" class="">
                <button v-on:click="toggleModalCreateAdmin()"
                  class="bg-orange px-2 py-1 text-left font-gotham text-black text-base">+</button>
              </th>
            </tr>
          </thead>

          <tbody v-for="data in daftaradmin" :key="data.id" class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-black text-base">
                {{ data.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                  <div class="">
                    <div class="font-gotham font-normal text-black text-base">
                      {{ data.full_name }}
                    </div>
                    <!-- <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="font-gotham font-normal text-black text-base underline">{{ data.email }}</p>

              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-base leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button href="#" @click="toggleModalEditAdmin()"
                  class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button>
                <button href="#" @click="deleteadmin(data.id)"
                  class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
              </td>
            </tr>

            <!-- More rows... -->

            <!-- Pop up modal buat edit akun admin... -->
            <div>
              <form v-if="showeditadmin" @submit.prevent="editadmin(data.id)"
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
                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text" v-model="edited.full_name"
                          name="nama lengkap" id="" :placeholder="data.full_name">
                      </div>

                      <div class="flex gap-2 flex-col">
                        <label for="Email" class="font-poppins font-bold text-base text-orange">Email</label>
                        <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="email" name="Email" v-model="edited.email"
                          id="" :placeholder="data.email">
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
                    <label for="Email" class="font-poppins font-bold text-base text-orange">Email</label>
                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="email" name="Email" id=""
                      v-model="form.email" placeholder="abib@gmail.com">
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
                      name="Status" id="">
                      <option value="true" selected> aktif</option>
                      <option value="false"> nonaktif</option>
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
