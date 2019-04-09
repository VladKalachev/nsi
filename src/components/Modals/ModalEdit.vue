<template>
  <div>
    <a>
      <a-icon @click="showModal" type="edit"/>
    </a>
    <a-modal
      :destroyOnClose="true"
      v-model="visible"
      title="Редактирование элемента"
      onOk="handleOk"
      width="900px"
    >
      <a-form :form="form">
        <a-row v-bind:key="index" v-for="(value, key, index) in fields">
          <a-col :span="24">
            <!-- input -->

            <!-- Type -->
            <!-- {{value.typeAttr}} -->
            <!--   v-if="value.typeAttr == 'string'" -->
            <a-form-item
              v-if="value.typeAttr == 'string' && value.nick != 'group'"
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <a-textarea
                v-decorator="[value.nick, { rules: [{ required: value.required, message: `Поле ${value.nick} обязательное для ввода` }], initialValue: field[value.nick] }]"
                :placeholder="`${value.name} '${value.nick}'`"
                autosize
              />
            </a-form-item>

            <!-- disabled -->
            <a-form-item
              v-if="value.typeAttr == 'boolean'"
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <a-radio-group
                name="radioGroup"
                v-decorator="[value.nick, { rules: [{ required: value.required, message: `Поле ${value.nick} обязательное для ввода` }], initialValue: field[value.nick] == true ? field[value.nick] : field[value.nick] == '' ? field[value.nick] : '' }]"
              >
                <a-radio :value="true">Да</a-radio>
                <a-radio :value="false">Нет</a-radio>
                <a-radio :value="''">Отсутствует</a-radio>
              </a-radio-group>
            </a-form-item>

            <!-- directory -->
            <a-form-item
              v-if="value.typeAttr == 'link'"
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <select
                class="ant-select ant-select-enabled ant-select-selection ant-select-selection--single select-mod"
                v-decorator="[value.nick, { rules: [{ required: value.required, message: `Поле ${value.nick} обязательное для ввода` }], initialValue: field[value.nick] ? getDirectory(field[value.nick].dict)[0] : null }]"
              >
                <option
                  class="ant-select-selection__rendered"
                  v-for="(value, key) in getDirectory(formData[field[value.nick].dict.nick] ? formData[field[value.nick].dict.nick] : null )"
                  v-bind:key="key"
                  v-bind:value="value"
                >{{value}}</option>
              </select>
            </a-form-item>

            <!-- groups -->
            <!-- v-if="value.nick == 'group'" -->
            <!--   v-if="value.typeAttr == 'boolean'" -->
            <a-form-item
              v-if="value.nick == 'group' && value.typeAttr == 'string'"
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <a-input
                v-for="(value, key) in field[value.nick]"
                :key="key"
                :value="value"
                v-decorator="[value.nick, { rules: [{ required: value.required, message: `Поле ${value.nick} обязательное для ввода` }], initialValue: value }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item v-bind="formItemLayout" label="Сортировочное значение элемента">
              <a-input
                v-decorator="['sortValue', { rules: [{ required: false }], initialValue: field['sortValue']  }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="show">
          <hr>
          <h3>Системные данные</h3>
          <a-col>
            <a-form-item v-bind="formItemLayout" label="ID элемента">{{field["id"]}}</a-form-item>
            <a-form-item
              v-bind="formItemLayout"
              label="ID родительского элемента"
            >{{field["parentId"]}}</a-form-item>
            <a-form-item
              v-bind="formItemLayout"
              label="Дата создания / изменения элемента"
            >{{field["dateCreate"]}}</a-form-item>
            <a-form-item
              v-bind="formItemLayout"
              label="Признак удаления элемента"
            >{{field["deleted"]}}</a-form-item>
            <a-form-item
              v-bind="formItemLayout"
              label="Дата удаления элемента"
            >{{field["dateDeleted"]}}</a-form-item>
            <a-form-item v-bind="formItemLayout" label="Комментарий">
              <a-input v-decorator="['comment', {  initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Сохранить</a-button>
        <a-button @click="handleShow">
          <a-icon type="setting"/>
        </a-button>
        <a-button @click="handleDelete">
          <a-icon type="delete"/>
        </a-button>
        <a-button key="back" @click="handleCancel">Отмена</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
import { setTimeout } from "timers";
import * as R from "ramda";

export default {
  name: "ModalEdit",
  props: ["modal", "field"],
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      fields: [],
      loading: false,
      visible: false,
      show: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 26 },
          sm: { span: 10 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      },
      formData: {}
    };
  },
  mounted() {},
  methods: {
    showModal() {
      this.getFields(this.modal);
      let th = this;
      this.formData = {};
      setTimeout(() => {
        th.visible = true;
      }, 500);
    },
    handleShow(e) {
      this.show = !this.show;
    },
    handleDelete(e) {
      console.log("handleDelete", e);
      this.$message.success("Элемент успешно удален!");
      this.visible = false;
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.$message.success("Данные успешно сохранены!");
          this.$router.push({ name: "Card" });
          this.form.resetFields();
          this.visible = false;
          this.show = false;
        }
      });
    },
    handleCancel(e) {
      this.form.resetFields();
      this.visible = false;
      this.show = false;
    },
    getDirectory(arr) {
      let obj = { ...arr };
      return obj.elements
        ? obj.elements.map(item =>
            item.values
              .map(el => {
                let valueA;
                let valueB;
                if (el.nick == "code") {
                  return el.valueAttr;
                } else if (el.nick == "name") {
                  return el.valueAttr;
                }
              })
              .filter(Boolean)
              .join(" ")
          )
        : [];
    },
    getFields(obj) {
      console.log("getFields", obj);
      console.log("fields", this.field);
      let form = {};
      form["deleted"] = obj["deleted"];
      form["dictNick"] = obj["nick"];
      form["tree"] = false;
      form["element"] = obj["elements"];
      form["values"] = obj["metaAttributes"];
      console.log("object", form);
      this.fields = form.values;
      let data = { ...this.field };
      // Получаем название справочников
      for (var key in data) {
        if (typeof data[key] === "object" && data[key] !== null) {
          const url = data[key].dict;
          // console.log("url", data[key]);
          if (url) {
            //  console.log("11", data[key].dict.nick);
            let th = this;
            axios
              .get(`http://cdp-dev.ursip.ru/mdm/api/v1/nsi/dict/${url.nick}`)
              .then(res => {
                //console.log(url.nick, res.data.dict);
                th.formData[url.nick] = res.data.dict;
                // console.log(111111111, th.formData);
              });
          }
        }
      }
    },
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
.select-mod {
  padding-left: 8px;
}
hr {
  margin-top: 10px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #e8e8e8;
}

hr {
  height: 0;
  box-sizing: content-box;
}
</style>

