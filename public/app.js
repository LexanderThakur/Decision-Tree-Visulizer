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

  if(isGenerating||isVisualizing) return;

  

  const samples = document.getElementById("numSamples").value;
  const clusters = document.getElementById("numClusters").value;
  const variance = document.getElementById("variance").value;
      try{
          let data;
          const response=await fetch(apiBase+"Generate",{
            method:'POST',
            headers: {'Content-Type':'application/json' },
            body: JSON.stringify({n_Samples:samples,num_Clusters:clusters,variance:variance})



          })
          data=await response.json()

          const plotJson=data.flaskData.plot;
          console.log('Plot Json:',plotJson);
          Plotly.react('plotDiv', plotJson.data, plotJson.layout, {responsive: true});



          console.log("plot rendered");

      }
      catch(err){
        console.log(err.message)
      }
     

  
}

function visualizeModel() {
  const depth = document.getElementById("maxDepth").value;
  const criterion = document.getElementById("criterion").value;

  console.log("Visualizing model with:", { depth, criterion });

  // Placeholder
  document.getElementById("dataTable").innerText +=
    `\nModel: depth ${depth}, criterion ${criterion}`;
}
