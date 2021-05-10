import Vue from "vue";
import VueRouter from "vue-router";
// import UserRegistration from "../views/UserRegistration";
import UserLogin from "../views/UserLogin";
import Home from "../views/Home";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/register",
  //   name: "user-registration",
  //   component: UserRegistration,
  // },
  {
    path: "/login",
    name: "user-login",
    component: UserLogin,
  },
  {
    path: "/",
    name: "home",
    component: Home,
    async beforeEnter(to, from, next) {
      console.log(await store.dispatch("tokenValidation", store.state.currentUser), "teeeest")
      if (
        store.state.currentUser.token != null &&
        (await store.dispatch("tokenValidation", store.state.currentUser))
      ) {
        next();
      } else {
        next("/login");
      }
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
