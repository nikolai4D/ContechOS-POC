<template>
<div>
  <svg />

      <v-menu v-model="showMenuCanvas" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense>
        <v-list-item-group color="primary">
          <div>
            <v-list-item
              @click="triggerEvent(item.type)"
              v-for="(item, i) in items.canvas"
              :key="i"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
    <v-menu small v-model="showMenuNode" :position-x="x" :position-y="y" absolute offset-y>
      <v-list small dense>
        <v-list-item-group color="primary">
          <v-item class="pa-2">
            <v-list-item-title>(Nod): {{prep.title}}</v-list-item-title>
          </v-item>

          <div v-if="this.$store.state.selectedGraph == 'Config'">
            <v-list-item
              v-for="(item, i) in items.node.config"
              :key="i"
              @click="triggerEvent(item.type)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>

          <div
            v-else-if="this.$store.state.selectedGraph == 'Admin' || this.$store.state.selectedGraph == 'System' "
          >
            <v-list-item
              v-for="(item, i) in items.node.as"
              :key="i"
              @click="triggerEvent(item.type)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>

          <div v-else>
            <v-list-item
              v-for="(item, i) in items.node.id"
              :key="i"
              @click="triggerEvent(item.type)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>

          <v-divider></v-divider>
          <div>
            <v-divider></v-divider>
            <div class="text-right pa-2">
              <v-btn icon rounded>
                <v-icon
                  @click="deleteNode"
                  v-text="items.node.delete.icon"
                  color="error"
                >mdi-delete-forever-outline</v-icon>
              </v-btn>
            </div>
          </div>
        </v-list-item-group>
      </v-list>
    </v-menu>
          <v-divider></v-divider>
          <div>
            <v-divider></v-divider>
            <div class="text-right pa-2">
              <v-btn icon rounded>
                <v-icon
                  @click="deleteNode"
                  v-text="items.node.delete.icon"
                  color="error"
                >mdi-delete-forever-outline</v-icon>
              </v-btn>
            </div>
          </div>
        </v-list-item-group>
      </v-list>
    </v-menu>
</div>
</template>

