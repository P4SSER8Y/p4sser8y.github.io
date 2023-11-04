<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const user = ref("");
const log = ref("");
const token = ref("");

async function register() {
  let url =`/.netlify/functions/gate-oi/?user=${user.value}`; 
  let resp = await fetch(url);
  let attResp = await startRegistration(await resp.json());
  let verificationResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attResp),
  });
  
  const result = await verificationResp.json();
  if (result && result.verified) {
    log.value = "=> registered";
  }
  console.log(result);
}

async function auth() {
  let url = `/.netlify/functions/gate-knock?user=${user.value}`;
  const resp = await fetch(url);
  const asseResp = await startAuthentication(await resp.json());
  const verificationResp = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asseResp),
  })
  const result = await verificationResp.json();
  // if (result && result.verified) {
  //   log.value = JSON.stringify(result);
  // }
  console.log(result);
  token.value = result.token;
}

async function validate() {
  axios.post('/.netlify/functions/gate-home', token.value).then(() => log.value = 'at home').catch(() => log.value = 'outdoors');
}

</script>

<template>
  <div>
    <input v-model="user">
  </div>
  <button type="button" @click="register"> Register </button>
  <button type="button" @click="auth"> Auth </button>
  <button type="button" @click="validate"> Home </button>
  <div>
    {{ log }}
  </div>
</template>

<style scoped></style>
