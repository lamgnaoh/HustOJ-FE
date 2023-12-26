<template>
  <Row type="flex" justify="space-around">
    <Col :span="22">
      <Announcement class="announcement"></Announcement>
    </Col>
  </Row>
</template>
<script lang="ts">

import {Vue, Component} from 'vue-property-decorator';
import Announcement from "@/components/Announcement.vue";
@Component({
  components: {Announcement}
})
export default class Home extends Vue {
  btnLoading: any = false

}
</script>


<style scoped lang="less">
.announcement {
  margin-top: 20px;
}
</style>