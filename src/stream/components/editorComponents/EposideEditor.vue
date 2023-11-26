<template>
    <q-card class="q-m-md bordered">
        <q-card-section v-if="props.description.label">
            {{ props.description.label }}
        </q-card-section>
        <q-card-section>
            <q-markup-table bordered flat>
                <thead>
                    <th>eposide</th>
                    <th>timestamp</th>
                </thead>
                <tbody>
                    <tr v-for="item, index in props.data">
                        <td class="text-center">
                            {{ item.timestamp }}
                            <q-popup-edit v-model="props.data[index].timestamp" auto-save v-slot="scope">
                                <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set"></q-input>
                            </q-popup-edit>
                        </td>
                        <td class="text-center">
                            {{ item.eposide }}
                            <q-popup-edit v-model="props.data[index].eposide" auto-save v-slot="scope">
                                <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set"></q-input>
                            </q-popup-edit>
                        </td>
                    </tr>
                </tbody>
            </q-markup-table>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { ObjectType } from './editorDefinitions';
const props = defineProps<{ data: any, description: ObjectType }>();
</script>
