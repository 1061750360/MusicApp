import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 异步加载组件
const Recommend = (resolve) => {
  import('../components/recommend/Recommend').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('../components/rank/Rank').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('../components/search/Search').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('../components/singer/Singer').then((module) => {
    resolve(module)
  })
}

const TopNav = (resolve) => {
  import('../components/topnav/TopNav').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('../components/singer/SingerDetail/SingerDetail').then((module) => {
    resolve(module)
  })
}

const Disc = (resolve) => {
  import('../components/recommend/disc/Disc').then((module) => {
    resolve(module)
  })
}

const TopList = (resolve) => {
  import('../components/rank/TopList/TopList').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('../components/UserCenter/UserCenter').then((module) => {
    resolve(module)
  })
}




export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ":id",
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ":id",
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/topnav',
      component: TopNav
    },
    {
      path: '/user',
      component: UserCenter
    },
  ],
  linkActiveClass: "active"
})
