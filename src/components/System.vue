<template>
  <div>
    <div>
      <a-row>
        <a-col :span="12">
          <div>
            <h2 class="b-title b-left">Системные справочники</h2>
            <br>
            <span class="b-left">Найдено — {{ dataLength.length }}</span>
          </div>
        </a-col>
        <a-col :span="12" class="b-rith">
          <router-link :to="'/editdict/SYSTEM'">
            <a-button type="primary" size="large">Создать справочник</a-button>
          </router-link>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <br>
          <div>
            <!-- :rowKey="(record, i) => i" -->
            <a-table
              :rowKey="record => record.key"
              :columns="columns"
              :dataSource="data"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
              @expand="handleExpand"
              @customRow="handleRowsChange"
            >
              <!-- Search -->
              <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                class="custom-filter-dropdown"
              >
                <a-input
                  v-ant-ref="c => searchInput = c"
                  :placeholder="`Поиск по ${column.title}`"
                  :value="selectedKeys[0]"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="() => handleSearch(selectedKeys, confirm)"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                />
                <a-button
                  type="primary"
                  @click="() => handleSearch(selectedKeys, confirm)"
                  icon="search"
                  size="small"
                  style="width: 90px; margin-right: 8px"
                >Поиск</a-button>
                <a-button
                  @click="() => handleReset(clearFilters)"
                  size="small"
                  style="width: 90px"
                >Сбросить</a-button>
              </div>
              <!-- End Search -->
              <template slot="customRender" slot-scope="text">
                <span v-if="searchText">
                  <template
                    v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                  >
                    <mark
                      v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                      :key="i"
                      class="highlight"
                    >{{fragment}}</mark>
                    <template v-else>{{fragment}}</template>
                  </template>
                </span>
                <template v-else>{{text}}</template>
              </template>

              <!-- nameData -->
              <template slot="nameData" slot-scope="text, record">
                <router-link :to="`/card/${record.nick}`" v-if="searchText">
                  <template
                    v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                  >
                    <mark
                      v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                      :key="i"
                      class="highlight"
                    >{{fragment}}</mark>
                    <template v-else>{{fragment}}</template>
                  </template>
                </router-link>
                <template v-else>
                  <router-link :to="`/card/${record.nick}`">{{record.name}}</router-link>
                </template>
              </template>
              <!--  -->
              <!-- <router-link
                :to="`/card/${record.nick}`"
                slot="nameData"
                slot-scope="text, record"
              >{{record.name}}</router-link>-->
              <div slot="deletedData" slot-scope="text, record">
                <div v-if="record.deleted == '0'">
                  <a-tag color="#108ee9">Используется</a-tag>
                </div>
                <div v-else>
                  <a-tag color="#f50">Удален</a-tag>
                </div>
              </div>
              <div slot="hierarchyDictData" slot-scope="text, record">
                <div v-if="record.hierarchyDict == '0'">
                  <a-tag color="#999">Линейный</a-tag>
                </div>
                <div v-else>
                  <a-tag color="#87d068">Иерархический</a-tag>
                </div>
              </div>

              <!-- :to="{ path: `/editdict/${record.nick}`, params: { userId: 123 }}" -->
              <router-link
                slot="editField"
                slot-scope="text, record"
                :to="`/editdict/${record.nick}`"
              >
                <a-icon type="edit"/>
              </router-link>
              <a-icon
                slot="filterIcon"
                slot-scope="filtered"
                type="search"
                :style="{ color: filtered ? '#108ee9' : undefined }"
              />
              <template slot="name" slot-scope="name">{{name.first}} {{name.last}}</template>
            </a-table>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { close, closeSync } from 'fs';
import * as R from 'ramda';

