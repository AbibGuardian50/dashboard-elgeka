<template>
    <div>
        <!-- Tampilkan data API di sini -->
        <h2>{{ data.title }}</h2>
        <p>{{ data.content }}</p>
    </div>
</template>

<script>
export default {
    props: {
        data: { // Terima properti data dari parent component
            type: Object,
            required: true
        }
    }
};
</script>