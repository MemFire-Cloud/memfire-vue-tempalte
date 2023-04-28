<script setup>
import { message } from "ant-design-vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from "../../components/HeaderComponent.vue";
import {
  FetchCount,
  FetchPage,
  SearchText,
  UpdateAccount,
  AddAccount,
  DeleteAccount,
} from "./api";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  offset: { span: 8 },
  wrapperCol: { span: 16 },
};
const router = useRouter();
const visible = ref(false);
const addModel = ref(false);
const editModel = ref(false);
const accountId = ref("");
const account = ref([]);
const usernameInput = ref("");
const emailInput = ref("");
const addressInput = ref("");
const username = ref("");
const current = ref(1);
const email = ref("");
const total = ref(0);
const age = ref("");
const address = ref("");
const start = ref(0);
const end = ref(9);
const onFinishSearch = () => {
  SearchText({
    username: usernameInput.value,
    email: emailInput.value,
    address: addressInput.value,
  })
    .then((res) => {
      start.value = 0;
      end.value = 9;
      account.value = res;
    })
    .catch((err) => {
      message.error(err);
    });
};
const handleOk = () => {
  if (addModel.value) {
    AddAccount({
      user_name: username.value,
      email: email.value,
      age: age.value,
      address: address.value,
    })
      .then((res) => {
        getUserList(start.value, end.value);
        visible.value = false;
        addModel.value = false;
        username.value = "";
        email.value = "";
        address.value = "";
        age.value = "";
        message.success("添加成功！");
      })
      .catch((err) => {
        message.error(err);
      });
  } else if (editModel.value) {
    UpdateAccount(
      {
        user_name: username.value,
        email: email.value,
        age: age.value,
        address: address.value,
      },
      accountId.value
    )
      .then((res) => {
        getUserList(start.value, end.value);
        visible.value = false;
        editModel.value = false;
        username.value = "";
        email.value = "";
        address.value = "";
        age.value = "";
        message.success("修改成功！");
      })
      .catch((err) => {
        message.error(err);
      });
  }
};

function edit(item) {
  email.value = item.email;
  username.value = item.user_name;
  address.value = item.address;
  age.value = item.age;
  visible.value = true;
  editModel.value = true;
  accountId.value = item.id;
}
const del = (id) => {
  DeleteAccount(id)
    .then((res) => {
      getUserList(start.value, end.value);
    })
    .catch((err) => {
      message.error(err);
    });
};
const getUserList = (start, end) => {
  FetchPage(start, end)
    .then((res) => {
      account.value = res;
    })
    .catch((err) => {
      message.error(err);
    });
};
const allCount = () => {
  FetchCount()
    .then((res) => {
      total.value = res;
    })
    .catch((err) => {
      message.error(err);
    });
};
const onShowSizeChange = (current) => {
  current.value = current;
};
const setAddModel = () => {
  visible.value = true;
  addModel.value = true;
};
const reset = () => {
  usernameInput.value = "";
  usernameInput.value = "";
  usernameInput.value = "";
};
// 获取列表
onMounted(() => {
  getUserList(start, end);
  allCount();
});
watch(current, () => {
  start.value = current.value * 10 - 10;
  end.value = current.value * 10 - 1;
  getUserList(current.value * 10 - 10, current.value * 10 - 1);
});
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
const columns = [
  {
    title: "名称",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];
</script>

<template>
  <a-layout>
    <HeaderComponent :type="1" />
    <a-space
      direction="vertical"
      style="width: 100%; padding: 0 100px"
      size="48"
    >
      <a-layout>
        <a-space className="mt-10 mb-10">
          <a-form
            v-bind="layout"
            layout="inline"
            name="nest-messages"
            @submit="onFinishSearch"
            :validateMessages="validateMessages"
          >
            <a-form-item name="username" label="名称">
              <a-input v-model:value="usernameInput" autocomplete="off" />
            </a-form-item>
            <a-form-item name="email" label="邮箱">
              <a-input v-model:value="emailInput" autocomplete="off" />
            </a-form-item>
            <a-form-item name="address" label="地址">
              <a-input v-model:value="addressInput" autocomplete="off" />
            </a-form-item>
            <a-form-item v-bind="formTailLayout">
              <a-button type="default" htmlType="submit"> 查询 </a-button>
            </a-form-item>
            <a-form-item v-bind="formTailLayout">
              <a-button @click="reset" type="default" htmlType="reset">
                重置
              </a-button>
            </a-form-item>
            <a-form-item v-bind="formTailLayout">
              <a-button @click="setAddModel" type="default"> 添加 </a-button>
            </a-form-item>
          </a-form>
        </a-space>
        <a-content>
          <a-table :columns="columns" :pagination="false" :dataSource="account">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <div class="editable-row-operations">
                  <a-space size="middle">
                    <a-popconfirm title="确认删除？" @confirm="del(record.id)">
                      <a-button danger>删除</a-button>
                    </a-popconfirm>
                    <a-button @click="edit(record)"> 编辑 </a-button>
                  </a-space>
                </div>
              </template>
            </template>
          </a-table>
          <a-pagination
            className="mt-10 mb-10"
            v-model:current="current"
            :total="total"
            @showSizeChange="onShowSizeChange"
          />
        </a-content>
      </a-layout>

      <a-modal
        :title="addModel ? '新增' : '编辑'"
        v-model:visible="visible"
        @ok="handleOk"
      >
        <div className="mb-5 flex items-end mt-10">
          <label className="block font-bold mb-2 w-1/6" htmlFor="name">
            名 称 :
          </label>
          <a-input
            autocomplete="off"
            className="w-full px-3 py-2 border rounded-md w-9/12"
            id="name"
            type="text"
            v-model:value="username"
            required
          />
        </div>
        <div className="mb-5 flex items-end">
          <label className="block font-bold mb-2 w-1/6" htmlFor="name">
            邮 箱 :
          </label>
          <a-input
            autocomplete="off"
            className="w-full px-3 py-2 border rounded-md w-9/12"
            type="text"
            v-model:value="email"
            required
          />
        </div>
        <div className="mb-5 flex items-end">
          <label className="block font-bold mb-2 w-1/6" htmlFor="name">
            年 龄 :
          </label>
          <a-input
            autocomplete="off"
            className="w-full px-3 py-2 border rounded-md w-9/12"
            type="number"
            v-model:value="age"
            required
          />
        </div>
        <div className="mb-5 flex items-end">
          <label className="block font-bold mb-2 w-1/6" htmlFor="name">
            地 址 :
          </label>
          <a-input
            autocomplete="off"
            className="w-full px-3 py-2 border rounded-md w-9/12"
            type="text"
            v-model:value="address"
            required
          />
        </div>
      </a-modal>
    </a-space>
  </a-layout>
</template>