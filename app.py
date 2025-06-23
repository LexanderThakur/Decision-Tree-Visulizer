from flask import Flask,request,jsonify

app=Flask(__name__)

@app.route('/',methods=['POST'])
def generat():
    data=request.get_json()

    n_samples=int(data.get('n_Samples',100))
    n_clusters=int(data.get('num_Clusters',3))
    variance=float(data.get('variance',1.0))

    return jsonify(
        {
            "message": "Received from Node",
        "samples": n_samples,
        "clusters": n_clusters,
        "variance": variance
        }
    )

if __name__ == '__main__':
    app.run(port=5000, debug=True)