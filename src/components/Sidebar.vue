<script>

</script>

<template>
    <div class="flex">
        <div class="bg-orange flex flex-col items-center pt-8 w-[310px] h-screen">
            <img class="bg-white mb-8 rounded-md" src="../assets/logo.png" alt="">
            <form action="" class="relative w-max flex flex-row-reverse bg-white rounded-md pl-4 mb-4">
                <input type="search" placeholder="Quick Find"
                    class="peer cursor-pointer relative z-10 h-12 w-12 rounded-md bg-transparent pl-4 outline-none w-full cursor-text pr-4" />
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-black px-3.5 peer-border-lime-300 peer-stroke-lime-500"
                    fill="black" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </form>

            <div class="flex flex-col items-start mr-32">
                <p class="text-left font-gotham font-semibold italic text-white mr-12">General</p>
            </div>



            <div class="flex flex-col gap-2 pt-4">
                <router-link to="/kelolaakun">
                    <p class="font-gotham font-bold text-white opacity-70">Kelola Akun</p>
                </router-link>
                <router-link to="/verifikasicerita">
                    <p class="font-gotham font-bold text-white opacity-70">Verifikasi Cerita</p>
                </router-link>
                <router-link to="/komunitas">
                    <p class="font-gotham font-bold text-white opacity-70">Komunitas</p>
                </router-link>
                <router-link to="/quotes">
                    <p class="font-gotham font-bold text-white opacity-70">Quotes</p>
                </router-link>
                <router-link to="/informasicml">
                    <p class="font-gotham font-bold text-white opacity-70">Informasi CML</p>
                </router-link>
                <router-link to="/donasi">
                    <p class="font-gotham font-bold text-white opacity-70">Donasi</p>
                </router-link>
            </div>


    </div>
</div></template>