<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{ user?: string }>();

onMounted(() => {
    router.push(`/posterWall`);
});
</script>
