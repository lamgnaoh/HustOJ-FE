<template>
  <Row>
    <Col :span="22" style="margin-top: 20px">
      <h2>Email confirmation is completed. Please login and practice some problems. Have fun</h2>
    </Col>
  </Row>
</template>
<script lang="ts">

import {Vue, Component} from 'vue-property-decorator';
import api from "@/api/api";
@Component({})
export default class VerifyToken extends Vue {
  mounted() {
    api.verifyToken({
      token: this.$route.params.token
    }).then((res: any) => {

    }).catch((err: any) => {
      this.$Message.error(err.data.message)
    })
  }

}
</script>


<style scoped lang="less">

</style>