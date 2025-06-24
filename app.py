from flask import Flask,request,jsonify
import numpy as np
import plotly.express as px
import json

app=Flask(__name__)

@app.route('/',methods=['POST'])
def generat():
    data=request.get_json()

    n_samples=int(data.get('n_Samples',100))
    n_clusters=int(data.get('num_Clusters',3))
    variance=float(data.get('variance',1.0))

    samples_per_cluster=n_samples//n_clusters
    X=[]
    y=[]
    centers=[]
    for i in range(n_clusters):
        centers.append((i*4,i*4))

    for cluster in range(n_clusters):
        center=centers[cluster]
        cx=center[0]
        cy=center[1]
        for j in range(samples_per_cluster):
            x=np.random.normal(cx,variance)
            y_val=np.random.normal(cy,variance)
            X.append([x,y_val])
            y.append(cluster)

    X=np.array(X)

    fig=px.scatter(
        x=X[:,0],
        y=X[:,1],
        color=[str(label) for label in y],
        title='Generated Data'
    )
    plot_json=json.loads(fig.to_json())



    return jsonify(
        {
         "message": "Received from Node",
         "plot":plot_json,
        "samples": n_samples,
        "clusters": n_clusters,
        "variance": variance
        }
    )

if __name__ == '__main__':
    app.run(port=5000, debug=True)