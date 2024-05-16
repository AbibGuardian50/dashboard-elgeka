<script>
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import VueCookies from 'vue-cookies';
import useToast from "vue-toastification";
import 'vue-toastification/dist/index.css';

export default {
  components: {
    Sidebar
  },
  async created() {
    try {
      const tokenlogin = VueCookies.get('tokenlogin');
      if (tokenlogin) {
        const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin';
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${tokenlogin}`
          },
        });
        if (response.data.code === 400) {
          console.log('Superadmin tidak bisa edit superadmin lainnya');
        }
        const superAdmin = VueCookies.get('superAdmin');
        this.getRoles = superAdmin;
        this.daftarid = response.data.result.data.id;
        this.daftaradmin = response.data.result.data;
        this.daftaradmin.sort((x, y) => x.id - y.id);
        this.daftaradmin.forEach((item, index) => {
          item.no = index + 1;
        });
        this.totalPages = Math.ceil(this.daftaradmin.length / this.perPage);
        this.updatePaginatedData();
        console.log(this.daftaradmin);
      } else {
        this.error = 'dilarang akses halaman ini';
      }
    } catch (error) {
      console.error(error);
    }
  },

  data() {
    return {
      daftaradmin: [],
      paginatedData: [],
      error: '',
      noUrut: 0,
      showcreateadmin: false,
      showeditadmin: false,
      showdeleteadmin: false,
      getRoles: false,
      idAdmin: "",
      daftarid: "",
      currentPage: 1,
      perPage: 10,
      totalPages: 0,
      form: {
        full_name: '',
        username: '',
        password: '',
        superAdmin: '',
      },
      formErrors: {
        username: '',
        password: '',
      },
      edited: {
        full_name: '',
        email: '',
      },
    };
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

    validateForm() {
      let valid = true;
      this.formErrors.username = '';
      this.formErrors.password = '';

      if (this.form.username.length < 6 || this.form.username.length > 16) {
        this.formErrors.username = 'Username harus memiliki panjang antara 6 dan 16 karakter.';
        valid = false;
      }

      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
      if (this.form.password.length < 8 || !passwordRegex.test(this.form.password)) {
        this.formErrors.password = 'Password harus memiliki minimal 8 karakter dan mengandung setidaknya satu angka dan satu karakter spesial.';
        valid = false;
      }

      return valid;
    },

    createadmin() {
      if (this.validateForm()) {
        const tokenlogin = VueCookies.get('tokenlogin');
        const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin/create';
        axios.post(url, this.form, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
          .then(response => {
            console.log(response.data);
            window.location.reload();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    editadmin(id) {
      const tokenlogin = VueCookies.get('tokenlogin');
      const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`;
      axios.patch(url, this.edited, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
        .then(response => {
          console.log(response.data);
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
        });
    },

    deleteadmin(id) {
      if (confirm('Apakah kamu yakin untuk menghapus akun admin ini?')) {
        const tokenlogin = VueCookies.get('tokenlogin');
        const url = `https://elgeka-web-api-production.up.railway.app/api/v1/admin/${id}`;
        axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
          .then(response => {
            console.log(response.data);
            window.location.reload();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    updatePaginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      this.paginatedData = this.daftaradmin.slice(start, end);
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
  },
};
</script>


<template>
  <div class="flex">
    <Sidebar />
    <div class="px-8">
      <p class="text-[30px] text-teal font-gotham font-bold">Kelola Akun Admin</p>
      <hr>
      <div>
        <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
          <thead class="bg-gray-50">
            <tr class="border-b-[0.5px] border-b-teal">
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">NO</th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">Nama Lengkap</th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">Username</th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">Status</th>
              <th scope="col" class="px-6 py-3 text-left font-normal font-gotham text-sulfurblack text-base">Roles</th>
              <th v-if="getRoles === 'true'" scope="col" class="">
                <button v-on:click="toggleModalCreateAdmin()"
                  class="bg-teal px-4 py-1 rounded-md text-left font-inter font-semibold text-white text-base">Tambah</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in paginatedData" :key="data.id" class="bg-white divide-y divide-gray-200">
              <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-sulfurblack text-base">{{ data.no }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-gotham font-normal text-sulfurblack text-base">{{ data.full_name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="font-gotham font-normal text-sulfurblack text-base underline">{{ data.username }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="data.is_active" class="inline-flex font-inter text-base text-[#52FF00] leading-5 font-extrabold rounded-md">Aktif</span>
                <span v-else class="inline-flex font-inter text-base text-red leading-5 font-extrabold rounded-md">Nonaktif</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="data.superAdmin" class="inline-flex font-inter text-base leading-5 font-bold rounded-md">Super Admin</span>
                <span v-else class="inline-flex font-inter text-base leading-5 font-bold rounded-md">Admin</span>
              </td>
              <td v-if="getRoles === 'true'" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a :href="'editadmin/' + data.id">
                  <button class="py-1 px-8 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Edit</button>
                </a>
                <button @click="deleteadmin(data.id)" class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 shadow-xl bg-offwhite bg-opacity-64 text-teal font-inter font-bold text-base">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center mt-4">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 mr-2 bg-teal text-white rounded-md">Previous</button>
          <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
            :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
            class="px-4 py-2 mr-2">{{ pageNumber }}</button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-teal text-white rounded-md">Next</button>
        </div>

        <div v-if="showcreateadmin" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <!-- Modal content -->
          <div class="bg-white p-8 rounded-md min-w-[700px] max-w-[750px] min-h-[500px] max-h-[520px]">
            <h2 class="text-2xl text-teal font-poppins font-semibold mb-4">Tambah Admin</h2>
            <form @submit.prevent="createadmin">
              <div class="mb-4">
                <label class="block text-sm font-medium text-teal">Nama Lengkap</label>
                <input type="text" v-model="form.full_name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-teal">Username</label>
                <input type="text" v-model="form.username" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                <p v-if="formErrors.username" class="text-red text-sm mt-1">{{ formErrors.username }}</p>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-teal">Password</label>
                <input type="password" v-model="form.password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                <p v-if="formErrors.password" class="text-red text-sm mt-1">{{ formErrors.password }}</p>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-teal">Roles</label>
                <select v-model="form.superAdmin" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                  <option value="">Select Role</option>
                  <option value="true">Super Admin</option>
                  <option value="false">Admin</option>
                </select>
              </div>
              <div class="flex justify-end">
                <button @click="toggleModalCreateAdmin" type="button" class="mr-4 px-4 py-2 bg-white border border-teal text-teal rounded-md">Batal</button>
                <button type="submit" class="px-4 py-2 bg-teal text-white rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

