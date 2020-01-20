from urllib.request import urlretrieve
import json 
from pathlib import Path

with open("beta_nyc_boundaries.json") as f:
    boundary_meta= json.load(f)

base = Path('data/boundaries')
base.mkdir(exist_ok=True)

for boundary in boundary_meta:
    print('Downloading ', boundary['datasetName'])
    urlretrieve(boundary['url'].replace('Shapefile','geojson'), base / (boundary['id'] + ".geojson") )

