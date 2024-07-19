<script>
import axios from "axios";
import Sidebar from "../components/Sidebar.vue"
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
      sortKey: '',
      sortOrder: 'asc',
      sortIcon: {
        no: 'asc',
        status: 'asc',
        roles: 'asc',
      },
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
      } else if (/\s/.test(username)) {
        toast.warning('Username tidak boleh mengandung spasi');
        this.formErrors.username = 'Username tidak boleh mengandung spasi.';
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
            if (response.data.message === 'Create New Admin Success') {
              toast.success('Admin baru berhasil dibuat')
              setTimeout(() => {
                window.location.reload();;
              }, 1000);
            } else if (response.data.message === 'Error Creating New Admin: Username already exists') {
              toast.error('username yang sama sudah ada, mohon untuk mengganti dengan username lain')
            }
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

    sortData(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }

      // Update sort icon for the clicked column
      this.sortIcon[key] = this.sortOrder;

      // Reset sort icons for other columns
      Object.keys(this.sortIcon).forEach(k => {
        if (k !== key) {
          this.sortIcon[k] = 'asc';
        }
      });

      this.daftaradmin.sort((a, b) => {
        let result = 0;
        if (key === 'no') {
          result = a.no - b.no;
        } else if (key === 'status') {
          result = (a.is_active === b.is_active) ? 0 : a.is_active ? -1 : 1;
        } else if (key === 'roles') {
          result = (a.superAdmin === b.superAdmin) ? 0 : a.superAdmin ? -1 : 1;
        }
        return this.sortOrder === 'asc' ? result : -result;
      });
      this.updatePaginatedData();
    }
  },
};
</script>

