import Vue from 'vue'
import Router from 'vue-router'
import problems from '@/views/Problems.vue'
import status from '@/views/Status.vue'
import contests from '@/views/Contests.vue'
import home from '@/views/Home.vue'
import login from '@/views/Login.vue'
import register from '@/views/Register.vue'
import forget from '@/views/Forget.vue'
import help from '@/views/Help.vue'
import about from '@/views/About.vue'
import rank from '@/views/Rank.vue'
import personal from '@/views/Personal.vue'
import submission from '@/views/Submission.vue'
import share from '@/views/Share.vue'

import problemDetail from '@/components/ProblemDetail.vue'
import contestDetail from '@/components/ContestDetail.vue'
import announcement from '@/components/Announcement.vue'
import contestProblemDetail from '@/components/ContestProblemDetail.vue'

import adminIndex from '@/admin/AdminIndex.vue'
import accountSetting from "@/views/AccountSetting.vue";
import admin from "@/admin/index/index.vue";
import problemList from "@/admin/problems/ProblemList.vue";
import createContest from "@/admin/contests/CreateContest.vue";
import contestsList from "@/admin/contests/ContestsList.vue";
import contestProblemList from "@/admin/contests/ContestProblems.vue";
import contestMember from "@/admin/contests/ContestMember.vue";
import groupList from "@/admin/groups/GroupList.vue";
import createGroup from "@/admin/groups/CreateGroup.vue";
import logs from "@/admin/users/Logs.vue";
import judgeServer from "@/admin/index/JudgeServer.vue";
import userManager from "@/admin/users/UserManager.vue";
import createProblem from "@/admin/problems/CreateProblem.vue";
import adminAnnouncement from "@/admin/announcement/Announcement.vue";

Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location: any): Promise<any> {
  // @ts-ignore
  return routerPush.call(this, location).catch((error: any) => error)
}
// @ts-ignore
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: home,
    },
    {
      path: '/problems',
      name: 'problems',
      component: problems,
    },
    {
      path: '/problems/:id',
      name: 'problem',
      component: problemDetail,
    },
    {
      path: '/share/:id',
      name: 'share',
      component: share,
    },
    {
      path: '/status',
      name: 'status',
      component: status,
    },
    {
      path: '/contests',
      name: 'contests',
      component: contests,
    },
    {
      path: '/contests/:id',
      name: 'contest',
      component: contestDetail,
    },
    {
      path: '/contests/:contestId/problems/:problemId',
      name: 'contest-problem',
      component: contestProblemDetail,
    },
    {
      path: '/announcement/:id',
      name: 'announcement',
      component: announcement,
    },
    {
      path: '/submission/:id',
      name: 'submission',
      component: submission,
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget,
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
    },
    {
      path: '/help',
      name: 'help',
      component: help,
    },
    {
      path: '/about',
      name: 'about',
      component: about,
    },
    {
      path: '/personal/:id',
      name: 'personal',
      component: personal,
    },
    {
      path: '/setting/:id',
      name: 'setting',
      component: accountSetting,
    },
    {
      path: '/admin',
      name: 'AdminIndex.vue',
      component: adminIndex,
      redirect: '/admin/index',
      meta: {
        requireAuth: true,
      },
      children: [
        {
          path: 'judge-server',
          name: 'judge-server',
          component: judgeServer
        },
        {
          path: 'index',
          name: 'admin-index',
          component: admin
        },
        {
          path: 'admin-announcement',
          name: 'admin-announcement',
          component: adminAnnouncement
        },
        {
          path: 'problems-list',
          name: 'problems-list',
          component: problemList
        },
        {
          path: 'create-problem',
          name: 'create-problem',
          component: createProblem
        },
        {
          path: 'edit-problem/:problemId',
          name: 'edit-problem',
          component: createProblem
        },
        {
          path: 'create-contest',
          name: 'create-contest',
          component: createContest
        },
        {
          path: '/contest/:contestId/edit',
          name: 'edit-contest',
          component: createContest
        },
        {
          path: 'contests-list',
          name: 'contests-list',
          component: contestsList
        },
        {
          path: 'contest-problems/:contestId',
          name: 'contest-problems',
          component: contestProblemList
        },
        {
          path: 'contest-problems/:contestId/problem/create',
          name: 'create-contest-problem',
          component: createProblem
        },
        {
          path: 'contest-problems/:contestId/problem/:problemId',
          name: 'edit-contest-problem',
          component: createProblem
        },
        {
          path: 'contest-member/:id',
          name: 'contest-member',
          component: contestMember
        },
        {
          path: 'group-list',
          name: 'group-list',
          component: groupList
        },
        {
          path: 'create-group',
          name: 'create-group',
          component: createGroup
        },
        {
          path: 'user-manager',
          name: 'user-manager',
          component: userManager
        },
        {
          path: 'logs',
          name: 'logs',
          component: logs
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // to route need to authentication
    // @ts-ignore
    const role: any = window.localStorage.getItem('role')
    if (role.indexOf('USER') === -1) {
      next()
    } else {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      })
    }
  } else {
    next()
  }
})
export default router
