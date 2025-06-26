from flask import Flask,request,jsonify
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

import json

app=Flask(__name__)

def class_counts(rows):
  counts={}
  for row in rows:
    lbl=row[-1]
    if lbl not in counts:
      counts[lbl]=0
    counts[lbl]+=1
  return counts

def info_gain(current_uncertainity,true_rows,false_rows):
  p = float(len(true_rows)) / (len(true_rows) + len(false_rows))


  return current_uncertainity-p * gini(true_rows) -(1-p)* gini(false_rows)

def gini(rows):
  counts=class_counts(rows)
  impurity=1
  for lbl in counts:
    impurity-= (counts[lbl]/float(len(rows))) **2
  return impurity

def partition(rows,question):
  true_rows=[]
  false_rows=[]
  for row in rows:
    if question.match(row):
      true_rows.append(row)
    else:
      false_rows.append(row)
  return true_rows,false_rows

class Question:
  def __init__(self,col,val):
    self.column=col
    self.value=val
  def match(self,row):
    value=row[self.column]
    return value>=self.value
  def __repr__(self):
    return f"Is feature {self.column} >= {self.value}?"

class Leaf:
    def __init__(self, rows):
        self.predictions = class_counts(rows)

class Decision_Node:
  def __init__(self, question, true_branch, false_branch):
    self.question = question
    self.true_branch = true_branch
    self.false_branch = false_branch


def find_best_split(rows):
  best_gain=0
  best_question=None
  current_uncertainity=gini(rows)
  n_features=len(rows[0])-1
  for col in range(n_features):
    values=set(row[col] for row in rows)
    for val in values:
      question=Question(col,val)
      true_rows,false_rows=partition(rows,question)
      if len(true_rows) ==0 or len(false_rows) ==0:
        continue
      gain=info_gain(current_uncertainity,true_rows,false_rows)
      if gain > best_gain:
        best_gain=gain
        best_question=question
  
  return best_gain,best_question



def build_tree(rows):
  gain,question=find_best_split(rows)
  
  if gain==0:
    return Leaf(rows)

  true_rows,false_rows=partition(rows,question)

  true_branch=build_tree(true_rows)
  false_branch=build_tree(false_rows)

  return Decision_Node(question,true_branch,false_branch)

def classify(node,row):
  if isinstance(node,Leaf):
    return max(node.predictions,key=node.predictions.get)
  if node.question.match(row):
    return classify(node.true_branch,row)
  else:
    return classify(node.false_branch,row)



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
    
    dataset= [X[i]+[y[i]] for i in range(len(X))]
    tree=build_tree(dataset)
    x_min,x_max=np.min(X,axis=0)[0]-1,np.max(X,axis=0)[0]+1
    y_min,y_max=np.min(X,axis=0)[1]-1,np.max(X,axis=0)[1]+1

    resolution=0.2
    xx,yy=np.meshgrid(np.arange(x_min,x_max,resolution),np.arange(y_min,y_max,resolution))

    grid_points=np.c_[xx.ravel(),yy.ravel()]

    Z=np.array([classify(tree,list(point)) for point in grid_points])
    Z=Z.reshape(xx.shape)

    contour=go.Contour(
      
        x=np.arange(x_min,x_max,resolution),
        y=np.arange(y_min,y_max,resolution),
        z=Z,
        colorscale='Viridis',
        opacity=0.5,
        showscale=False,
        contours=dict(coloring='fill')



    )
    scatter=go.Scatter(
    x=[pt[0] for pt in X],
    y=[pt[1] for pt in X],
    mode='markers',
    marker=dict(
        color=y,  
        colorscale='Viridis',  
        size=8,
        line=dict(width=1, color='black')
    ),
    name='Data Points'



    )

    fig2=go.Figure(data=[contour,scatter])
    fig2.update_layout(title='Simple Gini Decision Tree', xaxis_title='X1', yaxis_title='X2')

    

    fig = px.scatter(
    x=X[:, 0],
    y=X[:, 1],
    color=[str(label) for label in y],
    title='Generated Data',
    )
    fig.update_traces(marker=dict(size=8, opacity=0.8, line=dict(width=1, color='DarkSlateGrey')))

    

    plot_json=json.loads(fig.to_json())







    return jsonify(
        {
         "message": "Received from Node",
         "plot":plot_json,
         "d_plot":json.loads(fig2.to_json()),
        "samples": n_samples,
        "clusters": n_clusters,
        "variance": variance
        }
    )

if __name__ == '__main__':
    app.run(port=5000, debug=True)