<script>
import * as d3 from "d3";
import { mapState } from "vuex";
export default {
  name: "Graph",
  data() {
    return {
      width: 0,
      height: 0,
      margin: {
        top: 40,
        bottom: 10,
        left: 20,
        right: 20,
        r: 38
      },
            showMenuNode: false,

            showMenuCanvas: false,
      svg: null,
      node: null,
      link: null,
      simulation: null,
      copyGraph: null,
      prep:{},
            items: {
        canvas: [
          {
            type: "create",
            text: "Skapa nod",
            icon: "mdi-plus-circle-outline"
          }
        ],
        node: {
          delete: {
            type: "delete",
            text: "Ta bort nod",
            icon: "mdi-delete-forever-outline"
          },
          config: [
            {
              type: "create to",
              text: "Skapa: (Nod) -> (Ny)",
              icon: "mdi-ray-start-arrow"
            },
            {
              type: "create rel",
              text: "Skapa: (Nod) -> (Bef)",
              icon: "mdi-vector-line"
            },
            {
              type: "update",
              text: "Redigera nod",
              icon: "mdi-circle-edit-outline"
            }
          ],
          as: [
            {
              type: "create from",
              text: "Skapa: (Nod) <- (Ny)",
              icon: "mdi-ray-end-arrow"
            },

            {
              type: "create rel",
              text: "Skapa: (Nod) -> (Bef)",
              icon: "mdi-vector-line"
            },
            {
              type: "update",
              text: "Redigera nod",
              icon: "mdi-circle-edit-outline"
            }
          ],
          id: [
            {
              type: "create from",
              text: "Skapa: (Nod) <- (Ny)",
              icon: "mdi-ray-end-arrow"
            },

            {
              type: "create rel",
              text: "Skapa: (Nod) -> (Bef)",
              icon: "mdi-vector-line"
            },
            {
              type: "update",
              text: "Redigera nod",
              icon: "mdi-circle-edit-outline"
            }
          ]
        },
        rel: []
      }
    };
  },
  watch: {
    graphString() {
      console.log(this.graphString)
      this.update();
    }
  },
  computed: {
    ...mapState(["graph", "graphString"]),
    newGraph() {
      return this.graph;
    }
  },
  methods: {
    fixna(x) {
      if (isFinite(x)) return x;
      return 0;
    },
        async deleteNode() {
      let response = confirm(
        `Är du säker på att du vill ta bort "${this.prep.title}"?`
      );

      if (response) {
        if (this.$store.state.selectedGraph == "Config") {
          await this.$store.dispatch("deleteConfigNode", this.prep);
        } else if (this.$store.state.selectedGraph == "Admin") {
          await this.$store.dispatch("deleteAsidNode", this.prep);
        } else {
          await this.$store.dispatch("deleteNode", this.prep);
        }
      }
    },
        async triggerEvent(value) {
      this.$store.state.propsToChange = [];
      d3.selectAll("circle").attr("stroke", null);
      d3.selectAll("text").classed("textEdgeFocus", false);
      if (this.$store.state.selectedGraph == "Admin") {
        await this.$store.dispatch(
          "getAsidRootConfig",
          this.$store.state.selectedGraph
        );
        this.$store.state.propsToChange = this.$store.state.asid.root.node.props.map(
          obj => {
            if (obj.dataType == "string") {
              return { keyId: obj.keyId, value: "", key: obj.key };
            }
          }
        );
        this.$store.state.done = "true";
        this.$store.state.done = "false";
      }

      if (
        this.$store.state.selectedGraph != "Config" &&
        this.$store.state.selectedGraph != "Admin"
      ) {
        await this.$store.dispatch(
          "getSystemRootConfig",
          this.$store.state.selectedGraph
        );
        this.$store.state.propsToChange = this.$store.state.asid.root.node.props.map(
          obj => {
            if (obj.dataType == "string") {
              return { keyId: obj.keyId, value: "", key: obj.key };
            }
          }
        );
        this.$store.state.done = "true";
        this.$store.state.done = "false";
      }

      if (value == "update") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objEditingId = this.prep.id;
        this.$store.state.objCreate = { status: false };
      } else if (value == "create") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create" };
      } else if (value == "create to") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create to" };
      } else if (value == "create from") {
        if (
          this.$store.state.selectedGraph != "Config" &&
          this.$store.state.selectedGraph != "Admin"
        ) {
          await this.$store.dispatch("getSystemSub");
        }

        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create from" };
      } else if (value == "create rel") {
        this.$store.state.activeObj = this.prep;
        this.$store.state.objCreate = { status: true, type: "create rel" };
        this.$store.state.secondActiveObj.status = true;
        this.$store.dispatch("getSidRel", this.$store.state.activeObj.id);
      } else {
        this.$store.state.objCreate = { status: false };
      }
    },

    // When node starts to drag
       rightClick(d) {
        this.$store.state.label = "";
        this.$store.state.textFields = [];
        this.$store.state.propsToShow = [];
        (this.$store.state.createObj = {
          rel: {},
          node: { props: { key: "", value: "" } },
          asid: []
        }),
          (this.$store.state.relsInfoData = {});

        this.$store.state.propsToAdd = [];

        d.preventDefault();
        if (d.target.nodeName == "svg") {
          d.preventDefault();
          this.x = d.clientX;
          this.y = d.clientY;
          this.prep = {};

          this.$nextTick(() => {
            this.showMenuCanvas = true;
            this.showMenuNode = false;
            this.showMenuRel = false;
          });
        } else if (d.target.nodeName == "circle") {
          d.preventDefault();
          this.x = d.clientX;
          this.y = d.clientY;
          this.prep = d.target.__data__;
          console.log("prep", this.prep)
          this.$store.state.activeObj = this.prep;

          this.$nextTick(() => {
            this.showMenuNode = true;
            this.showMenuCanvas = false;
            this.showMenuRel = false;
          });
        } else if (d.target.nodeName == "text") {
          d.preventDefault();
          this.x = d.clientX;
          this.y = d.clientY;
          this.prep = d.target.__data__;

          this.$nextTick(() => {
            this.showMenuRel = true;
            this.showMenuNode = false;
            this.showMenuCanvas = false;
          });
        }
      },
    dragstarted(d) {
      d3.select(this).attr("stroke", d => {
        if (d.color == 1) {
          return "#f0a4a4";
        } else {
          return "#f8d084";
        }
      });
      d3.select(this).attr("stroke-width", () => {
        return "5px";
      });
      d3.select(this).classed("fixed", (d.fixed = true));
    },
    // When node is dragging, fixed x and y

    dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      this.simulation.alpha(1).restart();
    },

    // When node drgging has ended

    dragended() {
      if (!event.active) this.simulation.alphaTarget(0);
      // d.fx = null;
      // d.fy = null;
      d3.select(this)
        .transition()
        .attr("r", this.margin.r);
    },

    update() {
      // var that = this;

      // console.log(this.graph, "new");

      // console.log(this.copyGraph, "old");
      const old = new Map(this.node.data().map(d => [d.id, d]));
      // console.log("old nodes", old);

      this.graph.nodes = this.graph.nodes.map(d =>
      Object.assign(old.get(d.id) || {}, d)
      );
      // console.log("new nodes", this.graph.nodes);

      this.graph.links = this.graph.links.map(d => Object.assign({}, d));

      // console.log(this.graph, "graph");

      this.simulation.stop();

      this.link = this.svg
        .selectAll("path")
        .data(this.graph.links)
        .join(
          enter => {
            const link_enter = enter.append("path");
            return link_enter;
          },
          update => {
            const node_update = update.attr("fill", "orange");
            return node_update;
          },
          exit => {
            const node_exit = exit.remove();
            return node_exit;
          }
        )
        .attr("class", "linkSVG");

      this.node = this.svg
        .selectAll("circle")
        .data(this.graph.nodes)
        .join(
          enter => {
            const node_enter = enter
              .append("circle")
              .attr("r", this.margin.r)
              .attr("id", d => {
                return "node" + d.id;
              })
              .attr("fill", "red")
              .attr("cursor", "pointer")
              .call(
                d3
                  .drag()
                  .on("start", this.dragstarted)
                  .on("drag", this.dragged)
                  .on("end", this.dragended)
              );

            return node_enter;
          },
          update => {
            const node_update = update.attr("fill", "orange");
            return node_update;
          },
          exit => {
            const node_exit = exit.remove();
            return node_exit;
          }
        );

      this.simulation
        .nodes(this.graph.nodes)
        .force("link")
        .links(this.graph.links);
      this.simulation.alpha(1).restart();

      // this.simulation.on("tick", () => {
      //   that.link
      //     .attr("x1", function(d) {
      //       return that.fixna(d.source.x);
      //     })
      //     .attr("y1", function(d) {
      //       return that.fixna(d.source.y);
      //     })
      //     .attr("x2", function(d) {
      //       return that.fixna(d.target.x);
      //     })
      //     .attr("y2", function(d) {
      //       return that.fixna(d.target.y);
      //     });

      //   that.node.attr("transform", function(d) {
      //     return "translate(" + that.fixna(d.x) + "," + that.fixna(d.y) + ")";
      //   });
      // });

      // console.log("new map", this.node.data());

      // this.copyGraph = Object.assign({}, this.graph);
      // console.log(this.copyGraph, "new old");
      //       const width = window.innerWidth;
      // const height = window.innerHeight - 223;

      // Create canvas with zoom function

      // Create links

      // Create labels on edges

      // let edgeLabels = svg
      //   .selectAll(".textEdge")
      //   .data(this.graph.links)
      //   .enter()
      //   .append("text")
      //   .attr("text-anchor", "middle")
      //   .text(d => d.title)
      //   .attr("id", function(d) {
      //     return "edgeLabel" + d.id;
      //   })

      // Create labels on nodes

      // let nodeLabels = svg
      //   .selectAll(".circle")
      //   .data(this.graph.nodes)
      //   .enter()
      //   .append("text")
      //   .attr("id", function(d) {
      //     return "nodeLabel" + d.id;
      //   })
      //   .attr("text-anchor", "middle")
      //   .attr("pointer-events", "none")
      //   .text(d => {
      //     if (d.title.length > 12) {
      //       return d.title.slice(0, 12) + "...";
      //     }
      //     return d.title;
      //   })
      //   .classed("textNode", true);

      // Append nodes and links to simulation

      // Generates new coordinates
    }
  },
  created() {
    this.simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(d => d.id)
          .distance(200)
      )
      .force("charge", d3.forceManyBody().strength(-1800))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius(60)
          .iterations(2)
      )
      .force(
        "x",
        d3
          .forceX()
          .strength(0.03)
          .x(this.width / 2)
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(0.03)
          .y(this.height / 2)
      )
      .alphaTarget(0);
  },
  mounted() {
    // var that = this;
    this.width = window.innerWidth;
    this.height = window.innerHeight - 223;

    // this.copyGraph = Object.assign({}, this.graph);

    var that = this;

    this.svg = d3
      .select("svg")
              .on("contextmenu", that.rightClick)

      .call(
        d3.zoom().on("zoom", function({ transform }) {
          that.svg.attr("transform", transform);
        })
      )
      .on("dblclick.zoom", null)
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .append("g");

    this.link = this.svg
      .append("g")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .selectAll("line");

    this.node = this.svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle");

    this.simulation.on("tick", () => {
      that.link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      that.link.attr("d", function(d) {
        var x1 = d.source.x,
          y1 = d.source.y,
          x2 = d.target.x,
          y2 = d.target.y,
          dr = 0,
          // Defaults for normal edge.
          drx = dr,
          dry = dr,
          xRotation = 0, // degrees
          largeArc = 0, // 1 or 0
          sweep = 1; // 1 or 0

        // Self edge.
        if (x1 === x2 && y1 === y2) {
          // Fiddle with this angle to get loop oriented.
          xRotation = -45;

          // Needs to be 1.
          largeArc = 1;

          // Change sweep to change orientation of loop.
          //sweep = 0;

          // Make drx and dry different to get an ellipse
          // instead of a circle.
          drx = 40;
          dry = 20;

          // For whatever reason the arc collapses to a point if the beginning
          // and ending points of the arc are the same, so kludge it.
          x2 = x2 + 1;
          y2 = y2 + 1;
          return `M${d.source.x - 5},${d.source.y - 30}A32,32 -5,1,1 ${d.target
            .x + 1},${d.target.y + 1}`;
        }
        return (
          "M" +
          x1 +
          "," +
          y1 +
          "A" +
          drx +
          "," +
          dry +
          " " +
          xRotation +
          "," +
          largeArc +
          "," +
          sweep +
          " " +
          x2 +
          "," +
          y2
        );
      });

      that.node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
  }
};
</script>

<style>
.linkSVG {
  stroke: #999;
  stroke-opacity: 0.6;
  fill: none;
}
</style>