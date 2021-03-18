import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import bcrypt from "bcryptjs";
import crypto from "crypto";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userRegSent: null,
    currentUser: {},
    tokenValid: false,
    graph: { nodes: [], links: [] },
    graphString: "",
    activeObj: {},
    secondActiveObj: { status: false, node: { title: null } },
    deletedNode: {},
    deletedRel: {},
    objEditingId: "",
    objCreate: { status: false },
    createObj: {
      rel: {},
      node: { props: { key: "", value: "" }, relss: [] },
      asid: [],
    },
    successful: null,
    selectedGraph: "",
    systemConfig: {},
    selectConfigType: "",
    setConfigDataType: { node: {}, rel: {} },
    setConfigConfig: {},
    setConfigConfigString: "",
    setConfigConfigNodesString: "",
    asid: { root: {} },
    label: "",
    done: "false",
    textFields: [],
    propsToChange: [],
    propsToShow: {},
    propsToAdd: {},
    relsInfoData: {},
    validNodes:[],

    groups: [],
    colors: {
      length3: ["#003f5c", "#bc5090", "#ffa600"],
      length4: ["#003f5c", "#7a5195", "#ef5675", "#ffa600"],
      length5: ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"],
      length6: [
        "#003f5c",
        "#444e86",
        "#955196",
        "#dd5182",
        "#ff6e54",
        "#ffa600",
      ],
      length7: [
        "#003f5c",
        "#374c80",
        "#7a5195",
        "#bc5090",
        "#ef5675",
        "#ff764a",
        "#ffa600",
      ],
      length8: [
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
      ],
      length32: [
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
      ],
    },
  },
  mutations: {
    SET_USER_REG_SENT(state, userRegSent) {
      state.userRegSent = userRegSent;
      window.localStorage.userRegSent = userRegSent;
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
      window.localStorage.currentUser = JSON.stringify(user);
    },
    LOGOUT_USER(state) {
      state.currentUser = {};
      window.localStorage.currentUser = JSON.stringify({});
    },
    SET_TOKEN_VALIDATION(state, token) {
      state.tokenValid = token;
    },
    SET_NODES_SYSTEM(state, nodes) {
      state.graph.nodes = nodes;

      state.graphString = JSON.stringify(state.graph);
    },

    SET_RELS_SYSTEM(state, links) {
      state.graph.links = links;
      state.graphString = JSON.stringify(state.graph);
    },

    SET_NODES_CONFIG(state, obj) {
      state.graph.nodes = obj.nodes;
      state.graphString = JSON.stringify(state.graph);
    },

    SET_RELS_CONFIG(state, obj) {
      state.graph.links = obj.rels;
      state.graphString = JSON.stringify(state.graph);
    },

    SET_CONFIGDATATYPE(state, data) {
      state.setConfigDataType = data;
    },

    SET_CONFIGCONFIGREL(state, data) {
      state.setConfigConfig = data;
      state.setConfigConfigString = JSON.stringify(state.setConfigConfig);
    },

    SET_CONFIGCONFIG_NODES(state, data) {
      state.setConfigConfig.nodes = null;

      state.setConfigConfig.nodes = data;
      let newNodes = [state.setConfigConfig.nodes];
      newNodes.push(data);
      Vue.set(state.setConfigConfig, "configNode", newNodes);
      state.setConfigConfigString = JSON.stringify(state.setConfigConfig);
      state.setConfigConfigNodesString = JSON.stringify(
        state.setConfigConfig.nodes
      );
    },

    SET_ADMINCONFIG_RELS(state, data) {
      state.setConfigConfig.rels = data;
      state.setConfigConfigString = JSON.stringify(state.setConfigConfig);
    },

    SET_SYSTEMCONFIG(state, data) {
      state.systemConfig = data.systemConfig;
    },

    SET_ASID_ROOT_CONFIG(state, data) {
      state.asid = data;
    },

    SET_VALID_NODES(state, data) {
      state.validNodes = data;
    },


    DELETE_NODE(state, node) {
      state.deletedNode = state.graph.nodes.filter((v) => v.id == node)[0];

      let nodes = state.graph.nodes.filter((v) => v.id != node);
      state.graph.nodes = nodes;
      state.graphString = JSON.stringify(state.graph);
    },
    DELETE_RELS(state, node) {
      state.deletedRel = state.graph.links.filter(
        (v) => v.source.id == node
      )[0];

      let links = state.graph.links.filter((v) => v.source.id != node);
      state.graph.links = links;
      state.graphString = JSON.stringify(state.graph);
    },
    EDIT_NODE(state, node) {
      state.graph.nodes.forEach((v) => {
        if (v.id == node.id) {
          v = node;
        }
      });
    },
    EDIT_REL(state, rel) {
      state.graph.rels.forEach((v) => {
        if (v.id == rel.id) {
          v = rel;
        }
      });
    },
    ADD_NODE(state) {
      // let nodes = state.graph.nodes.concat(node);
      // state.graph.nodes = nodes;
      state.successful = true;
    },
    ADD_REL(state) {
      // let rels = state.graph.rels.concat(rel);
      // state.graph.rels = rels;
      state.successful = true;
    },
    ADD_NODE_SYSTEM(state, node) {
      let nodes = state.graph.nodes.concat(node);

      state.graph.nodes = nodes;
      state.graphString = JSON.stringify(state.graph);

      state.successful = true;
    },
    ADD_REL_SYSTEM(state, link) {
      if (state.graph.links.length > 0) {
        let links = state.graph.links.concat(link);
        state.graph.links = links;
      } else {
        state.graph.links = link;
      }
      state.graphString = JSON.stringify(state.graph);

      state.successful = true;
    },

    ADD_NODE_REL(state) {
      state.successful = true;
    },

    CONSOLE(state) {
      state.successful = true;
    },
  },

  actions: {
    async registerUser({ commit }, user) {
      const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        data: {
          email: user.email,
          name: user.name,
          password: await bcrypt.hash(user.password, 10),
        },
        url: process.env.VUE_APP_APIURL + "register",
      };

      try {
        await axios(options);
        commit("SET_USER_REG_SENT", true);
      } catch (error) {
        console.error(error.response.data.message);
        commit("SET_USER_REG_SENT", false);
      }
    },

    async loginUser({ commit }, user) {
      try {
        const optionsLogin = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            email: user.email,
          },
          url: process.env.VUE_APP_APIURL + "login",
        };
        let apiResponse = await axios(optionsLogin);
        if (await bcrypt.compare(user.password, apiResponse.data.data)) {
          let token = crypto.randomBytes(64).toString("hex");
          const optionsAuth = {
            method: "POST",
            headers: { "content-type": "application/json" },
            data: {
              email: user.email,
              token,
            },
            url: process.env.VUE_APP_APIURL + "loginAuth",
          };
          let apiResponse = await axios(optionsAuth);

          commit("SET_CURRENT_USER", apiResponse.data.data);
          return apiResponse.data.message;
        }
        return "Wrong password";
      } catch (error) {
        console.error(error.response.data.message);
        return error.response.data.message;
      }
    },

    async loadCurrentUser({ commit }) {
      let user = JSON.parse(window.localStorage.currentUser);
      commit("SET_CURRENT_USER", user);
    },

    async logoutUser({ commit }, user) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            token: user.token,
          },
          url: process.env.VUE_APP_APIURL + "logout",
        };
        let apiResponse = await axios(options);

        commit("LOGOUT_USER");

        return apiResponse.data.message;
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async tokenValidation({ commit }, user) {
      if ((await user.token) == null) {
        return false;
      }
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            token: user.token,
          },
          url: process.env.VUE_APP_APIURL + "tokenVal",
        };

        let apiResponse = await axios(options);
        commit("SET_TOKEN_VALIDATION", apiResponse.data);

        return apiResponse.data;
      } catch (error) {
        console.error(error);
      }
    },

    // Getting data to D3

    async readNodeParents({ commit }, nodeType) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            nodeType,
          },
          url: process.env.VUE_APP_APIURL + "readNodeParents",
        };
        let apiResponse = await axios(options);
        // console.log(apiResponse, "doubleclicked");
        commit("SET_NODES_SYSTEM", apiResponse.data.nodes);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async readNodeChildren({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            id: node.id,
          },
          url: process.env.VUE_APP_APIURL + "readNodeChildren",
        };
        let apiResponse = await axios(options);
        // console.log(apiResponse, "doubleclicked");
        commit("ADD_NODE_SYSTEM", apiResponse.data.nodes);
        commit("ADD_REL_SYSTEM", apiResponse.data.edges);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async readNodes({ commit }, nodeType) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            nodeType,
          },
          url: process.env.VUE_APP_APIURL + "readNodes",
        };

        let apiResponse = await axios(options);
        let anArray = [];
        if (nodeType == "System") {
          await apiResponse.data.nodes.map((node) => {
            node.props.map((obj) => {
              if (obj.key == "title") {
                anArray.push({
                  id: node.id,
                  labels: node.labels,
                  props: node.props,
                  title: obj.value,
                });
              }
            });
          });

          let resultObject = { nodes: anArray, rels: apiResponse.data.rels };

          commit("SET_NODES_SYSTEM", resultObject.nodes);
          commit("SET_RELS_SYSTEM", resultObject.rels);
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async readConfig({ commit }, configType) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            configType,
          },
          url: process.env.VUE_APP_APIURL + "readConfig",
        };

        let apiResponse = await axios(options);
        let anArray = [];
        let groups = [];
        this.state.groups = [];

        if (configType) {
          await apiResponse.data.nodes.map((node) => {
            node.labels.map((obj) => {
              if (obj != configType) {
                let group = {};

                if (!groups.includes(obj)) {
                  groups.push(obj);
                  group = groups.length;
                } else {
                  group = groups.indexOf(obj) + 1;
                }
                anArray.push({
                  id: node.id,
                  labels: node.labels,
                  props: node.props,
                  title: obj,
                  group,
                });
              }
            });
          });

          let resultObject = {
            configType,
            nodes: anArray,
            rels: apiResponse.data.rels,
            groups: groups.length,
          };

          this.state.groups = groups;

          commit("SET_NODES_CONFIG", resultObject);
          commit("SET_RELS_CONFIG", resultObject);
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async readModel({ commit }, selectedGraph) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            selectedGraph,
          },
          url: process.env.VUE_APP_APIURL + "readModel",
        };
        let arrayGraphs = ["Admin", "System", "Information"];

        let apiResponse = await axios(options);
        let anArray = [];
        let groups = [];
        this.state.groups = [];

        if (selectedGraph) {
          await apiResponse.data.nodes.map((node) => {
            node.labels.map((obj) => {
              if (obj != selectedGraph) {
                let group = {};
                if (!["Config", "Admin"].includes(selectedGraph)) {
                  node.parent.labels.map((obj1) => {
                    if (!arrayGraphs.includes(obj1)) {
                      if (!groups.includes(obj1)) {
                        groups.push(obj1);
                        group = groups.length;
                      } else {
                        group = groups.indexOf(obj1) + 1;
                      }
                    }
                  });
                } else {
                  if (!groups.includes(obj)) {
                    groups.push(obj);
                    group = groups.length;
                  } else {
                    group = groups.indexOf(obj) + 1;
                  }
                }
                anArray.push({
                  id: node.id,
                  labels: node.labels,
                  parent: node.parent,
                  props: node.props,
                  title: obj,
                  group,
                  childProps: node.childProps,
                });
              }
            });
          });

          let resultObject = {
            selectedGraph,
            nodes: anArray,
            rels: apiResponse.data.rels,
            groups: groups.length,
          };

          this.state.groups = groups;

          commit("SET_NODES_CONFIG", resultObject);
          commit("SET_RELS_CONFIG", resultObject);
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getConfigDataTypes({ commit }) {
      try {
        const options = {
          method: "GET",
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getConfigDataTypes",
        };

        let apiResponse = await axios(options);

        commit("SET_CONFIGDATATYPE", apiResponse.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getConfigConfigRel({ commit }) {
      try {
        const options = {
          method: "POST",
          data: { title: this.state.activeObj.title },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getConfigConfigRel",
        };

        let apiResponse = await axios(options);

        commit("SET_CONFIGCONFIGREL", apiResponse.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getConfigConfigNodes({ commit }, id) {
      try {
        const options = {
          method: "POST",
          data: { id },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getConfigConfigNodes",
        };

        let apiResponse = await axios(options);

        commit("SET_CONFIGCONFIG_NODES", apiResponse.data.nodes);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getAdminConfigRels({ commit }, obj) {
      try {
        const options = {
          method: "POST",
          data: { obj },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getAdminConfigRels",
        };

        let apiResponse = await axios(options);

        commit("SET_ADMINCONFIG_RELS", apiResponse.data.rels);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getAsidRootConfig({ commit }, selectedGraph) {
      try {
        const options = {
          method: "POST",
          data: { selectedGraph },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getAsidRootConfig",
        };

        let apiResponse = await axios(options);

        let asidRoot = apiResponse.data;

        let options2 = {
          method: "POST",
          data: { selectedGraph },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getAsidChildProps",
        };

        let apiResponse2 = await axios(options2);
        let asidChildProps = apiResponse2.data;

        let newObject = { root: asidRoot, childProps: asidChildProps };

        commit("SET_ASID_ROOT_CONFIG", newObject);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getSystemRootConfig({ commit }, selectedGraph) {
      try {
        const options = {
          method: "POST",
          data: { selectedGraph },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getSystemRootConfig",
        };

        let apiResponse = await axios(options);

        let asidRoot = apiResponse.data;

        let options2 = {
          method: "POST",
          data: { selectedGraph },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getAsidChildProps",
        };

        let apiResponse2 = await axios(options2);
        let asidChildProps = apiResponse2.data;

        let newObject = { root: asidRoot, childProps: asidChildProps };

        commit("SET_ASID_ROOT_CONFIG", newObject);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getSystemSub({ commit }) {
      try {
        const options = {
          method: "POST",
          data: {
            selectedGraph: this.state.selectedGraph,
            id: await this.state.activeObj.id,
          },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getSystemSub",
        };

        let apiResponse = await axios(options);
        let asidRoot = apiResponse.data;

        let options2 = {
          method: "POST",
          data: { selectedGraph: this.state.selectedGraph },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getAsidChildProps",
        };

        let apiResponse2 = await axios(options2);
        let asidChildProps = apiResponse2.data;

        let test = [];
        let test2 = [];

        asidRoot.node.parentNodes.map((obj) => {
          obj.rels.map((obj1) => {
            if (!test2.includes(obj1.relId)) {
              test.push({
                relType: obj1.relType,
                options: obj1.options,
                relId: obj1.relId,
              });
              test2.push(obj1.relId);
            } else {
              test.map((obj2) => {
                if (obj1.relId == obj2.relId) {
                  let list1 = obj2.options.concat(obj1.options);
                  obj2.options = list1;
                }
              });
            }
          });
          obj.rels = test;

          obj.rels.map((obj1) => {
            obj1.options.map((obj2) => {
              obj2["relType"] = obj1.relType;
            });
          });
        });

        let newObject = { root: asidRoot, childProps: asidChildProps };
        commit("SET_ASID_ROOT_CONFIG", newObject);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getSidRel({ commit }) {
      try {
        const options = {
          method: "POST",
          data: {
            id: await this.state.activeObj.id,
          },
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getSidRel",
        };

        let apiResponse = await axios(options);
        let validNodes = apiResponse.data;
        console.log(validNodes)
        commit("SET_VALID_NODES", validNodes);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async deleteNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            id: node.id,
          },
          url: process.env.VUE_APP_APIURL + "deleteNode",
        };
        let apiResponse = await axios(options);
        this.dispatch("readModel", this.state.selectedGraph);

        commit("DELETE_NODE", JSON.stringify(apiResponse.data.result));
        commit("DELETE_RELS", JSON.stringify(apiResponse.data.result));
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async deleteConfigNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            id: node.id,
          },
          url: process.env.VUE_APP_APIURL + "deleteConfigNode",
        };
        let apiResponse = await axios(options);
        this.dispatch("readConfig", this.state.selectConfigType);

        commit("DELETE_NODE", JSON.stringify(apiResponse.data.result));
        commit("DELETE_RELS", JSON.stringify(apiResponse.data.result));
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async deleteAsidNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            id: node.id,
          },
          url: process.env.VUE_APP_APIURL + "deleteAsidNode",
        };
        let apiResponse = await axios(options);
        this.dispatch("readModel", this.state.selectedGraph);

        commit("DELETE_NODE", JSON.stringify(apiResponse.data.result));
        commit("DELETE_RELS", JSON.stringify(apiResponse.data.result));
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async updateNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            id: node.id,
            title: node.title,
            type: node.type,
          },
          url: process.env.VUE_APP_APIURL + "updateNode",
        };
        let apiResponse = await axios(options);
        let { title, type, updated } = apiResponse.data;
        let data = {
          id: JSON.stringify(apiResponse.data.id),
          title,
          type,
          updated,
        };
        commit("EDIT_NODE", data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async updateRel({ commit }, rel) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            id: rel.id,
            title: rel.title,
          },
          url: process.env.VUE_APP_APIURL + "updateRel",
        };
        let apiResponse = await axios(options);
        let { title, updated } = apiResponse.data;
        let data = { id: JSON.stringify(apiResponse.data.id), title, updated };
        commit("EDIT_REL", data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: node,
          url: process.env.VUE_APP_APIURL + "createNode",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readNodes", "System");

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createRel({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: node,
          url: process.env.VUE_APP_APIURL + "createRel",
        };
        await axios(options);
        console.log("Relation har nu skapats.");
        this.dispatch("readNodes", "System");

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createConfigNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: node,
          url: process.env.VUE_APP_APIURL + "createConfigNode",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readConfig", this.state.selectConfigType);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createConfigRel({ commit }, rel) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: rel,
          url: process.env.VUE_APP_APIURL + "createConfigRel",
        };
        await axios(options);
        console.log("Relation har nu skapats.");
        this.dispatch("readConfig", this.state.selectConfigType);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createAsidRel({ commit }, rel) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: rel,
          url: process.env.VUE_APP_APIURL + "createAsidRel",
        };
        await axios(options);
        console.log("Relation har nu skapats.");
        this.dispatch("readModel", this.state.selectedGraph);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createConfigNodeRel({ commit }, obj) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createConfigNodeRel",
        };
        await axios(options);
        console.log("Nod med relation har nu skapats.");
        this.dispatch("readConfig", this.state.selectConfigType);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createAdminConfigNode({ commit }, obj) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createAdminConfigNode",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readConfig", this.state.selectConfigType);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createAdminConfigNodeRel({ commit }, obj) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createAdminConfigNodeRel",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readConfig", this.state.selectConfigType);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createRootNode({ commit }, obj) {
      obj = { obj: obj, selectedGraph: this.state.selectedGraph };
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createRootNode",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readModel", this.state.selectedGraph);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createSubNodeRel({ commit }, obj) {
      obj = { obj: obj, selectedGraph: this.state.selectedGraph };
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createSubNodeRel",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readModel", this.state.selectedGraph);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createSystemRootNode({ commit }, obj) {
      obj = { obj: obj, selectedGraph: this.state.selectedGraph };
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createSystemRootNode",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readModel", this.state.selectedGraph);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createSystemSubNodeRel({ commit }, obj) {
      obj = { obj: obj, selectedGraph: this.state.selectedGraph };
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createSystemSubNodeRel",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readModel", this.state.selectedGraph);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createInfoDataSubNodeRel({ commit }, obj) {
      obj = { obj: obj, selectedGraph: this.state.selectedGraph };
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createInfoDataSubNodeRel",
        };
        await axios(options);
        console.log("Nod har nu skapats.");
        this.dispatch("readModel", this.state.selectedGraph);

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async updateConfigNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            node,
          },
          url: process.env.VUE_APP_APIURL + "updateConfigNode",
        };
        await axios(options);

        // console.log(data);
        console.log("Noden har nu redigerats.");
        this.dispatch("readConfig", this.state.selectConfigType);

        commit("EDIT_NODE", node);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async updateAsidNode({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: { node },
          url: process.env.VUE_APP_APIURL + "updateAsidNode",
        };
        await axios(options);

        console.log("Noden har nu redigerats.");
        this.dispatch("readModel", this.state.selecedGraph);

        commit("EDIT_NODE", node);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async updateAsidChildProp({ commit }, node) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            node,
          },
          url: process.env.VUE_APP_APIURL + "updateAsidChildProp",
        };
        await axios(options);

        console.log("Noden har nu redigerats.");
        // this.dispatch("readConfig", this.state.selectConfigType);

        commit("EDIT_NODE", node);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async createNodeRel({ commit }, obj) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: obj,
          url: process.env.VUE_APP_APIURL + "createNodeRel",
        };
        await axios(options);

        console.log("Nod med relation har nu skapats.");
        // commit("ADD_NODE_REL");
        this.dispatch("readNodes", "System");

        commit("CONSOLE");
      } catch (error) {
        console.error(error.response.data.message);
      }
    },

    async getSystemConfig({ commit }) {
      try {
        const options = {
          method: "POST",
          headers: { "content-type": "application/json" },
          url: process.env.VUE_APP_APIURL + "getSystemConfig",
          data: "",
        };

        let apiResponse = await axios(options);

        commit("SET_SYSTEMCONFIG", apiResponse.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },
  },
  getters: {
    async getConfigConfigNodes(state) {
      return await state.setConfigConfig.nodes;
    }
  },
});
