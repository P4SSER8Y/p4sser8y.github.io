<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useViewConfigStore } from 'src/stores/viewConfig';
import { storeToRefs } from 'pinia';

const viewConfig = storeToRefs(useViewConfigStore());
const router = useRouter();

onMounted(() => {
    let page = viewConfig.lastPage.value.length > 0 ? viewConfig.lastPage.value : 'posterWall';
    router.push(`/${page}`);
});
</script>
