<template>
  <div>
    <a-button type="primary" size="large" @click="showModal">Создать элемент</a-button>
    <a-modal
      v-model="visible"
      title="Добавление элемента в справочник"
      onOk="handleOk"
      width="900px"
      :destroyOnClose="true"
    >
      <a-form :form="form">
        <a-row v-bind:key="index" v-for="(value, key, index) in fields">
          <a-col :span="24">
            <!-- input -->
            <a-form-item
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
              v-if="value.nick != 'disabled' && value.nick != 'virtual'
              && value.nick != 'docType' &&
              value.nick != 'system' && value.nick != 'subsystem' && value.nick != 'group'"
            >
              <a-textarea
                v-decorator="[value.nick, { rules: [{ required: value.required,
                message: `Поле ${value.nick} обязательное для ввода` }]
                 }]"
                :placeholder="`${value.name} '${value.nick}'`"
                autosize
              />
            </a-form-item>

            <!-- directory -->
            <a-form-item
              v-if="value.nick == 'docType' || value.nick == 'system' || value.nick == 'subsystem' "
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <select
                class="ant-select ant-select-enabled ant-select-selection ant-select-selection--single select-mod"
                v-decorator="[value.nick,
                { rules: [
                { required: value.required,
                  message: `Поле ${value.nick} обязательное для ввода` 
                }
                ], initialValue: '' }]"
              >
                <option
                  class='ant-select-selection__rendered'
                  v-for='(value, key) in getDirectory(
                    formData[value.nickDictLink] ? formData[value.nickDictLink] : null)'
                  v-bind:key='key'
                  v-bind:value="value"
                >{{value}}</option>
              </select>
            </a-form-item>

            <!-- disabled -->
            <a-form-item
              v-if="value.nick == 'disabled' || value.nick == 'virtual' "
              v-bind="formItemLayout"
              v-bind:label="`${value.name} '${value.nick}'`"
            >
              <a-radio-group name='radioGroup' v-decorator="[value.nick, {initialValue: ''}]">
                <a-radio :value="true">Да</a-radio>
                <a-radio :value="false">Нет</a-radio>
                <a-radio :value="''">Отсутствует</a-radio>
              </a-radio-group>
            </a-form-item>
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
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          Сохранить
        </a-button>
        <a-button key="back" @click="handleCancel">Отмена</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'ModalCreate',
  props: ['modal'],
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
          sm: { span: 10 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 },
        },
      },
      formData: {},
    };
  },
  mounted() {},
  methods: {
    showModal() {
      this.formData = {};
      this.getFields(this.modal);
      setTimeout(() => {
        this.visible = true;
      }, 500);
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.$message.success('Данные успешно сохранены!');
          this.$router.push({ name: 'Card' });
          this.formData = {};
          this.form.resetFields();
          this.visible = false;
        }
      });
    },
    handleCancel() {
      this.form.resetFields();
      this.visible = false;
    },
    getDirectory(arr) {
      const obj = { ...arr };
      return obj.elements
        ? obj.elements.map(item =>
            item.values.map((el) => {
            if (el.nick === 'code') {
              return el.valueAttr;
            } else if (el.nick === 'name') {
              return el.valueAttr;
            }
              })
              .filter(Boolean)
              .join(' ')
          )
        : [];
    },
    getFields(obj) {
      // console.log('getFields', obj);
      let form = {};
      form['deleted'] = obj.deleted;
      form['dictNick'] = obj.nick;
      form['tree'] = false;
      form['element'] = obj.elements;
      form['values'] = obj.metaAttributes;
      //console.log("object", form);
      this.fields = form.values;
      let data = obj.elements[0].values.map( (el) => {
        if (typeof el.valueAttr === 'object' && el.valueAttr !== null) {
          const url = el.valueAttr.dict;
          // console.log("url", url);
          if (url) {
          axios
              .get(`http://cdp-dev.ursip.ru/mdm/api/v1/nsi/dict/${url.nick}`)
              .then((res) => this.formData[url.nick] = res.data.dict);
          }
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.$message.success('Данные успешно сохранены!');
          this.$router.push({ name: 'Layout' });
        }
      });
    },
  },
};
</script>

<style>
.select-mod {
  padding-left: 8px;
}
</style>
