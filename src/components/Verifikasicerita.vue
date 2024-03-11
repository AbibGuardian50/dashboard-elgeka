<script>
import Sidebar from "./Sidebar.vue"

export default {
    components: {
        Sidebar
    },
    // data() {
    //     return {
    //         verifikasicerita: [
    //         {}
    //         ]
    //     }
    // }
}
</script>

<template>
    <div class="flex ">
        <Sidebar />

        <div class="px-8">
            <p class="font-gotham font-bold text-[30px] text-sulfurblack">Verifikasi Cerita</p>
            <hr class="border-[#D0D5DD]">
            <p class="my-4 font-gotham font-normal text-[20px] text-sulfurblack">Cerita User</p>

            <div>
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Nomor
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Tanggal
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Nama
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Media
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left font-gotham text-black text-base w-[300px] font-normal">
                                Cerita
                            </th>
                            <th scope="col" class="px-6 py-3 text-left font-gotham text-black text-base font-normal">
                                Status
                            </th>
                            <!-- <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500 font-normal">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left font-medium text-gray-500 font-normal">
                Email
              </th> -->
                            <th scope="col" class="">
                                <button
                                    class="bg-orange px-2 py-1 text-left font-gotham text-black text-base font-normal ml-24">+</button>
                            </th>
                        </tr>
                    </thead>

                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-base text-black">
                                1
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-base text-black">
                                12/12/22
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="">
                  </div> -->
                                    <div class="">
                                        <div class="text-base font-medium text-gray-900">
                                            Lorem
                                        </div>
                                        <!-- <div class="text-base text-gray-500">
                      jane.cooper@example.com
                    </div> -->
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap  text-base font-medium">
                                <button href="#"
                                    class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Lihat</button>
                            </td>
                            <td class="px-6 py-4 max-w-[300px   ]">
                                <p class="text-base text-gray-900">Lorem ipsum dolor sit amet consectetur. Commodo
                                    adipiscing massa et sem. Neque elementum non facilisi eget. Eget quis et tortor cras
                                    sed. Nec vulputate neque non mi.</p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="px-2 py-1 inline-flex text-base text-black leading-5 font-semibold rounded-md bg-[#ff8133]">
                                    Pending
                                </span>
                            </td>
                            <!-- <td class="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                Admin
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                jane.cooper@example.com
              </td> -->
                            <td class="px-6 py-4 whitespace-nowrap  text-base font-medium">
                                <button href="#"
                                    class="py-1 px-8 rounded-[5px] bg-orange font-inter font-bold text-base text-white">Setuju</button>
                                <button href="#"
                                    class="py-1 px-8 rounded-[5px] bg-[#ff4c61] ml-2 font-inter font-bold text-base text-white">Hapus</button>
                            </td>
                        </tr>




                        <!-- More rows... -->

                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>
