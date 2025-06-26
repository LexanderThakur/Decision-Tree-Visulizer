var isGenerating=false;
var isVisualizing=false;
const apiBase="/";

function selectCriterion(value) {
  document.getElementById("criterion").value = value;

  // Toggle appearance
  document.getElementById("giniBtn").classList.remove("selected");
  document.getElementById("entropyBtn").classList.remove("selected");

  if (value === "gini") {
    document.getElementById("giniBtn").classList.add("selected");
  } else {
    document.getElementById("entropyBtn").classList.add("selected");
  }
}

async function generateData() {
  if (isGenerating || isVisualizing) return;

  const samples = document.getElementById("numSamples").value;
  const clusters = document.getElementById("numClusters").value;
  const variance = document.getElementById("variance").value;
  const depth = document.getElementById("maxDepth").value;
  try {
    const response = await fetch(apiBase + "Generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        n_Samples: samples,
        num_Clusters: clusters,
        variance: variance,
        max_depth: depth
      }),
    });

    const json = await response.json();

    const flaskData = json.flaskData; 

    window.plotData = flaskData.plot;
    window.dPlotData = flaskData.d_plot;

    Plotly.react("plotDiv", window.plotData.data, window.plotData.layout, {
      responsive: true,
    });

    console.log("Initial scatter plot rendered");
  } catch (err) {
    console.log("Error fetching data:", err.message);
  }
}

// async function generateData() {
//   if (isGenerating || isVisualizing) return;

//   const samples = document.getElementById("numSamples").value;
//   const clusters = document.getElementById("numClusters").value;
//   const variance = document.getElementById("variance").value;

//   try {
//     const response = await fetch(apiBase + "Generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         n_Samples: samples,
//         num_Clusters: clusters,
//         variance: variance,
//       }),
//     });

//     const flaskData = await response.json();

//     // Store both plots in global variables
//     window.plotData = flaskData.plot;
//     window.dPlotData = flaskData.d_plot;

//     // Show the initial scatter plot
//     Plotly.react("plotDiv", window.plotData.data, window.plotData.layout, {
//       responsive: true,
//     });

//     console.log("Initial scatter plot rendered");
//   } catch (err) {
//     console.log("Error fetching data:", err.message);
//   }
// }
// async function generateData() {
//   let flaskData;
// const response = await fetch(apiBase + "Generate", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     n_Samples: samples,
//     num_Clusters: clusters,
//     variance: variance,
//   }),
// });

// flaskData = await response.json();

// // Store both plots in global variables
// window.plotData = flaskData.plot;     // First scatter plot
// window.dPlotData = flaskData.d_plot;  // Decision tree boundary plot

// // Show the initial scatter plot
// Plotly.react("plotDiv", window.plotData.data, window.plotData.layout, {
//   responsive: true,
// });


//   // if(isGenerating||isVisualizing) return;

  

//   // const samples = document.getElementById("numSamples").value;
//   // const clusters = document.getElementById("numClusters").value;
//   // const variance = document.getElementById("variance").value;
//   //     try{
//   //         let data;
//   //         const response=await fetch(apiBase+"Generate",{
//   //           method:'POST',
//   //           headers: {'Content-Type':'application/json' },
//   //           body: JSON.stringify({n_Samples:samples,num_Clusters:clusters,variance:variance})



//   //         })
//   //         data=await response.json()

//   //         const plotJson=data.flaskData.plot;
//   //         console.log('Plot Json:',plotJson);
//   //         Plotly.react('plotDiv', plotJson.data, plotJson.layout, {responsive: true});



//   //         console.log("plot rendered");

//   //     }
//   //     catch(err){
//   //       console.log(err.message)
//   //     }
     

  
// }

function visualizeModel() {
  const depth = document.getElementById("maxDepth").value;
  const criterion = document.getElementById("criterion").value;

  console.log("Visualizing model with:", { depth, criterion });

  // Check if plot data is loaded
  if (!window.dPlotData) {
    alert("Generate data first!");
    return;
  }

  // Show the decision boundary plot
  Plotly.react("plotDiv", window.dPlotData.data, window.dPlotData.layout, {
    responsive: true,
  });

  // Optional: show model config in data table
  // document.getElementById("dataTable").innerText +=
  //   `\nModel: depth ${depth}, criterion ${criterion}`;
}

