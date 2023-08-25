const svgWidth = 800;
const svgHeight = 600;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3
  .select("#chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("summary.csv").then((data) => {
  data.forEach((d) => {
    d.year = +d.year;
    d.unemployment_rate = +d.unemployment_rate;
  });

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.unemployment_rate) * 1.1]) // Adding some padding to the top
    .range([height, 0]);

  // Create line generator
  const line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.unemployment_rate));

  // Add X and Y axes
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))); // Format as integers

  g.append("g").call(d3.axisLeft(yScale));

  // Add the line
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add the line path
  const linePath = g
    .append("path")
    .datum(data) // Associate data with the line element
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Create a tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add event listeners for hover
  linePath
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);

      const [x, y] = d3.pointer(event);
      const xValue = xScale.invert(x); // Convert screen x-coordinate to data value
      const bisect = d3.bisector((d) => d.year).left;
      const index = bisect(data, xValue);
      const selectedData = data[index];

      tooltip
        .html(
          `年份: ${
            selectedData.year
          }<br>失业率: ${selectedData.unemployment_rate.toFixed(2)}%`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  g.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat("").tickSize(-height));

  // Add Y grid lines
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(yScale).tickFormat("").tickSize(-width));

  const text = svg
    .append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - 10) // Adjust the y-coordinate as needed
    .attr("text-anchor", "middle")
    .attr("class", "chart-text")
    .text("y轴为失业率，单位为百分比");
});
