<template>
  <div>
    <svg />

    <v-menu v-model="showMenuCanvas" :position-x="x" :position-y="y" absolute offset-y>
      <GraphMenuCanvas :prep="prep" />
    </v-menu>
    <v-menu small v-model="showMenuNode" :position-x="x" :position-y="y" absolute offset-y>
      <GraphMenuNode :prep="prep" />
    </v-menu>
  </div>
</template>

<script>
import * as d3 from "d3";
import { mapState } from "vuex";
import GraphMenuCanvas from "./GraphMenuCanvas";
import GraphMenuNode from "./GraphMenuNode";

export default {
  name: "Graph",
  components: { GraphMenuCanvas, GraphMenuNode },
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
      svg: null,
      node: null,
      link: null,
      simulation: null,
      prep: null,
      showMenuCanvas: false,
      showMenuNode: false,
      showMenuRel: false,
      x: 0,
      y: 0
    };
  },
  computed: {
    ...mapState(["graph", "graphString", "colors", "groups", "selectedGraph"])
  },

  watch: {
    // Watching change in graphString in store
    graphString() {
      // If changes, runs update()
      this.update();
    }
  },

  created() {
    // Setting dimensions of canvas

    this.width = window.innerWidth;
    this.height = window.innerHeight - 223;

    // Creating a simulation (d3 force)

    this.simulation = d3
      .forceSimulation()
      .force("charge", d3.forceManyBody().strength(-1800))
      .force(
        "link",
        d3
          .forceLink()
          .id(d => d.id)
          .distance(200)
      )
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
    // .on("tick", this.ticked);
  },

  mounted() {
    var that = this;

    // Drawing canvas, adding context menu and zoom

    this.svg = d3
      .select("svg")
      .on("click", that.clickedSvg)
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

    this.drawArrow("end-arrow", 45, "auto");
    this.drawArrow("self-arrow", 41.5, "172deg");

    // Drawing links

    this.link = this.svg
      .append("g")
      .attr("class", "forLinks")
      .select(".forLinks");

    // Adding labels to links

    this.linkLabels = this.svg
      .selectAll(".linkLabel")
      .append("text")
      .attr("class", "linkLabel");

    // Drawing nodes

    this.node = this.svg
      .append("g")
      .attr("class", "forNodes")
      .select(".forNodes");

    // Adding labels to nodes

    this.nodeLabels = this.svg
      .selectAll(".circle")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .classed("nodeLabel", true);

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
          return `M${x1 - 5},${y1 - 30}A26,26 -10,1,1 ${x2 + 1},${y2 + 1}`;
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
  },

  methods: {
    /* Changes data in local state, to preserve position of nodes/links */
    updateData() {
      const old = new Map(this.node.data().map(d => [d.id, d]));
      this.graph.nodes = this.graph.nodes.map(d =>
        Object.assign(old.get(d.id) || {}, d)
      );
      this.graph.links = this.graph.links.map(d => Object.assign({}, d));
    },

    /* Runs when data in store changes */
    update() {
      var that = this;
      this.updateData();

      // Stoping simulation after updating data

      this.simulation.stop();

      // Drawing links

      this.link = this.svg
        .select(".forLinks")
        .selectAll(".linkSVG")
        .data(this.graph.links)
        .join(
          enter => {
            const link_enter = enter
              .append("path")
              .attr("class", "linkSVG")
              .attr("marker-end", d => {
                return d.source == d.target
                  ? "url(#self-arrow)"
                  : "url(#end-arrow)";
              });
            return link_enter;
          },
          update => {
            const link_update = update.attr("marker-end", d => {
              return d.source == d.target
                ? "url(#self-arrow)"
                : "url(#end-arrow)";
            });
            return link_update;
          }
        );

      // Drawing link labels

      this.linkLabels = this.svg
        .selectAll(".linkLabel")
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
              .classed("linkLabel", true)
              .on("click", that.clickedRel);
            return linkLabel;
          },
          update => {
            const linkLabel = update
              .text(d => d.title)
              .attr("id", function(d) {
                return "linkLabel" + d.id;
              })
              .classed("linkLabel", true)
              .on("click", that.clickedRel);
            return linkLabel;
          }
        );

      // Drawing nodes

      this.node = this.svg
        .select(".forNodes")
        .selectAll(".circle")
        .data(this.graph.nodes)
        .join(
          enter => {
            const node_enter = enter
              .append("circle")
              .attr("class", "circle")

              .attr("r", that.margin.r)
              .attr("id", d => {
                return "node" + d.id;
              })
              .attr("fill", d => {
                return that.nodeColor(d);
              })
              .attr("cursor", "pointer")
              .call(
                d3
                  .drag()
                  .on("drag", that.dragged)
                  .on("end", that.dragended)
              )
              .on("mouseover", handleMouseOverNode)
              .on("mouseout", handleMouseOutNode)
              .on("click", that.clickedNode);

            return node_enter;
          },
          update => {
            const node_update = update
              .attr("id", d => {
                return "node" + d.id;
              })

              .attr("fill", d => {
                return that.nodeColor(d);
              })
              .attr("stroke", null)
              .call(
                d3
                  .drag()
                  .on("drag", that.dragged)
                  .on("end", that.dragended)
              )
              .on("mouseover", handleMouseOverNode)
              .on("mouseout", handleMouseOutNode)
              .on("click", that.clickedNode);
            return node_update;
          }
        );

      this.nodeLabels = this.svg
        .selectAll(".nodeLabel")
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
              .classed("nodeLabel", true);
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

      // If mouse over node

      function handleMouseOverNode() {
        d3.select(this)
          .attr("stroke-width", "5px")
          .attr("stroke-opacity", "0.8")
          .attr("stroke", "#f8d084");
      }

      // Directly after mouse was over

      function handleMouseOutNode() {
        d3.selectAll(".circle").attr("stroke", null);
        if (that.prep != null) {
          d3.select("#node" + that.prep.id)
            .attr("stroke", "#c7e1ff")
            .attr("stroke-opacity", "0.8")
            .attr("stroke-width", "7px");
        }
      }

      // Restarting simulation with new nodes and links
      this.simulation
        .nodes(this.graph.nodes)
        .force("link")
        .links(this.graph.links);
      this.simulation.alpha(1).restart();
    },

    drawArrow(id, refX, orient) {
      return this.svg
        .append("svg:defs")
        .append("svg:marker")
        .attr("id", id)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", refX)
        .attr("refY", 0)
        .attr("markerWidth", 11)
        .attr("markerHeight", 11)
        .attr("orient", orient)
        .append("path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", "#999")
        .attr("overflow", "visible");
    },
    angle(cx, cy, ex, ey) {
      var dy = ey - cy;
      var dx = ex - cx;
      var theta = Math.atan2(dy, dx);
      theta *= 180 / Math.PI;
      return theta;
    },

    clickedSvg(d) {
      if (d.target.nodeName == "svg") {
        this.onClickReset();
      }
    },

    clickedRel(event, d) {
      this.$store.state.activeObj = d;
      console.log(this.$store.state.activeObj)
      d3.selectAll("circle").attr("stroke", null);
      d3.selectAll("text").classed("linkLabelFocus", false);
      d3.select("#edgeLabel" + this.$store.state.activeObj.id).classed(
        "linkLabelFocus",
        true
      );
      this.prep = {};
    },

    onClickReset() {
      d3.selectAll(".circle").attr("stroke", null);
      this.prep = null;

      d3.selectAll("text").classed("linkLabelFocus", false);
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

    async clickedNode(event, d) {
      if (event.defaultPrevented) return; // dragged
      delete d.fx; // remove fixed coordinates
      delete d.fy;
      this.simulation.alpha(1).restart();

      d3.selectAll(".circle").attr("stroke", null);
      d3.select("#node" + d.id)
        .attr("stroke-opacity", "0.8")
        .attr("stroke", "#c7e1ff");

      this.$store.state.propsToAdd = [];
      this.$store.state.textFields = [];
      // Set active object
      this.$store.state.secondActiveObj.status
        ? (this.$store.state.secondActiveObj.node = d)
        : (this.$store.state.activeObj = d, this.prep = d);
      if (this.selectedGraph == "Admin") {
        await this.$store.dispatch("getAsidRootConfig", this.selectedGraph);
      } else if (
        this.selectedGraph != "Config" &&
        this.selectedGraph != "Admin"
      ) {
        await this.$store.dispatch("getSystemRootConfig", this.selectedGraph);
        if (this.$store.state.objCreate.type == "create from") {
          await this.$store.dispatch("getSystemSub");
        }
      }
    },

    /* When node is dragging, fixed x and y */
    dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      this.simulation.alpha(1).restart();
    },

    /* When node dragging has ended */
    dragended() {
      if (!event.active) this.simulation.alphaTarget(0);
    },

    nodeColor(d) {
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
    },

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
    }
  }
};
</script>

<style>
.linkSVG {
  stroke: #999;
  stroke-opacity: 0.6;
  fill: none;
  z-index: -100;
}
.linkLabel {
  text-anchor: middle;
  font-size: 0.6em;
  text-shadow: 0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white,
    0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white;
}
.linkLabel:hover {
  font-weight: 600;
  cursor: pointer;
}
.linkLabelFocus {
  font-weight: 600;
  cursor: pointer;
}
.nodeLabel {
  font-size: 0.6em;
  fill: white;
  font-weight: 500;
}
</style>