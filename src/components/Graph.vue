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
      showMenuCanvas: false,
      showMenuNode: false,
      showMenuRel: false,

      prep: {},
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
      },
      svg: null,
      node: null,
      link: null,
      nodeLabels: null,
      linkLabels: null,
      simulation: null
    };
  },

  computed: {
    ...mapState(["graph", "graphString", "colors", "groups"])
  },

  watch: {
    graphString() {
      this.update();
    }
  },
  methods: {
    nodeColor(status){
          return status.attr("fill", d => {
              let colorList = [];
              if (this.groups.length < 3) {
                colorList = this.colors.length3;
              } else if (this.groups.length > 8) {
                colorList = this.colors.length32;
              } else {
                let set = "length" + this.groups.length;
                colorList = this.colors[set];
              }
              return colorList[d.group - 1];
            });          
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
        console.log("prep", this.prep);
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
      d3.select(this).attr("stroke", "#f8d084d");
      d3.select(this).attr("stroke-width", "5px");
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

    angle(cx, cy, ex, ey) {
      var dy = ey - cy;
      var dx = ex - cx;
      var theta = Math.atan2(dy, dx);
      theta *= 180 / Math.PI;
      return theta;
    },
    updateData() {
      const old = new Map(this.node.data().map(d => [d.id, d]));
      this.graph.nodes = this.graph.nodes.map(d =>
        Object.assign(old.get(d.id) || {}, d)
      );
      this.graph.links = this.graph.links.map(d => Object.assign({}, d));
    },

    update() {
      this.updateData();

      this.simulation.stop();

      this.link = this.svg
        .selectAll(".linkSVG")
        .data(this.graph.links)
        .join(enter => {
          const link_enter = enter
            .append("path")
            .attr("id", function(d) {
              return "edge" + d.id;
            })
            .attr("marker-end", d => {
              return d.source == d.target
                ? "url(#self-arrow)"
                : "url(#end-arrow)";
            })
            .attr("class", "linkSVG");
          return link_enter;
        });

      this.linkLabels = this.svg
        .selectAll(".textEdge")
        .data(this.graph.links)
        .join(
          enter => {
            const linkLabel = enter
              .append("text")
              .attr("text-anchor", "middle")
              .text(d => d.title)
              .attr("id", function(d) {
                return "linkLabel" + d.id;
              })
              .classed("textEdge", true);
            return linkLabel;
          },
          update => {
            const linkLabel = update
              .text(d => d.title)
              .attr("id", function(d) {
                return "linkLabel" + d.id;
              });
            return linkLabel;
          }
        );

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
              .attr("fill", d => {
                let colorList = [];
                if (this.groups.length < 3) {
                  colorList = this.colors.length3;
                } else if (this.groups.length > 8) {
                  colorList = this.colors.length32;
                } else {
                  let set = "length" + this.groups.length;
                  colorList = this.colors[set];
                }
                return colorList[d.group - 1];
              })
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
            const node_update = this.nodeColor(update)
            return node_update
          }
        );

      this.nodeLabels = this.svg
        .selectAll(".textNode")
        .data(this.graph.nodes)
        .join(
          enter => {
            const nodeLabel = enter
              .append("text")
              .attr("id", function(d) {
                return "nodeLabel" + d.id;
              })
              .attr("text-anchor", "middle")
              .attr("pointer-events", "none")
              .text(d => {
                if (d.title.length > 12) {
                  return d.title.slice(0, 12) + "...";
                }
                return d.title;
              })
              .classed("textNode", true);
            return nodeLabel;
          },
          update => {
            const nodeLabel = update
              .attr("id", function(d) {
                return "nodeLabel" + d.id;
              })
              .text(d => {
                if (d.title.length > 12) {
                  return d.title.slice(0, 12) + "...";
                }
                return d.title;
              });

            return nodeLabel;
          }
        );

      this.simulation
        .nodes(this.graph.nodes)
        .force("link")
        .links(this.graph.links);
      this.simulation.alpha(1).restart();
    }
  },
  created() {
    
    // Setting dimensions of canvas
    
    this.width = window.innerWidth;
    this.height = window.innerHeight - 223;

    // Creating a simulation (d3 force)

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
    var that = this;

    // Drawing canvas, adding context menu and zoom

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

    // Drawing 2 arrows, for 1. between nodes and 2. self links

    this.svg
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "end-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 45)
      .attr("refY", 0)
      .attr("markerWidth", 11)
      .attr("markerHeight", 11)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .attr("overflow", "visible");

    this.svg
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "self-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 41.5)
      .attr("refY", 2)
      .attr("markerWidth", 11)
      .attr("markerHeight", 11)
      .attr("orient", "187.5deg")
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .attr("overflow", "visible");

    // Drawing links

    this.link = this.svg
      .append("g")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .attr("class", "linkSVG");

    // Adding labels to links

    this.linkLabels = this.svg
      .selectAll(".textEdge")
      .append("text")
      .attr("text-anchor", "middle")
      .classed("textEdge", true);

    // Drawing nodes

    this.node = this.svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle");

    // Adding labels to nodes

    this.nodeLabels = this.svg
      .selectAll(".circle")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .classed("textNode", true);

    // Adding simulation for position of links, link labels, nodes and node labels

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
          y2 = d.target.y;

        // Self link

        if (x1 === x2 && y1 === y2) {
          return `M${x1 - 5},${y1 - 30}A32,32 -5,1,1 ${x2 + 1},${y2 + 1}`;
        }

        // else, straight line between nodes

        return `M${x1},${y1}A0,0 0,0,1 ${x2},${y2}`;
      });

      // Positioning of node

      that.node.attr("cx", d => d.x).attr("cy", d => d.y);

      // Positioning of label (between nodes)

      that.linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      that.linkLabels.attr("transform", function(d) {
        let bbox = this.getBBox();
        let rx = bbox.x + bbox.width / 2;
        let ry = bbox.y + bbox.height / 2;
        let theAngle = that.angle(
          d.source.x,
          d.source.y,
          d.target.x,
          d.target.y
        );

        // Self link
        if (d.target == d.source) {
          return `rotate(1 ${rx + 3500} ${ry + 2800})`;
        }

        if (d.target.x < d.source.x) {
         
         // Rotating label 180 degrees (prevent it going upside down)
         
         return `rotate(${180 + theAngle} ${rx} ${ry})`;
        } else {
          return `rotate(${theAngle} ${rx} ${ry})`;
        }
      });
      that.nodeLabels.attr("x", data => data.x).attr("y", data => data.y);
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

.linkSVG {
  stroke: #999;
  stroke-opacity: 0.6;
  fill: none;
}

.textEdge {
  font-size: 0.6em;
  text-shadow: 0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white,
    0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white;
}

.textEdge:hover {
  font-weight: 600;
  cursor: pointer;
}

.textEdgeFocus {
  font-weight: 600;
  cursor: pointer;
}

.textNode {
  font-size: 0.6em;
  fill: white;
  font-weight: 500;
}
</style>