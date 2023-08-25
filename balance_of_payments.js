// Set up the SVG dimensions and margins
const margin = { top: 20, right: 30, bottom: 60, left: 50 };
const width = 1200 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the CSV data
d3.csv("summary.csv").then((data) => {
  // Convert data types if needed
  data.forEach((d) => {
    d.foreign_exchange_reserves = +d.foreign_exchange_reserves;
    d.import_export_balance = +d.import_export_balance;
    d.year = +d.year;
  });

  // Set up scales for x and y axes
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.1);

  const yScale1 = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.foreign_exchange_reserves)])
    .nice()
    .range([height, 0]);

  const yScale2 = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.import_export_balance),
      d3.max(data, (d) => d.import_export_balance),
    ])
    .nice()
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); // Display years as integers

  const yAxis1 = d3.axisLeft(yScale1);
  const yAxis2 = d3.axisRight(yScale2);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  svg.append("g").attr("class", "y-axis").call(yAxis1);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${width}, 0)`)
    .call(yAxis2);

  // Create bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale1(d.foreign_exchange_reserves))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale1(d.foreign_exchange_reserves))
    .attr("fill", "steelblue");

  // Create line for import_export_balance
  const line = d3
    .line()
    .x((d) => xScale(d.year) + xScale.bandwidth() / 2)
    .y((d) => yScale2(d.import_export_balance))
    .curve(d3.curveMonotoneX);

  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
      .attr("stroke", "orange");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 30) // Adjust the vertical position as needed
    .attr("text-anchor", "middle")
    .text("外汇储备对应y轴左侧与直方图，进出口差额对应y轴右侧与折线图，单位：亿美元");
});