<template>
  <div class="flex bg-offwhite h-full">
    <Sidebar />
    <div class="px-8 max-[800px]:px-1 bg-offwhite w-full">
      <p class="title-style">Kelola Akun Admin</p>
      <hr>
      <div class="container-table-general">
        <table class="table-general">
          <thead class="bg-offwhite">
            <tr class="border-b-[0.5px]">
              <th scope="col"
                class="th-general max-[1000px]:text-[14px] max-md:pl-0 pl-2 cursor-pointer flex items-center"
                @click="sortData('no')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="black" stroke-width="2" />
                </svg>
                <span v-if="sortIcon.no === 'asc'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19V6M5 12l7-7 7 7" />
                  </svg>
                </span>
                <span v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v13M5 12l7 7 7-7" />
                  </svg>
                </span>
              </th>
              <th scope="col" class="th-general max-md:pl-0">Nama Lengkap</th>
              <th scope="col" class="th-general max-md:pl-0">Username</th>
              <th scope="col" class="th-general max-md:pl-0 cursor-pointer" @click="sortData('status')"><svg fill="none"
                  height="16" viewBox="0 0 512 512" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M476.843 57.6L326.333 274.77L326.182 274.99C320.698 282.603 317.745 291.747 317.743 301.13V407.39C317.746 410.792 316.882 414.138 315.232 417.113C313.582 420.088 311.201 422.592 308.313 424.39L212.483 484C204.823 488.77 193.723 487.19 193.773 478.17V301.13C193.77 291.747 190.818 282.603 185.333 274.99L185.183 274.77L34.6728 57.6C28.7267 48.5695 35.1696 36.1 46.4405 36.1H465.554C476.824 36.1 483.266 48.5695 477.32 57.6H476.843Z"
                    fill="#000000" />
                </svg>Status</th>
              <th scope="col" class="th-general max-md:pl-0 cursor-pointer" @click="sortData('roles')"><svg fill="none"
                  height="16" viewBox="0 0 512 512" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M476.843 57.6L326.333 274.77L326.182 274.99C320.698 282.603 317.745 291.747 317.743 301.13V407.39C317.746 410.792 316.882 414.138 315.232 417.113C313.582 420.088 311.201 422.592 308.313 424.39L212.483 484C204.823 488.77 193.723 487.19 193.773 478.17V301.13C193.77 291.747 190.818 282.603 185.333 274.99L185.183 274.77L34.6728 57.6C28.7267 48.5695 35.1696 36.1 46.4405 36.1H465.554C476.824 36.1 483.266 48.5695 477.32 57.6H476.843Z"
                    fill="#000000" />
                </svg>Roles</th>
              <th v-if="getRoles === 'true'" scope="col" class="th-general">
                <button @click="toggleModalCreateAdmin" class="btn-add">Tambah</button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="data in paginatedData" :key="data.id" class="bg-offwhite">
              <td class="td-general td-text-general">
                {{ data.no }}</td>
              <td class="td-general">
                <div class="flex items-center">
                  <div class="td-text-general">{{ data.full_name }}</div>
                </div>
              </td>
              <td class="td-general">
                <p class="td-text-general">{{ data.username }}</p>
              </td>
              <td class="td-general">
                <span v-if="data.is_active" class="td-text-general text-[#52FF00] font-extrabold">Aktif</span>
                <span v-else class="td-text-general text-[#FF0000] font-extrabold">Non-Aktif</span>
              </td>
              <td class="td-general">
                <span v-if="data.superAdmin" class="td-text-general font-bold">Super
                  Admin</span>
                <span v-else class="td-text-general font-bold">Admin</span>
              </td>
              <td class="td-general max-md:items-center max-md:flex max-md:flex-col max-md:gap-4 font-medium">
                <template
                  v-if="data.id === currentAdminId || (getRoles === 'true' && (data.is_active || !data.is_active) && !data.superAdmin)">
                  <a :href="'editadmin/' + data.id">
                    <button class="btn-edit">Edit</button>
                  </a>
                  <button @click="deleteadmin(data.id)" class="btn-hapus">Hapus</button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-center my-8">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 mr-2 bg-teal text-white rounded-md">Previous</button>
        <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
          :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
          class="px-4 py-2 mr-2">{{ pageNumber }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-teal text-white rounded-md">Next</button>
      </div>
      <!-- Modal Tambah Admin -->
      <div v-if="showcreateadmin"
        class="fixed inset-0 max-md:z-20 max-[700px]:block flex items-center justify-center bg-black bg-opacity-50">
        <div
          class="bg-white p-8 rounded-md min-w-[700px] max-[720px]:min-w-[300px] max-[720px]:max-w-[350px] max-[350px]:min-w-[200px] max-[350px]:max-w-[250px] max-w-[750px] min-h-[500px] max-h-[520px]">
          <h2 class="text-2xl text-teal font-poppins font-semibold mb-4 border-b border-teal">Akun admin</h2>
          <form @submit.prevent="createadmin">
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Nama Lengkap</label>
              <input type="text" v-model="form.full_name" placeholder="Masukkan Nama Lengkap"
                class="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Username</label>
              <input type="text" v-model="form.username" placeholder="Masukkan Username"
                class="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required />
              <p v-if="formErrors.username" class="text-red text-sm mt-1">{{ formErrors.username }}</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Password</label>
              <input type="password" v-model="form.password" placeholder="Masukkan password"
                class="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required />
              <p v-if="formErrors.password" class="text-red text-sm mt-1">{{ formErrors.password }}</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-teal">Roles</label>
              <select v-model="form.superAdmin"
                class="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required>
                <option value="">Select Role</option>
                <option value="true">Super Admin</option>
                <option value="false">Admin</option>
              </select>
              <p v-if="formErrors.superAdmin" class="text-red text-sm mt-1">{{ formErrors.superAdmin }}</p>
            </div>
            <div class="flex justify-center gap-2 border-t pt-2 border-teal">
              <button type="submit" class="px-8 py-2 bg-teal text-white rounded-md">Simpan</button>
              <button @click="toggleModalCreateAdmin" type="button"
                class="mr-4 px-8 py-2 bg-white border border-teal text-teal rounded-md">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
