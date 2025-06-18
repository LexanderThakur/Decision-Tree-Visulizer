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

function generateData() {
  const samples = document.getElementById("numSamples").value;
  const clusters = document.getElementById("numClusters").value;
  const variance = document.getElementById("variance").value;

  console.log("Generating data with:", { samples, clusters, variance });

  // Placeholder
  document.getElementById("dataTable").innerText =
    `Generated ${samples} samples with ${clusters} clusters and variance ${variance}`;
}

function visualizeModel() {
  const depth = document.getElementById("maxDepth").value;
  const criterion = document.getElementById("criterion").value;

  console.log("Visualizing model with:", { depth, criterion });

  // Placeholder
  document.getElementById("dataTable").innerText +=
    `\nModel: depth ${depth}, criterion ${criterion}`;
}
