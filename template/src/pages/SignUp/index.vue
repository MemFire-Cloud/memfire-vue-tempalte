<script setup>
import { message } from 'ant-design-vue';
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { supabase } from "../../supabaseClient";
import { SignUp } from "./api";
 const router = useRouter()
const loading = ref(false);
const password = ref("");
const email = ref("");
const handleSinUp = (event) => {
  event.preventDefault();
  loading.value = true;
  SignUp(email.value,password.value )
    .then((res) => {
      router.push({
        name: "/"
      });
    })
    .catch((err) => {
      message.error(err);
    });
  loading.value = false;
};
</script>

<template>
  <div className="flex justify-center items-center h-screen">
    <form
      className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      @submit="handleSinUp"
    >
      <h2 className="text-2xl font-bold mb-6">注册</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
          邮箱
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Email"
          v-model="email"
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="password"
        >
          密码
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          :disabled="loading"
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          注册
        </button>
        <a
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          href=""
        >
          去登录
        </a>
      </div>
    </form>
  </div>
</template>