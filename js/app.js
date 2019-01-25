function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = '/metadata/' + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadata = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      sampleMetadata.append("h4").text(`${key}: ${value}`);
    
  });
});


    // BONUS: Build the Gauge Chart
    //buildGauge(data.WFREQ);
    // Enter a speed between 0 and 180
    var url = '/wfreq/' + sample;
    
     d3.json(url).then(function(data) {
    
    var level = data.WFREQ * 18;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors: [
    "rgba(0, 105, 11, .5)",
    "rgba(10, 120, 22, .5)",
    "rgba(14, 127, 0, .5)",
    "rgba(110, 154, 22, .5)",
    "rgba(170, 202, 42, .5)",
    "rgba(202, 209, 95, .5)",
    "rgba(210, 206, 145, .5)",
    "rgba(232, 226, 202, .5)",
    "rgba(240, 230, 215, .5)",
    "rgba(255, 255, 255, 0)"
  ]},
  labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Wahsing Frequency',
  height: 600,
  width: 800,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
    
});

    
//////////////////////////////////////////
};

function buildCharts(sample) {
  var url = '/samples/' + sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(data) {
  // @TODO: Build a Bubble Chart using the sample data
  var xValues = data.otu_ids;
  var yValues = data.sample_values;
  var markerSize = data.sample_values;
  var marketColors = data.otu_ids;
  var textValues = data.otu_labels;

  var trace1 = {
    x: xValues,
    y: yValues,
    mode: 'markers',
    title: textValues,
    marker: {
      color: marketColors,
      size: markerSize
    }
  };
  
  var data = [trace1];

  var layout = {
    //title: 'Belly Button Bacteria',
    showlegend: false,
    xaxis: {title: "OTU ID"},
    height: 700
  };

    Plotly.newPlot('bubble', data, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    d3.json(url).then(function(data) {  
      var pieValues = data.sample_values.slice(0,10);
        var pieLabels = data.otu_ids.slice(0,10);
        var pieText = data.otu_labels.slice(0,10);
  
        var data = [{
          values: pieValues,
          labels: pieLabels,
          hovertext: pieText,
          type: 'pie'
        }];
        
        var layout =  {
          height: 500,
          width: 500
        }
        Plotly.newPlot('pie', data, layout);
  
      });

    });
    
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
