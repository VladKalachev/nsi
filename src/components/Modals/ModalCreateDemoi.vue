<template>
  <div>
    <a-button type="primary" size="large" @click="showModal">Создать элемент</a-button>
    <a-modal
      v-model="visible"
      title="Добавление элемента в справочник"
      onOk="handleOk"
      width="900px"
    >
      <a-form :form="form">
        <a-row v-bind:key="index" v-for="(value, key, index) in fields">
          <a-col :span="24">
            <a-form-item
              v-if="value.nick == 'disabled' || value.nick != 'virtual' "
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <a-input
                v-decorator="[value.nick, { rules: [{ required: value.required, message: `Поле ${value.nick} обязательное для ввода` }] }]"
              />
            </a-form-item>
            <!-- disabled -->
            <a-form-item
              v-if="value.nick != 'disabled' || value.nick != 'virtual' "
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <a-input
                v-decorator="[value.nick, { rules: [{ required: value.required, message: `Поле ${value.nick} обязательное для ввода` }] }]"
              />
            </a-form-item>
            <!-- directory -->

            <!-- groups -->
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item v-bind="formItemLayout" label="Сортировочное значение элемента">
              <a-input
                v-decorator="['sortValue', { rules: [{ required: false }], initialValue: '' }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Сохранить</a-button>
        <a-button key="back" @click="handleCancel">Отмена</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: "ModalCreateDemo",
  props: ["modal"],
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      fields: [],
      loading: false,
      visible: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 26 },
          sm: { span: 10 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      }
    };
  },
  mounted() {},
  methods: {
    showModal() {
      this.getFields(this.modal);
      this.visible = true;
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
        }
      });
    },
    handleCancel(e) {
      this.form.resetFields();
      this.visible = false;
    },
    getFields(obj) {
      console.log("getFields", obj);
      let form = {};
      form["deleted"] = obj["deleted"];
      form["dictNick"] = obj["nick"];
      form["tree"] = false;
      form["element"] = obj["elements"];
      form["values"] = obj["metaAttributes"];
      console.log("object", form);
      this.fields = form.values;
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