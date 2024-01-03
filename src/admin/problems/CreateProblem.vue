<template>
  <div class="problem">
    <problem-form
      @problem-data="getData"
      :dataProp="problemDetail"
    ></problem-form>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import ProblemForm from '@/components/ProblemForm.vue'
import api from '@/api/api'

@Component({
  components: {
    ProblemForm,
  },
})
export default class CreateProblem extends Vue {
  problemDetail: any = {}

  getData(data: any) {
    data.authorId = this.$store.state.userInfo.id
    if (this.$route.name == 'create-problem') {
      api
      .createProblem(data)
      .then((res: any) => {
        if (res.data.code) {
          ;(this as any).$Message.error(res.data.message)
        } else {
          ;(this as any).$Message.success('Create successfull')
          this.$router.push({
            path: `/admin/problems-list`,
          })
        }
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    }

    if (this.$route.name == 'create-contest-problem') {
      api.createContestProblem(this.$route.params.contestId, data)
      .then((res: any) => {
        if (res.data.code) {
          ;(this as any).$Message.error(res.data.message)
        } else {
          ;(this as any).$Message.success('Create successfully')
          this.$router.push({
            path: `/admin/contest-problems/${this.$route.params.contestId}`,
          })
        }
      }).catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      });
    }
    if (this.$route.name == 'edit-contest-problem') {
      api.updateContestProblem(this.$route.params.contestId, this.$route.params.problemId, data)
      .then((res: any) => {
        if (res.data.code) {
          ;(this as any).$Message.error(res.data.message)
        } else {
          ;(this as any).$Message.success('Update successfully')
          this.$router.push({
            path: `/admin/contest-problems/${this.$route.params.contestId}`,
          })
        }
      }).catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    }
    if (this.$route.name == 'edit-problem') {
      api.updateProblem({id: this.$route.params.problemId , problem: data})
      .then((res: any) => {
        if (res.data.code) {
          ;(this as any).$Message.error(res.data.message)
        } else {
          ;(this as any).$Message.success('Update successfully')
          this.$router.push({
            path: `/admin/problems-list/`,
          })
        }
      }).catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    }

  }
}
</script>

<style lang="less" scoped></style>