export default {
  name: 'System',
  mounted() {
    this.get();
  },
  computed: {
    columns() {
      let { sortedInfo, filteredInfo, filterStatys } = this;
      sortedInfo = sortedInfo || {};
      filteredInfo = filteredInfo || {};
      filterStatys = filterStatys || false;
      const columns = [
        {
          title: 'Код',
          dataIndex: 'nick',
          sorter: true,
          width: '20%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          sorter: (a, b) => a.nick.length - b.nick.length,
          sortOrder: sortedInfo.columnKey === 'nick' && sortedInfo.order,
          onFilter: (value, record) =>
            record.nick.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          }
        },
        {
          title: 'Наименование',
          dataIndex: 'name',
          sorter: true,
          width: '20%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'nameData',
          },
          onFilter: (value, record) =>
            record.name.toLowerCase().includes(value.toLowerCase()),
          sorter: (a, b) => a.name.length - b.name.length,
          sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          }
        },
        {
          title: 'Система',
          dataIndex: 'sysName',
          sorter: true,
          width: '10%',
          filters: filterStatys || false,
          onFilter: (value, record) => {
            return record.sysName === value;
          }
        },
        {
          title: 'Статус',
          sorter: true,
          dataIndex: 'deleted', // 1 удален , 0 используется
          filters: [
            { text: 'Удален', value: '1' },
            { text: 'Используется', value: '0' }
          ],
          filteredValue: filteredInfo.deleted || ['0'],
          onFilter: (value, record) => {
            return record.deleted === parseInt(value);
          },
          scopedSlots: { customRender: 'deletedData' },
          width: '10%',
        },
        {
          title: 'Тип',
          sorter: true,
          dataIndex: 'hierarchyDict', // 1 Иерархический ,  0 Линейный
          filters: [
            { text: 'Иерархический', value: '1' },
            { text: 'Линейный', value: '0' }
          ],
          filteredValue: filteredInfo.hierarchyDict || null,
          onFilter: function(value, record){
            return record.hierarchyDict === parseInt(value);
          },
          scopedSlots: { customRender: 'hierarchyDictData' },
          width: '10%',
        },
        {
          title: 'Примечание',
          dataIndex: 'note',
          width: '10%',
        },
        {
          title: '',
          dataIndex: 'edit',
          scopedSlots: { customRender: 'editField' },
          width: '5%',
        },
      ];
      return columns;
    },
  },
  data() {
    return {
      data: [],
      filterStatys: false,
      pagination: { pageSize: 10 },
      loading: false,
      filteredInfo: null,
      sortedInfo: null,
      searchText: '',
      searchInput: null,
      dataLength: [],
      url: {
        dict: 'http://localhost:3000/dict',
      },
    };
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;

      console.log('data', this.data);
      const filterData = this.data.filter((item) => {
        if (filters.deleted.length) {
          return filters.deleted.includes(String(item.deleted));
        } else {
          return item;
        }
      });
      this.dataLength = filterData;
    },
    handleExpand(expanded, record) {
      console.log('handleExpand', expanded, record);
    },
    handleRowsChange(record, index) {
      console.log('expandedRows', record, index);
    },
    get() {
      this.loading = true;
      axios
        .get(this.url.dict)
        .then((data) => {
          const res = data.data;
          const arr = [];
          res.map((item, i) => {
            arr.push({ text: item.sysName, value: item.sysName });
            item.key = i
            return item;
          });
          const outArr = R.uniq(arr);
          const result = outArr.filter((item) => item.text !== null);
          const sortByName = R.sortBy(
            R.compose(
              R.toLower,
              R.prop('nick'),
            ),
          );
          this.data = sortByName(res);
          const filterData = this.data.filter((item) => item.deleted === 0);
          this.dataLength = filterData;
          this.filterStatys = result;
          this.loading = false;
        });
    },
    handleSearch(selectedKeys, confirm) {
      console.log('handleSearch', selectedKeys, confirm);
      confirm();
      this.searchText = selectedKeys[0];
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
  },
};
</script>

<style scoped>
.b-left {
  text-align: left;
  display: inherit;
}
.b-rith {
  text-align: right;
  display: inherit;
}

.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.ant-table-tbody a {
  cursor: pointer;
}
</style>
