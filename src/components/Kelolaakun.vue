<script>
import Sidebar from "./Sidebar.vue"

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      akunadmin: [
        {no: 1, name: "Jane Cooper", email: "ABIB@gmail.com" , status: "Aktif"},
        {no: 2, name: "John Price", email: "John@gmail.com" , status: "Aktif"},
        {no: 3, name: "Jane Basnuril", email: "Basnuril@gmail.com" , status: "Aktif"},
      ]
    }
  }

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
              <th scope="col"
                class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                NO
              </th>
              <th scope="col"
                class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                Nama Lengkap
              </th>
              <th scope="col"
                class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                Email
              </th>
              <th scope="col"
                class="px-6 py-3 text-left font-normal font-gotham text-black text-base">
                Status
              </th>
              <!-- <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500">
                Email
              </th> -->
              <th scope="col" class="">
                <button
                  class="bg-orange px-2 py-1 text-left font-gotham text-black text-base">+</button>
              </th>
            </tr>
          </thead>

          <tbody v-for="data in akunadmin" class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap font-gotham font-normal text-black text-base">
                {{ data.no }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                  <div class="">
                    <div class="font-gotham font-normal text-black text-base">
                      {{ data.name }}
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
                  {{ data.status }}
                </span>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Admin
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                jane.cooper@example.com
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button href="#"
                  class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Edit</button>
                <button href="#"
                  class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
              </td>
            </tr>




          <!-- More rows... -->

        </tbody>
      </table>
    </div>
  </div>

</div></template>
