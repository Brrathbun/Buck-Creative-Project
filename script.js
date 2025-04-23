// script.js

// Enhance AOS settings
AOS.init({
  duration: 800,
  once: true,
  offset: 200,
  delay: 100,
  easing: 'ease-in-out-cubic'
});

// Tab system implementation
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const targetId = button.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });
});

// Enhanced poll interaction
document.getElementById("poll-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Get selected values
  const alignment = document.getElementById("political-alignment").value;
  const influences = Array.from(document.querySelectorAll('input[name="influence"]:checked'))
    .map(checkbox => checkbox.value);

  // Create personalized message
  let message = "Thank you for your response! ";

  if (alignment === "very-similar" || alignment === "somewhat-similar") {
    message += "You share political views with your parents, like many participants in our study. ";
  } else if (alignment === "very-different" || alignment === "somewhat-different") {
    message += "Your political views have evolved differently from your parents, reflecting the complex nature of political socialization. ";
  }

  if (influences.length > 0) {
    message += `You identified ${influences.join(", ")} as key factors in your political development.`;
  }

  // Display the message with animation
  const resultElement = document.getElementById("poll-result");
  resultElement.textContent = message;
  resultElement.style.transform = "scale(1)";
  resultElement.style.opacity = "0";

  // Animate result appearance
  setTimeout(() => {
    resultElement.style.opacity = "1";
    resultElement.style.transition = "opacity 0.5s ease";
  }, 100);

  // Hide the form with animation
  this.style.opacity = "0";
  this.style.transform = "translateY(-20px)";
  this.style.transition = "opacity 0.5s ease, transform 0.5s ease";

  setTimeout(() => {
    this.style.display = "none";
  }, 500);
});

// Update D3.js chart with more relevant data
(function() {
  const sampleData = [
    { category: "Parents", value: 45, color: "#ff6f61" },
    { category: "Education", value: 20, color: "#4a90e2" },
    { category: "Peers", value: 18, color: "#9d65c0" },
    { category: "Media", value: 12, color: "#f39c12" },
    { category: "Events", value: 5, color: "#2ecc71" }
  ];

  const svg = d3.select("#chart");
  const width = parseInt(svg.style("width")) || 300;
  const height = parseInt(svg.attr("height")) || 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleBand()
    .domain(sampleData.map(d => d.category))
    .range([0, innerWidth])
    .padding(0.2);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(sampleData, d => d.value)]).nice()
    .range([innerHeight, 0]);

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // X axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-15)")
    .style("text-anchor", "end")
    .style("font-size", "11px")
    .style("font-family", "var(--font-heading)");

  // Y axis
  chartGroup.append("g")
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d + "%"))
    .selectAll("text")
    .style("font-size", "11px")
    .style("font-family", "var(--font-heading)");

  // Grid lines
  chartGroup.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat("")
    )
    .style("opacity", "0.1");

  // Bars with animation
  chartGroup.selectAll(".bar")
    .data(sampleData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.category))
      .attr("width", xScale.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", d => d.color)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("y", d => yScale(d.value))
      .attr("height", d => innerHeight - yScale(d.value));

  // Labels with animation
  chartGroup.selectAll(".bar-label")
    .data(sampleData)
    .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.category) + xScale.bandwidth()/2)
      .attr("y", innerHeight)
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8em")
      .attr("font-weight", "bold")
      .attr("opacity", 0)
      .text(d => d.value + "%")
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100 + 500)
      .attr("y", d => yScale(d.value) - 5)
      .attr("opacity", 1);

  // Chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .style("font-family", "var(--font-heading)")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Political Socialization Factors");
})();


// — The Balance of Influence chart —
(function() {
  const data = [
    { category: "Parents",   value: 45 },
    { category: "Education", value: 20 },
    { category: "Peers",     value: 18 },
    { category: "Media",     value: 12 },
    { category: "Events",    value: 5  }
  ];

  const svg = d3.select("#influence-chart");
  const width = parseInt(svg.style("width")) || 400;
  const height = parseInt(svg.attr("height")) || 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top  - margin.bottom;

  const x = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, innerW])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([innerH, 0]);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X axis
  g.append("g")
    .attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "rotate(-15)")
      .style("text-anchor", "end");

  // Y axis
  g.append("g")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));

  // Bars
  const colors = ["#ff6f61","#4a90e2","#9d65c0","#f39c12","#2ecc71"];
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => innerH - y(d.value))
      .style("fill", (d,i) => colors[i]);

  // Labels
  g.selectAll(".bar-label")
    .data(data)
    .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.category) + x.bandwidth()/2)
      .attr("y", d => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.value + "%");
})();

// Initialize timeline if the embed container exists
if (document.getElementById('timeline-embed')) {
  window.timeline = new TL.Timeline(
    'timeline-embed',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtBxED14lJIk8_6D8tUx29z5sXIP8M5rOHcpgSqUM1OnKd23J-tHmFBFsYe-I3msL-kHAZX9fQXZrW/pubhtml'
  );
}
