<script lang="ts" setup>

</script>

<template>
    <button 
        class="flex items-center justify-center w-10 h-10 rounded-full 
                       bg-white/60 hover:bg-white text-blue-600/60 hover:text-blue-600
                       border border-white/10 hover:border-white/20
                       shadow-sm hover:shadow-md transition-all duration-200"
    >
        <span class="text-xl">
            <slot></slot>
        </span>
    </button>
</template>