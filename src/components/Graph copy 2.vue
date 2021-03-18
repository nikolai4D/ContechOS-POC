<template>
  <svg />
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
      copyGraph: null
    };
  },
  watch: {
    graphString() {
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

          // When node starts to drag

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

      // this.simulation.stop();

      // console.log(this.graph, "new");

      // console.log(this.copyGraph, "old");
      // const old = new Map(this.node.data().map(d => [d.id, d]));
      // console.log("old nodes", old);

      // this.graph.nodes = this.graph.nodes.map(d =>
        // Object.assign(old.get(d.id) || {}, d)
      // );
      // console.log("new nodes", this.graph.nodes);

      // this.graph.links = this.graph.links.map(d => Object.assign({}, d));

      // console.log(this.graph, "graph");

      // this.node = this.node
      //   .data(this.graph.nodes)
      //   .join(enter =>
      //     enter
      //       .append("circle")
      //       .attr("r", 8)
      //       .attr("fill", "red")
      //   );

      // this.link = this.link
      //   .data(this.graph.links)
      //   .append("path")
      //   .join("line");

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



      // Draw arrow

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

      // Create simulation

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

      // Create links


      const link = this.svg
        .append("g")
        .selectAll("path")

        .data(this.graph.links)
        .enter()
        .append("path")
        .attr("id", function(d) {
          return "edge" + d.id;
        })
        .attr("marker-end", d => {
          return d.source == d.target ? "url(#self-arrow)" : "url(#end-arrow)";
        })

        .attr("class", "linkSVG");
      // Create nodes
      // var that = this
      const node = this.svg
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
              .attr("fill", "red")
              .attr("cursor", "pointer")
                            .call(
                d3
                  .drag()
                  .on("start", this.dragstarted)
                  .on("drag", this.dragged)
                  .on("end", this.dragended)
              )


            return node_enter;
          }
        );

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

      this.simulation
        .nodes(this.graph.nodes)
        .force("link")
        .links(this.graph.links);

      // Generates new coordinates

      this.simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        link.attr("d", function(d) {
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
                        return `M${d.source.x-5},${d.source.y-30}A32,32 -5,1,1 ${d.target.x+1},${d.target.y+1}`;
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

        node.attr("cx", d => d.x).attr("cy", d => d.y);
        
    })}
  },
  created() {},
  mounted() {
    var that = this;
    this.width = window.innerWidth;
    this.height = window.innerHeight - 223;
          this.svg = d3
        .select("svg")
        // .on("click", clickedSvg)
        // .on("contextmenu", rightClick)

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


    // this.copyGraph = Object.assign({}, this.graph);

    // this.simulation = d3
    //   .forceSimulation()
    //   .force(
    //     "link",
    //     d3
    //       .forceLink()
    //       .id(d => d.id)
    //       .distance(200)
    //   )
    //   .force("charge", d3.forceManyBody().strength(-1800))
    //   .force(
    //     "collide",
    //     d3
    //       .forceCollide()
    //       .radius(60)
    //       .iterations(2)
    //   )
    //   .force(
    //     "x",
    //     d3
    //       .forceX()
    //       .strength(0.03)
    //       .x(this.width / 2)
    //   )
    //   .force(
    //     "y",
    //     d3
    //       .forceY()
    //       .strength(0.03)
    //       .y(this.height / 2)
    //   )
    //   .alphaTarget(0);
    // // var that = this;

    // this.svg = d3
    //   .select("svg")
    //   // .call(
    //   //   d3.zoom().on("zoom", function({ transform }) {
    //   //     that.svg.attr("transform", transform);
    //   //   })
    //   // )
    //   .on("dblclick.zoom", null)
    //   .attr("width", this.width + this.margin.left + this.margin.right)
    //   .attr("height", this.height + this.margin.top + this.margin.bottom)
    //   .append("g")
    //   .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
    //   .append("g");

    // this.link = this.svg
    //   .append("g")
    //   .attr("stroke", "#000")
    //   .attr("stroke-width", 1.5)
    //   .selectAll("line");

    // this.node = this.svg
    //   .append("g")
    //   .attr("stroke", "#fff")
    //   .attr("stroke-width", 1.5)
    //   .selectAll("circle");

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