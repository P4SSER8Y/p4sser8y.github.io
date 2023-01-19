<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-input borderless v-model="title" label="title"> </q-input>
            </q-card-section>
            <q-card-section horizontal>
                <q-uploader accept="image/*" label="Cover" flat color="dark">
                </q-uploader>
                <q-card-section>
                    <q-card-section>
                        <q-input
                            v-model="chineseTitle"
                            label="Chinese"
                        ></q-input>
                    </q-card-section>
                    <q-separator />
                    <q-rating
                        v-model="rate"
                        max="5"
                        color="red"
                        icon="favorite_border"
                        icon-selected="favorite"
                        no-dimming
                    ></q-rating>
                    <q-input v-model="date" :rule="['date']">
                        <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy
                                    cover
                                    transition-show="scale"
                                    transition-hide="scale"
                                >
                                    <q-date
                                        v-model="date"
                                        mask="YYYY-MM-DD"
                                        minimal
                                        today-btn
                                    >
                                        <div
                                            class="row items-center justify-end"
                                        >
                                            <q-btn
                                                v-close-popup
                                                label="Close"
                                                color="primary"
                                                flat
                                            />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    <q-card-section>
                        <q-input
                            v-model="comment"
                            label="comment"
                            autogrow
                        ></q-input>
                    </q-card-section>
                </q-card-section>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="positive" label="OK" @click="onOKClicked" />
                <q-btn
                    color="negative"
                    label="Cancel"
                    @click="onCancelClicked"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import dayjs from 'dayjs';

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
    useDialogPluginComponent();

const title = ref('');
const chineseTitle = ref('');
const comment = ref('');
const rate = ref(0);
const date = ref(dayjs().format('YYYY-MM-DD'));

function onOKClicked() {
    onDialogOK();
}

function onCancelClicked() {
    onDialogCancel();
}
</script>
