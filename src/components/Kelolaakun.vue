<script>
import Sidebar from "./Sidebar.vue"

export default {
  components: {
    Sidebar
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
        <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1000px]">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-gotham text-black text-[16px] uppercase font-normal">
                NO
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-gotham text-black text-[16px] uppercase font-normal">
                Nama Lengkap
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-gotham text-black text-[16px] uppercase font-normal">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-gotham text-black text-[16px] uppercase font-normal">
                Status
              </th>
              <!-- <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-normal">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-normal">
                Email
              </th> -->
              <th scope="col" class="">
                <button class="bg-orange px-2 py-1 text-left text-xs font-gotham text-black text-[16px] uppercase font-normal ml-24">+</button>
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                1
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                  <div class="">
                    <div class="text-sm font-medium text-gray-900">
                      Jane Cooper
                    </div>
                    <!-- <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Abib@gmail.com</div>
                
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Aktif
                </span>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Admin
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                jane.cooper@example.com
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button href="#" class="py-1 px-8 rounded-[5px] bg-orange text-indigo-600 hover:text-indigo-900">Edit</button>
                <button href="#" class="py-1 px-8 rounded-[5px] bg-orange ml-2 text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>



            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                2
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                  <div class="">
                    <div class="text-sm font-medium text-gray-900">
                      Jane Cooper
                    </div>
                    <!-- <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Abib@gmail.com</div>
                
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Aktif
                </span>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Admin
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                jane.cooper@example.com
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button href="#" class="py-1 px-8 rounded-[5px] bg-orange text-indigo-600 hover:text-indigo-900">Edit</button>
                <button href="#" class="py-1 px-8 rounded-[5px] bg-orange ml-2 text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>



            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                3
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                  <div class="">
                    <div class="text-sm font-medium text-gray-900">
                      Jane Cooper
                    </div>
                    <!-- <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Abib@gmail.com</div>
                
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Aktif
                </span>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Admin
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                jane.cooper@example.com
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button href="#" class="py-1 rounded-[5px] px-8 bg-orange text-indigo-600 hover:text-indigo-900">Edit</button>
                <button href="#" class="py-1 rounded-[5px] px-8 bg-orange ml-2 text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>



            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                4
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                  <div class="">
                    <div class="text-sm font-medium text-gray-900">
                      Jane Cooper
                    </div>
                    <!-- <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Abib@gmail.com</div>
                
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Aktif
                </span>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Admin
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                jane.cooper@example.com
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button href="#" class="py-1 px-8 rounded-[5px] bg-orange text-indigo-600 hover:text-indigo-900">Edit</button>
                <button href="#" class="py-1 px-8 rounded-[5px] bg-orange ml-2 text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>




            <!-- More rows... -->

          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
