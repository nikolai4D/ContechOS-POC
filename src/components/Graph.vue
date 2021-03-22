<template>
  <div>
    <svg />
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
      svg: null,
      node: null,
      link: null,
      simulation: null,
      activeNode: null
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

  methods: {
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

    ticked() {
      this.link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      this.link.attr("d", function(d) {
        var x1 = d.source.x,
          y1 = d.source.y,
          x2 = d.target.x,
          y2 = d.target.y;

        // Self link
        if (x1 === x2 && y1 === y2) {
          return `M${x1 - 5},${y1 - 30}A26,26 -10,1,1 ${x2 + 1},${y2 + 1}`;
        }
        // else, straight line between nodes
        return `M${x1},${y1}A0,0 20,0,1 ${x2},${y2}`;
      });

      // Positioning of node
      this.node.attr("cx", d => d.x).attr("cy", d => d.y);
    },

    clickedSvg(d) {
      if (d.target.nodeName == "svg") {
        this.onClickReset();
      }
    },

    onClickReset() {
      d3.selectAll(".circle").attr("stroke", null);
      this.activeNode = null;
    },

    clickedNode(event, d) {
      if (event.defaultPrevented) return; // dragged
      delete d.fx; // remove fixed coordinates
      delete d.fy;
      this.simulation.alpha(1).restart();

      d3.selectAll(".circle").attr("stroke", null);
      d3.select("#node" + d.id)
        .attr("stroke-opacity", "0.8")
        .attr("stroke", "#c7e1ff");

      this.activeNode = d;
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
        if (that.activeNode != null) {
          d3.select("#node" + that.activeNode.id)
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
      .alphaTarget(0)
      .on("tick", this.ticked);
  },

  mounted() {
    var that = this;

    // Drawing canvas, adding context menu and zoom

    this.svg = d3
      .select("svg")
      .on("click", that.clickedSvg)
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

    this.node = this.svg
      .append("g")
      .attr("class", "forNodes")
      .select(".forNodes");

    // Adding simulation for position of links, link labels, nodes and node labels
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
</style>