<script setup>
import { message } from "ant-design-vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../supabaseClient";
import HeaderComponent from "../../components/HeaderComponent.vue";
import {
  FetchTodo,
  FetchPage,
  SearchText,
  UpdateTodo,
  AddTodo,
  DeleteTodo,
} from "./api";
const layout = {
  labelCol: { span: 16 },
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
const todo_id = ref("");
const todoList = ref([]);
const completedInput = ref(false);
const searchInput = ref("");
const todoInfo = ref("");
const current = ref(1);
const completed = ref(false);
const total = ref(0);
const start = ref(0);
const end = ref(9);
const onFinishSearch = () => {
  SearchText({
    todoInfo: searchInput.value,
    completed:completedInput.value,
  })
    .then((res) => {
      start.value = 0;
      end.value = 9;
      todoList.value = res;
    })
    .catch((err) => {
      message.error(err);
    });
};
const handleOk = async () => {
  const { data:{session}, error } = await supabase.auth.getSession()
  if (addModel.value) {
    AddTodo({
      todo: todoInfo.value,
      completed:completed.value,
      user_id: session.user.id
    })
      .then((res) => {
        getTodoList(start.value, end.value);
        visible.value = false;
        addModel.value = false;
        todoInfo.value = "";
        message.success("添加成功！");
      })
      .catch((err) => {
        message.error(err);
      });
  } else if (editModel.value) {
    UpdateTodo(
      {
        todo: todoInfo.value,
        completed:completed.value
      },
      todo_id.value
    )
      .then((res) => {
        getTodoList(start.value, end.value);
        visible.value = false;
        editModel.value = false;
        todoInfo.value = "";
        message.success("修改成功！");
      })
      .catch((err) => {
        message.error(err);
      });
  }
};

function edit(item) {
  todoInfo.value = item.todo;
  completed.value = item.completed;
  visible.value = true;
  editModel.value = true;
  todo_id.value = item.id;
}
const del = (id) => {
  DeleteTodo(id)
    .then((res) => {
      getTodoList(start.value, end.value);
    })
    .catch((err) => {
      message.error(err);
    });
};
const getTodoList = (start, end) => {
  FetchPage(start, end)
    .then((res) => {
      todoList.value = res;
    })
    .catch((err) => {
      message.error(err);
    });
};
const allCount = () => {
  FetchTodo()
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
  searchInput.value = "";
  getTodoList(start, end);
};
// 获取列表
onMounted(() => {
  getTodoList(start, end);
  allCount();
});
watch(current, () => {
  start.value = current.value * 10 - 10;
  end.value = current.value * 10 - 1;
  getTodoList(current.value * 10 - 10, current.value * 10 - 1);
});
const validateMessages = {
  required: "${label} is required!",
};
const columns = [
  {
    title: "待办事项",
    dataIndex: "todo",
    key: "todo",
  },
  {
    title: "是否完成",
    dataIndex: "completed",
    key: "completed",
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
  <a-layout class="min-h-screen">
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
            <a-form-item name="searchInput" label="待办事项">
              <a-input v-model:value="searchInput" autocomplete="off" />
            </a-form-item>
            <a-form-item name="completedInput" label="是否完成">
              <a-switch v-model:checked="completedInput" />
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
          <a-table :columns="columns" :pagination="false" :dataSource="todoList">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'completed'">
                <span>
                  <a-tag
                    :key="tag"
                    :color="record.completed === true ? 'geekblue'  : 'green'"
                  >
                    {{ record.completed === true ? '完成'  : '未完成' }}
                  </a-tag>
                </span>
              </template>
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
            待办事项 :
          </label>
          <a-input
            autocomplete="off"
            className="w-full px-3 py-2 border rounded-md w-9/12"
            id="name"
            type="text"
            v-model:value="todoInfo"
            required
          />
        </div>
        <div className="mb-5 flex items-end">
          <label className="block font-bold mb-2 w-1/6" htmlFor="name">
            是否完成 :
          </label>
          <a-switch v-model:checked="completed" />
        </div>
      </a-modal>
    </a-space>
  </a-layout>
</template>
