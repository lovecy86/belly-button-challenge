// Function to build the metadata panel

function buildMetadata(sample) {

// Fetch JSON data from the provided URL
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Log entire dataset
    console.log("Full Data:", data); // Log entire dataset

    // Get the metadata field from the JSON data. The JSON data is an object with a metadata key that contains an array of objects.
    let metadata = data.metadata;

    // Log metadata array
    console.log("Metadata:", metadata); 

    // Find the metadata object that matches the selected sample ID
    let requiredMetadata = metadata.find(obj => obj.id == sample);

    // Log selected sample's metadata
    console.log("Wanted Metadata:", requiredMetadata); 

    // Use d3 to select the panel with id of `#sample-metadata`
    let element = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata before updating it with new metadata
    element.html("");

    // Inside a loop, append new tags for each key-value pair in the  requiredMetadata
    //This dynamically displays the metadata for the selected sample.No need to hardcode the metadata in HTML elements.
    //The for loop iterates over each key-value pair.
    for (let i = 0; i < Object.entries(requiredMetadata).length; i++) {

      // Get the key
      let key = Object.entries(requiredMetadata)[i][0]; 

      // Get the value
      let value = Object.entries(requiredMetadata)[i][1];
    
      // log the key-value pair and append it to the element.
      console.log(`Key: ${key}, Value: ${value}`);
      element.append("p").text(`${key}: ${value}`);
    }

  });
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Function to build bubble and bar charts

function buildCharts(sample) {

  // Fetch JSON data from the provided URL
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Full Data for Charts:", data); // Log full dataset

    // Get the samples field fro the JSON data
    let samples = data.samples;

    // Find the samples object that matches the selected sample ID
    let requiredSample = samples.find(obj => obj.id == sample);

    // Log selected sample's data
    console.log("Required Sample:", requiredSample);

    // Get the otu_ids, otu_labels, and sample_values from the requiredSample
    // x-axis: OTU IDs
    let otu_ids = requiredSample.otu_ids;
    let otu_labels = requiredSample.otu_labels;
    let sample_values = requiredSample.sample_values;

    // Create a trace for the Bubble Chart
    let bubbleTrace = {
       // x-axis: OTU IDs
      x: otu_ids,

      // y-axis: Sample values
      y: sample_values,

      // Hover text: OTU labels
      text: otu_labels,

      // Display as scatter plot with markers
      mode: "markers",
      marker: {
      // Marker size corresponds to sample values
        size: sample_values,
        // Color corresponds to OTU IDs
        color: otu_ids,

        // Use "Earth" color scale
        colorscale: "Earth"
      }
    };

     // Define layout for the Bubble Chart
    let bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      hovermode: "closest"
    };

    // Plot the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);


   //Plot the Bar Chart
    // Sort the data to get the top 10 OTUs
    /// Prepare y-axis tick labels for the Bar Chart (Top 10 OTUs)
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a trace for the Bar Chart
    let barTrace = {
      // Top 10 sample values, reversed
      x: sample_values.slice(0, 10).reverse(),

      // Top 10 OTU labels, reversed
    y: yticks,

    // Top 10 OTU labels, reversed.Text is for hover
    text: otu_labels.slice(0, 10).reverse(),
      type: "bar",

    // Its a Horizontal bar chart
      orientation: "h"
    };


  // Define layout for the Bar Chart 
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",

    // Adjust margin for labels
      margin: { t: 30, l: 150 },
      xaxis: { title: "Number of Bacteria" }
    };

    // Plot the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Function to initialize the dashboard

function init() {

  // Fetch JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Initial Data Loaded:", data);

    // Extract the names field
    let sampleNames = data.names;
    console.log("Sample Names:", sampleNames);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

// Loop through each sample name in the sampleNames array
  for (let i = 0; i < sampleNames.length; i++) {

  // Get the current sample name
  let sample = sampleNames[i]; 

  // Append a new <option> element to the dropdown menu.The option element is created dynamically using D3.js
  let option = dropdown.append("option");

  // Set the text content of the <option> element to the sample name
  option.text(sample);

  // Set the value property of the <option> element to the sample name
  option.property("value", sample);
}

    // Get the first sample from the list
    let firstData = sampleNames[0];
    console.log("First Sample Selected:", firstData);

    // Build charts and metadata panel with the first sample
    buildMetadata(firstData);
    buildCharts(firstData);
  });
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Function to handle dropdown selection changes
function optionChanged(selectedSample) {

   // Log the selected sample
  console.log("New Sample Selected:", selectedSample);

// Update the metadata panel and charts with the new selection
  buildMetadata(selectedSample);
  buildCharts(selectedSample);
}

// Initialize the dashboard when the page loads
init();
