<script setup>
import { ref } from 'vue'
import { supabase } from '../supabaseClient'

const loading = ref(false)
const email = ref('')
const password = ref('')
const iflogin = ref(true)
const setIflogin = (flag)=>{
  iflogin.value = flag;
}
const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password:password.value
    })
    if (error) throw error
    alert('登录成功!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
const handleSinUp = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password:password.value
    })
    if (error) throw error
    alert('注册成功，系统自动帮您登录')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row flex-center flex" >
    <!-- 使用魔法链接方式登录 -->
    <!-- <div class="col-6 form-widget">
      <h1 class="header">MemFire Cloud + Vue 3</h1>
      <p class="description">通过发送魔法链接至您的电子邮件来完成登录</p>
      <div>
        <input class="inputField" required type="email" placeholder="请输入邮箱" v-model="email" />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : '发送魔法链接'"
          :disabled="loading"
        />
      </div>
    </div> -->
<!-- 邮箱和密码方式登录注册 -->
<div class="col-6 form-widget">
      <h1 class="header">MemFire Cloud + Vue 3</h1>
      <!-- <p class="description">通过发送魔法链接至您的电子邮件来完成登录</p> -->
      <div class='border'>
        <div class='flex'>
          <h3 class="tab" :class="{ 'active-color': iflogin }" @click="setIflogin(true)">登录</h3>
          <h3 class="tab" :class="{ 'active-color': !iflogin }" @click="setIflogin(false)">注册</h3>
        </div>
      
      <form v-if="iflogin" @submit.prevent="handleLogin">
      <div class="mt20">
        <input class="inputField" required type="email" placeholder="请输入邮箱" v-model="email" />
      </div>
      <div class="mt20">
        <input class="inputField" required type="password" placeholder="请输入密码" v-model="password" />
      </div>
      <div class="mt20">
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : '登录'"
          :disabled="loading"
        />
      </div>
      </form>
      <form v-else @submit.prevent="handleSinUp">
        <div class="mt20">
        <input class="inputField" required type="email" placeholder="请输入邮箱" v-model="email" />
      </div>
      <div class="mt20">
        <input class="inputField" required type="password" placeholder="请输入密码" v-model="password" />
      </div>
      <div class="mt20">
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : '注册'"
          :disabled="loading"
        />
      </div>
      </form>
    </div>
    </div>
  </div>
</template>
