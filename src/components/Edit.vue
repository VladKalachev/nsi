<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <!-- Logo -->
      <!-- Menu -->
      <Menu></Menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
      </a-layout-header>

      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <!-- EDIT FORM -->

        <a-spin v-if="!loading"/>
        <a-form :form="form" @submit="handleSubmit" v-if="loading">
          <a-row>
            <a-col :span="24">
              <h2 class="b-title b-left">Редактирование справочника</h2>
            </a-col>
            <a-col :span="24">
              <p class="b-p b-left">Описание справочника</p>
            </a-col>

            <!-- Ник справочника -->
            <a-form-item v-bind="formItemLayout" label="Ник справочника">
              <a-input
                class="b-title-input"
                :disabled="page !== 'SYSTEM'"
                v-decorator="['nick',
              { rules: [{ required: true, message: 'Поле обязательное для ввода',
              }], initialValue: field['nick'] ? field['nick'] : ''}]"
              />
            </a-form-item>

            <!-- Наименование справочник -->
            <a-form-item v-bind="formItemLayout" label="Наименование справочника">
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: 'Поле обязательное для ввода' }], initialValue: field['name'] ? field['name'] : '' }]"
              />
            </a-form-item>

            <!-- Тип справочника -->
            <a-form-item class="b-left-item" v-bind="formItemLayout" label="Тип справочника">
              <a-radio-group
                v-decorator="['type',{ rules: [{ required: true, message: 'Поле обязательное для ввода' }], initialValue: field['hierarchyDict'] ? field['hierarchyDict'] : 0 }]"
              >
                <a-radio :value="0">Плоский</a-radio>
                <a-radio :value="1">Иерархический</a-radio>
              </a-radio-group>
            </a-form-item>

            <!-- Не переносить -->
            <a-form-item class="b-left-item" v-bind="formItemLayout" label="Не переносить">
              <a-radio-group
                v-decorator="['def', { rules: [{ required: true, message: 'Поле обязательное для ввода' }] , initialValue: field['transfer'] ? field['transfer'] : 0 }]"
              >
                <a-radio :value="1">Да</a-radio>
                <a-radio :value="0">Нет</a-radio>
              </a-radio-group>
            </a-form-item>

            <!-- Статус -->
            <a-form-item class="b-left-item" v-bind="formItemLayout" label="Статус">
              <a-radio-group
                v-decorator="['status', { rules: [{ required: true, message: 'Поле обязательное для ввода' }] , initialValue: field['deleted'] ? field['deleted'] : 0  }]"
              >
                <a-radio :value="0">Используется</a-radio>
                <a-radio :value="1">Удален</a-radio>
              </a-radio-group>
            </a-form-item>

            <!-- Наименование системы -->
            <a-form-item v-bind="formItemLayout" label="Наименование системы">
              <a-input
                v-decorator="['sysName', {initialValue: field['sysName'] ? field['sysName'] : '' }]"
              />
            </a-form-item>

            <!-- Комментарий -->
            <a-form-item v-bind="formItemLayout" label="Комментарий">
              <a-input v-decorator="['note', { initialValue: field['note'] ? field['note'] : ''}]"/>
            </a-form-item>

            <a-col :span="24">
              <p class="b-p b-left">Атрибуты справочника</p>
              <table class="table">
                <thead>
                  <tr>
                    <th>Ник</th>
                    <th>Наименование</th>
                    <th>Тип данных</th>
                    <th>Ссылка</th>
                    <th>Обязательный</th>
                    <th>Уникальный</th>
                    <th>Множественный</th>
                    <th>Удален</th>
                    <th>Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i" v-for="(item, i) in table">
                    <!-- Ник -->
                    <td width="10%">
                      <a-input disabled :value="item.id.nick"/>
                    </td>

                    <!-- Наименование -->
                    <td width="10%">
                      <a-input :value="item.name"/>
                    </td>

                    <!-- Тип данных -->
                    <td width="10%">
                      <a-input disabled :value="item.typeAttr"/>
                    </td>

                    <!-- Ссылка -->
                    <td width="10%">
                      <a-input :value="item.nickDictLink"/>
                    </td>

                    <!-- Обязательный -->
                    <td width="10%">
                      <a-select :defaultValue="item.required">
                        <a-select-option :value="1">Да</a-select-option>
                        <a-select-option :value="0">Нет</a-select-option>
                      </a-select>
                    </td>

                    <!-- Уникальный	 -->
                    <td width="10%">
                      <a-select :defaultValue="item.unique">
                        <a-select-option :value="1">Да</a-select-option>
                        <a-select-option :value="0">Нет</a-select-option>
                      </a-select>
                    </td>

                    <!-- Множественный -->
                    <td width="10%">
                      <a-select :defaultValue="item.arrayAttr">
                        <a-select-option :value="1">Да</a-select-option>
                        <a-select-option :value="0">Нет</a-select-option>
                      </a-select>
                    </td>

                    <!-- Удален -->
                    <td width="10%">
                      <a-select :defaultValue="item.deleted">
                        <a-select-option :value="1">Да</a-select-option>
                        <a-select-option :value="0">Нет</a-select-option>
                      </a-select>
                    </td>

                    <!-- Комментарий -->
                    <td width="10%">
                      <a-input :value="item.nickDictLink"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-col>
      
            <a-col :span="24">
              <a-button type="primary" html-type="submit">Сохранить</a-button>
              <router-link to="/" class="close">
                <a-button>Отмена</a-button>
              </router-link>
            </a-col>
          </a-row>
        </a-form>
        <!-- END EDIT FORM -->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Menu from "./Menu";
import axios from "axios";
export default {
  name: "Edit",
  components: {
    Menu
  },
  data() {
    return {
      field: {},
      page: "",
      table: [],
      loading: false,
      collapsed: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 11 }
        }
      },
      url: {
        dict: "http://localhost:3000/dict?nick="
      }
    };
  },
  created() {
    console.log(this.$route.params, this.name);
    let th = this;
    this.page = this.$route.params.name;
    axios.get(this.url.dict + this.page).then(res => {
      console.log(res.data);
      this.field = res.data[0] ? res.data[0]: {};
      this.table = res.data[0] ? res.data[0].nsiMetaAttrs : [];

      console.log(111, this.table);
      this.loading = true;
    });
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.$message.success("Данные успешно сохранены!");
          this.$router.push({ name: "Layout" });
        }
      });
    }
  }
};
</script>




<style>
.table thead {
  padding-bottom: 10px;
  border-bottom: 1px solid #000;
}
.table th {
  padding-bottom: 10px;
}

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}

table {
  background-color: transparent;
}

.b-left {
  text-align: left;
  display: inherit;
}

.b-rith {
  text-align: right;
  display: inherit;
}
.b-title-input {
  color: #000;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  float: left;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.b-p {
  font-size: 15px;
  font-weight: 600;
  color: #000;
}

#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}

.b-left-item .ant-form-item-control {
  text-align: left;
}

.close {
  margin-left: 10px;
}
</style>