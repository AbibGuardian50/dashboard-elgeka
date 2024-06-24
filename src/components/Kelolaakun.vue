<script>
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default {
  components: {
    Sidebar
  },
  async created() {
    try {
      const tokenlogin = VueCookies.get('tokenlogin');
      if (tokenlogin) {
        const response = await this.fetchAdminData(tokenlogin);
        const toast = useToast();
        this.initializeAdminData(response);
        if (response.data.message === "Get All Admin Successfully") {
          toast.success('Data semua admin berhasil dimuat');
          this.showToastMessage('SuperAdmin tidak bisa melakukan edit ke SuperAdmin lainnya');
        }
      } else {
        this.error = 'dilarang akses halaman ini';
      }
    } catch (error) {
      console.error(error);
    }
  },

  data() {
    return {
      currentAdminId: '',
      daftaradmin: [],
      paginatedData: [],
      error: '',
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
        superAdmin: '',
      },
      edited: {
        full_name: '',
        email: '',
      },
    };
  },

  methods: {
    async fetchAdminData(token) {
      const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin';
      return await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },

    initializeAdminData(response) {
      this.currentAdminId = VueCookies.get('id_user');
      const superAdmin = VueCookies.get('superAdmin');
      this.getRoles = superAdmin;
      this.daftarid = response.data.result.data.id;
      this.daftaradmin = response.data.result.data;
      this.sortAdminData();
      this.updatePaginatedData();
    },

    sortAdminData() {
      this.daftaradmin.sort((x, y) => x.id - y.id);
      this.daftaradmin.forEach((item, index) => {
        item.no = index + 1;
      });
      this.totalPages = Math.ceil(this.daftaradmin.length / this.perPage);
    },

    showToastMessage(message) {
      const toast = useToast();
      setTimeout(() => {
        toast.info(message);
      }, 1000);
    },

    toggleModalCreateAdmin() {
      this.showcreateadmin = !this.showcreateadmin;
    },

    toggleModalEditAdmin() {
      this.showeditadmin = !this.showeditadmin;
    },

    toggleModalDeleteAdmin() {
      this.showdeleteadmin = !this.showdeleteadmin;
    },

    validateForm() {
      let valid = true;
      this.clearFormErrors();

      if (this.isInvalidUsername(this.form.username)) {
        valid = false;
      }

      if (this.isInvalidPassword(this.form.password)) {
        valid = false;
      }

      if (!this.form.superAdmin) {
        this.formErrors.superAdmin = 'Role harus dipilih.';
        valid = false;
      }

      return valid;
    },

    clearFormErrors() {
      this.formErrors.username = '';
      this.formErrors.password = '';
      this.formErrors.superAdmin = '';
    },

    isInvalidUsername(username) {
      const toast = useToast();
      if (username.length < 6 || username.length > 16) {
        toast.warning('Username harus memiliki panjang antara 6 dan 16 karakter');
        this.formErrors.username = 'Username harus memiliki panjang antara 6 dan 16 karakter.';
        return true;
      } else if (/[A-Z]/.test(username)) {
        toast.warning('Username tidak boleh mengandung huruf kapital');
        this.formErrors.username = 'Username tidak boleh mengandung huruf kapital.';
        return true;
      }
      return false;
    },

    isInvalidPassword(password) {
      const toast = useToast();
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
      if (password.length < 8 || !passwordRegex.test(password)) {
        toast.warning('Password harus memiliki minimal 8 karakter dan mengandung setidaknya satu angka dan satu karakter spesial.');
        this.formErrors.password = 'Password harus memiliki minimal 8 karakter dan mengandung setidaknya satu angka dan satu karakter spesial.';
        return true;
      }
      return false;
    },

    createadmin() {
      if (this.validateForm()) {
        const toast = useToast();
        const tokenlogin = VueCookies.get('tokenlogin');
        const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/admin/create';
        axios.post(url, this.form, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
          .then(response => {
            console.log(response.data);
            window.location.reload();
          })
          .catch(error => {
            toast.error('Terdapat Kesalahan pada sistem, mohon coba lagi');
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
  <div class="flex bg-offwhite">
    <Sidebar />
    <div class="px-8 max-[800px]:px-1 bg-offwhite w-full">
      <p class="title-style">Kelola Akun Admin</p>
      <hr>
      <div class="overflow-x-auto max-[1300px]:overflow-x-visible">
        <table class="min-w-full bg-offwhite divide-y divide-gray-200 w-full">
          <thead class="bg-offwhite">
            <tr class="border-b-[0.5px]">
              <th scope="col" class="max-[1300px]:px-3 max-[1100px]:px-1 max-[880px]:text-[0.875rem] max-sm:text-[0.575rem] px-6 py-3 text-left font-normal font-poppins text-sulfurblack text-base">NO</th>
              <th scope="col" class="max-[1300px]:px-3 max-[1100px]:px-1 max-[880px]:text-[0.875rem] max-sm:text-[0.575rem] px-6 py-3 text-left font-normal font-poppins text-sulfurblack text-base">Nama Lengkap
              </th>
              <th scope="col" class="max-[1300px]:px-3 max-[1100px]:px-1 max-[880px]:text-[0.875rem] max-sm:text-[0.575rem] px-6 py-3 text-left font-normal font-poppins text-sulfurblack text-base">Username
              </th>
              <th scope="col" class="max-[1300px]:px-3 max-[1100px]:px-1 max-[880px]:text-[0.875rem] max-sm:text-[0.575rem] px-6 py-3 text-left font-normal font-poppins text-sulfurblack text-base">Status</th>
              <th scope="col" class="max-[1300px]:px-3 max-[1100px]:px-1 max-[880px]:text-[0.875rem] max-sm:text-[0.575rem] px-6 py-3 text-left font-normal font-poppins text-sulfurblack text-base">Roles</th>
              <th v-if="getRoles === 'true'" scope="col"
                class="max-[1300px]:px-3 max-[1100px]:px-1 px-6 py-3 max-[880px]:text-[0.875rem] max-sm:text-[0.575rem] text-left font-normal font-poppins text-sulfurblack text-base">
                <button @click="toggleModalCreateAdmin"
                  class="btn-add">Tambah</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in paginatedData" :key="data.id" class="bg-offwhite">
              <td
                class="max-[1300px]:px-3 max-[1100px]:px-1 px-6 py-4 border-b border-gray-200 whitespace-nowrap font-poppins font-normal text-sulfurblack text-base max-[880px]:text-[0.875rem] max-sm:text-[0.575rem]">
                {{ data.no }}</td>
              <td class="max-[1300px]:px-3 max-[1100px]:px-1 px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-poppins font-normal text-sulfurblack text-base max-[880px]:text-[0.875rem] max-sm:text-[0.575rem]">{{ data.full_name }}</div>
                </div>
              </td>
              <td class="max-[1300px]:px-3 max-[1100px]:px-1 px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <p class="font-poppins font-normal text-sulfurblack text-base underline max-[880px]:text-[0.875rem] max-sm:text-[0.575rem]">{{ data.username }}</p>
              </td>
              <td class="max-[1300px]:px-3 max-[1100px]:px-1 px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <span v-if="data.is_active"
                  class="inline-flex font-inter text-base text-[#52FF00] leading-5 font-extrabold rounded-md max-[880px]:text-[0.875rem] max-sm:text-[0.575rem]">Aktif</span>
                <span v-else
                  class="inline-flex font-inter text-base text-red leading-5 font-extrabold rounded-md max-[880px]:text-[0.875rem] max-sm:text-[0.575rem]">Nonaktif</span>
              </td>
              <td class="max-[1300px]:px-3 max-[1100px]:px-1 px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <span v-if="data.superAdmin" class="inline-flex font-inter text-base leading-5 font-bold rounded-md max-[880px]:text-[0.875rem] max-sm:text-[0.575rem]">Super
                  Admin</span>
                <span v-else class="inline-flex font-inter text-base leading-5 font-bold rounded-md max-[880px]:text-[0.875rem] max-sm:text-[0.575rem]">Admin</span>
              </td>
              <td class="max-[1300px]:px-3 max-[1100px]:px-1 px-6 py-4 border-b border-gray-200 whitespace-nowrap text-sm  font-medium">
                <template
                  v-if="data.id === currentAdminId || (getRoles === 'true' && (data.is_active || !data.is_active) && !data.superAdmin)">
                  <a :href="'editadmin/' + data.id">
                    <button
                      class="btn-edit">Edit</button>
                  </a>
                  <button @click="deleteadmin(data.id)"
                    class="btn-hapus">Hapus</button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 mr-2 bg-teal text-white rounded-md">Previous</button>
        <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
          :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
          class="px-4 py-2 mr-2">{{ pageNumber }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-teal text-white rounded-md">Next</button>
      </div>
      <!-- Modal Tambah Admin -->
      <div v-if="showcreateadmin" class="fixed inset-0 max-md:z-20 max-[700px]:block flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-8 rounded-md min-w-[700px] max-[720px]:min-w-[300px] max-[720px]:max-w-[350px] max-[350px]:min-w-[200px] max-[350px]:max-w-[250px] max-w-[750px] min-h-[500px] max-h-[520px]">
          <h2 class="text-2xl text-teal font-poppins font-semibold mb-4">Tambah Admin</h2>
          <form @submit.prevent="createadmin">
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Nama Lengkap</label>
              <input type="text" v-model="form.full_name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Username</label>
              <input type="text" v-model="form.username"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required />
              <p v-if="formErrors.username" class="text-red text-sm mt-1">{{ formErrors.username }}</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Password</label>
              <input type="password" v-model="form.password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required />
              <p v-if="formErrors.password" class="text-red text-sm mt-1">{{ formErrors.password }}</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Roles</label>
              <select v-model="form.superAdmin"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required>
                <option value="">Select Role</option>
                <option value="true">Super Admin</option>
                <option value="false">Admin</option>
              </select>
              <p v-if="formErrors.superAdmin" class="text-red text-sm mt-1">{{ formErrors.superAdmin }}</p>
            </div>
            <div class="flex justify-end gap-2">
              <button type="submit" class="px-4 py-2 bg-teal text-white rounded-md">Simpan</button>
              <button @click="toggleModalCreateAdmin" type="button"
                class="mr-4 px-4 py-2 bg-white border border-teal text-teal rounded-md">Batal</button>
            </div>
        </form>
      </div>
    </div>
  </div>
</div></template>

