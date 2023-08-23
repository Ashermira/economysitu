// Load the CSV data and draw the chart
d3.csv("price_index.csv").then(data => {
    // Parse data and calculate inflation rate
    data.forEach(d => {
        d.year = parseInt(d.year);
        d.cpi = parseFloat(d.cpi);
        d.inflationRate = d.cpi - 100;
    });

    // Set up the dimensions of the chart
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create an SVG element
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.inflationRate))
        .range([height, 0]);

    // Create x and y axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Create the line
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.inflationRate));

    // Draw the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

const text = svg.append("text")
  .attr("x", svgWidth / 2)
  .attr("y", svgHeight - 10) // Adjust the y-coordinate as needed
  .attr("text-anchor", "middle")
  .attr("class", "chart-text")
  .text("通货膨胀率=（当年CPI - 基期CPI） / 基期CPI");
});
