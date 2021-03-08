
<template>
  <div>
    <svg />

    <!-- <div  class="loader"></div> -->
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
        </v-list-item-group>
      </v-list>
    </v-menu>

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

    <v-menu v-model="showMenuRel" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense>
        <v-subheader>{{prep.title}}</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in items.rel" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
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
      prep: {},
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

      x: 0,
      y: 0,
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
  props: ["isLoaded"],

  computed: {
    ...mapState({
      graph: state => state.graph,
      selectConfigType: state => state.selectConfigType
    })
  },
  watch: {
    "$store.state.graphString": async function() {
      d3.selectAll("svg > *").remove();

      await this.drawCanvas();
      let deletedNode = this.$store.state.deletedNode;
      let deletedRel = this.$store.state.deletedRel;
      d3.select("#node" + deletedNode.id)
        .data(deletedNode)
        .exit()
        .remove();
      d3.select("#edge" + deletedRel.id)
        .data(deletedRel)
        .exit()
        .remove();
      d3.select("#nodeLabel" + deletedNode.id)
        .data(deletedNode)
        .exit()
        .remove();
      d3.select("#edgeLabel" + deletedRel.id)
        .data(deletedRel)
        .exit()
        .remove();

      // Reset store
      this.$store.state.deletedNode = {};
      this.$store.state.deletedRel = {};
    },
    deep: true
  },
  created() {
    // window.addEventListener("resize", this.resized);
  },
  destroyed() {
    // window.removeEventListener("resize", this.resized);
  },
  methods: {
    resized() {
      // d3.selectAll("svg > *").remove();
      // this.drawCanvas();
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
    async onClick(value) {
      console.log(this.$store.state.asid.root.node.parentNodes, 'parents');

      this.$store.state.asid.root.node.parentNodes = [];
      this.$store.state.propsToAdd.parentRel = ""
      this.$store.state.activeObj = this.prep;

      // Set active object
      // this.onClickReset();

      if (this.$store.state.selectedGraph == "Admin") {
        await this.$store.dispatch(
          "getAsidRootConfig",
          this.$store.state.selectedGraph
        );
      } else if (
        this.$store.state.selectedGraph != "Config" &&
        this.$store.state.selectedGraph != "Admin"
      ) {
        await this.$store.dispatch(
          "getSystemRootConfig",
          this.$store.state.selectedGraph
        );
      }

      if (this.$store.state.secondActiveObj.status) {
        this.$store.state.secondActiveObj.node = value;
      } else {
        this.$store.state.activeObj = value;
        if (this.$store.state.objCreate.type == "create from") {
          await this.$store.dispatch("getSystemSub");
        }
      }
      this.$store.state.textFields = [];
    },

    async onDoubleClick(value) {
      // Get children for expansion

      await this.$store.dispatch("readNodeChildren", value);
    },

    onClickReset() {
      // Set active object
      d3.selectAll("circle").attr("stroke", null);
      d3.selectAll("text").classed("textEdgeFocus", false);
      this.$store.state.propsToChange = [];

      this.$store.state.setConfigConfig = {};
      this.$store.state.setConfigConfigString = JSON.stringify(
        this.$store.state.setConfigConfig
      );
      (this.$store.state.createObj = {
        rel: {},
        node: { props: { key: "", value: "" } },
        asid: []
      }),
        (this.$store.state.activeObj = {});
      this.prep = {};
      this.$store.state.objCreate = { status: false };
      this.$store.state.successful = null;
      this.$store.state.secondActiveObj = {
        status: false,
        node: { title: null }
      };
      this.$store.state.setConfigConfigString = JSON.stringify(
        this.$store.state.setConfigConfig
      );
    },

    async drawCanvas() {
      // Call for inital data

      const width = window.innerWidth;
      const height = window.innerHeight - 223;

      // Create canvas with zoom function

      const svg = d3
        .select("svg")
        .on("click", clickedSvg)
        .on("contextmenu", rightClick)

        .call(
          d3.zoom().on("zoom", function({ transform }) {
            svg.attr("transform", transform);
          })
        )
        .on("dblclick.zoom", null)
        .attr("width", width + this.margin.left + this.margin.right)
        .attr("height", height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
        .append("g");

      // Draw arrow

      svg
        .append("svg:defs")
        .append("svg:marker")
        .attr("id", "end-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 45)
        .attr("refY", 0)
        .attr("markerWidth", 11)
        .attr("markerHeight", 11)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", "#999")
        .attr("overflow", "visible");

      // Create simulation

      const simulation = d3
        .forceSimulation()
        .force(
          "link",
          d3
            .forceLink()
            .id(d => d.id)
            .distance(200)
          //  .gravity(.06)
        )
        .force("charge", d3.forceManyBody().strength(-2000))
        .force(
          "center",
          d3.forceCenter(width / 2 - width / 12, height / 2 - height / 8)
        )
        .force(
          "x",
          d3
            .forceX()
            .strength(0.03)
            .x(width / 2)
        )
        .force(
          "y",
          d3
            .forceY()
            .strength(0.03)
            .y(height / 2)
        )
        .alphaTarget(0);

      // Create links

      const link = svg
        .selectAll("line")
        .data(this.graph.links)
        .join(
          enter =>
            enter
              .append("line")
              .attr("id", function(d) {
                return "edge" + d.id;
              })
              .attr("class", "linkSVG")
              .attr("marker-end", "url(#end-arrow)"),
          exit => exit.remove()
        );

      // Create nodes
      // var that = this
      const node = svg
        .selectAll(null)
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
                let colorList = ["red"];
                if (this.$store.state.groups.length < 3) {
                  colorList = this.$store.state.colors.length3;
                } else if (this.$store.state.groups.length > 8) {
                  colorList = this.$store.state.colors.length32;
                } else {
                  let set = "length" + this.$store.state.groups.length;
                  colorList = this.$store.state.colors[set];
                }
                return colorList[d.group - 1];
              })
              .attr("cursor", "pointer")
              .call(
                d3
                  .drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
              )
              .on("mouseover", handleMouseOverNode)
              .on("mouseout", handleMouseOutNode)
              .on("click", clickedNode)
              .on("dblclick", dblclick);

            return node_enter;
          },
          update => update,
          exit => exit.remove()
        );

      // Create labels on edges

      let edgeLabels = svg
        .selectAll(".textEdge")
        .data(this.graph.links)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .text(d => d.title)
        .attr("id", function(d) {
          return "edgeLabel" + d.id;
        })
        .classed("textEdge", true)
        .on("mouseover", handleMouseOverRel)
        .on("mouseout", handleMouseOutRel)
        .on("click", clickedRel);

      // Create labels on nodes

      let nodeLabels = svg
        .selectAll(".circle")
        .data(this.graph.nodes)
        .enter()
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

      // Append nodes and links to simulation

      simulation
        .nodes(this.graph.nodes)
        .force("link")
        .links(this.graph.links);

      // Generates new coordinates

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x).attr("cy", d => d.y);
        //          .attr("transform", function (d) {
        //        d.x = Math.max(this.margin.r, Math.min(width - this.margin.r, d.x));
        //        d.y = Math.max(this.margin.r, Math.min(height - this.margin.r, d.y));
        //        return "translate("+d.x+","+d.y+")";
        //  });
        // node.attr("cx", function(d) { return d.x = Math.max(this.margin.r, Math.min(width - this.margin.r, d.x)); })
        //     .attr("cy", function(d) { return d.y = Math.max(this.margin.r, Math.min(height - this.margin.r, d.y)); });

        edgeLabels.attr("x", d => {
          return (d.source.x + d.target.x) / 2;
        });
        edgeLabels.attr("y", d => {
          return (d.source.y + d.target.y) / 2;
        });
        edgeLabels.attr("transform", function(d) {
          let bbox = this.getBBox();
          let rx = bbox.x + bbox.width / 2;
          let ry = bbox.y + bbox.height / 2;
          let theAngle = angle(d.source.x, d.source.y, d.target.x, d.target.y);
          if (d.target.x < d.source.x) {
            return "rotate(" + (180 + theAngle) + " " + rx + " " + ry + ")";
          } else {
            return "rotate(" + theAngle + " " + rx + " " + ry + ")";
          }
        });

        nodeLabels
          .attr("x", data => {
            return data.x;
          })
          .attr("y", data => {
            return data.y;
          });
      });

      // Make a referens to this scope for further functions

      var ref = this;

      // Sets angle of edgeLabel

      function angle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx);
        theta *= 180 / Math.PI;
        return theta;
      }

      // If mouse over node

      function handleMouseOverNode() {
        d3.select(this)
          .attr("stroke-width", () => {
            return "5px";
          })
          .attr("stroke-opacity", "0.8");

        d3.select(this).attr("stroke", d => {
          if (d.color == 1) {
            return "#f0a4a4";
          } else {
            return "#f8d084";
          }
        });

        // d3.selectAll("text").classed("textEdgeFocus", false);
        d3.select("#node" + ref.$store.state.activeObj.id)
          .attr("stroke", "#c7e1ff")
          .attr("stroke-opacity", "0.8")

          .attr("stroke-width", "7px");

        d3.select("#edgeLabel" + ref.$store.state.activeObj.id).classed(
          "textEdgeFocus",
          true
        );
      }

      // Directly after mouse was over

      function handleMouseOutNode() {
        // d3.selectAll("text").classed("textEdgeFocus", false);
        d3.selectAll("circle").attr("stroke", null);

        d3.select("#node" + ref.$store.state.activeObj.id)
          .attr("stroke", "#c7e1ff")
          .attr("stroke-opacity", "0.8")

          .attr("stroke-width", "7px");

        d3.select("#edgeLabel" + ref.$store.state.activeObj.id).classed(
          "textEdgeFocus",
          true
        );
      }

      // Directly after mouse was over rel

      function handleMouseOverRel() {
        // d3.selectAll("text").classed("textEdgeFocus", false);
        d3.select("#node" + ref.$store.state.activeObj.id)
          .attr("stroke", "#c7e1ff")
          .attr("stroke-width", "7px");

        d3.select("#edgeLabel" + ref.$store.state.activeObj.id).classed(
          "textEdgeFocus",
          true
        );
      }

      function handleMouseOutRel() {
        // d3.selectAll("text").classed("textEdgeFocus", false);
        d3.select("#node" + ref.$store.state.activeObj.id)
          .attr("stroke", "#c7e1ff")
          .attr("stroke-width", "7px");

        d3.select("#edgeLabel" + ref.$store.state.activeObj.id).classed(
          "textEdgeFocus",
          true
        );
      }

      // When node starts to drag

      function dragstarted(d) {
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
      }
      // When node is dragging, fixed x and y

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
        simulation.alpha(1).restart();
      }

      // When node drgging has ended

      function dragended() {
        if (!event.active) simulation.alphaTarget(0);
        // d.fx = null;
        // d.fy = null;
        d3.select(this)
          .transition()
          .attr("r", ref.margin.r);
      }

      // Dragging only possible inside window

      // function clamp(x, lo, hi) {
      //   return x < lo ? lo : x > hi ? hi : x;
      // }

      // When nods is clicked

      function clickedNode(event, d) {
        if (event.defaultPrevented) return; // dragged
        // delete d.fx; // remove fixed coordinates
        // delete d.fy;
        // d3.select(this).attr("stroke", null);
        simulation.alpha(1).restart();
        ref.onClick(d, "node");

        d3.selectAll("text").classed("textEdgeFocus", false);
        d3.selectAll("circle").attr("stroke", null);
        d3.select("#node" + d.id)
          .attr("stroke-opacity", "0.8")

          .attr("stroke", "#c7e1ff");

        // .attr("stroke-width", "10px");
        // d3.select("#node" + d.id).attr("stroke", "#c7e1ff")

        ref.prep = {};
      }
      // When nods is double clicked

      function dblclick(event, d) {
        event.defaultPrevented;
        ref.onDoubleClick(d, "node");
      }

      function clickedRel(event, d) {
        ref.onClick(d, "edge");
        d3.selectAll("circle").attr("stroke", null);
        d3.selectAll("text").classed("textEdgeFocus", false);

        d3.select("#edgeLabel" + ref.$store.state.activeObj.id).classed(
          "textEdgeFocus",
          true
        );
        ref.prep = {};
      }

      function clickedSvg(d) {
        if (d.target.nodeName == "svg") {
          ref.onClickReset();
        }
      }

      function rightClick(d) {
        ref.$store.state.label = "";
        ref.$store.state.textFields = [];
        ref.$store.state.propsToShow = [];
        (ref.$store.state.createObj = {
          rel: {},
          node: { props: { key: "", value: "" } },
          asid: []
        }),
          (ref.$store.state.relsInfoData = {});

        ref.$store.state.propsToAdd = [];

        d.preventDefault();
        if (d.target.nodeName == "svg") {
          d.preventDefault();
          ref.x = d.clientX;
          ref.y = d.clientY;
          ref.prep = {};

          ref.$nextTick(() => {
            ref.showMenuCanvas = true;
            ref.showMenuNode = false;
            ref.showMenuRel = false;
          });
        } else if (d.target.nodeName == "circle") {
          d.preventDefault();
          ref.x = d.clientX;
          ref.y = d.clientY;
          ref.prep = d.target.__data__;
          ref.$store.state.activeObj = ref.prep;

          ref.$nextTick(() => {
            ref.showMenuNode = true;
            ref.showMenuCanvas = false;
            ref.showMenuRel = false;
          });
        } else if (d.target.nodeName == "text") {
          d.preventDefault();
          ref.x = d.clientX;
          ref.y = d.clientY;
          ref.prep = d.target.__data__;

          ref.$nextTick(() => {
            ref.showMenuRel = true;
            ref.showMenuNode = false;
            ref.showMenuCanvas = false;
          });
        }
      }
    }
  },
  async mounted() {
    await this.drawCanvas();
    // if (this.graph.nodes.length > 0) {
    //   await this.drawCanvas();
    // } else {
    //   console.log("no data");
    // }
  }
};
</script>

<style>
.linkSVG {
  stroke: #999;
  stroke-opacity: 0.6;
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

.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid #3498db;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 3s linear infinite; /* Safari */
  animation: spin 0.5s linear infinite;
}
/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>