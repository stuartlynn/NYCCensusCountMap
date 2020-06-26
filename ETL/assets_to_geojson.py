
import os
import json
import pandas as pd


def assets_to_geojson():
    directory = os.path.dirname(os.path.abspath(__file__))
    srcpath = os.path.join(
        directory, '..', 'public', 'InteractiveMap_NewSubmissions_6-24-2020_Geocoded.csv')
    df = pd.read_csv(srcpath, encoding='utf-8')
    df.fillna('-', inplace=True)

    def row_to_feature(row):

        properties = {
            key.replace('\ufeff', ''): value
            for key, value in row.to_dict().items()
        }
        properties.pop('Longitude')
        properties.pop('Latitude')

        return {
            'type': 'Feature',
            'properties': properties,
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    row['Longitude'], row['Latitude']
                ]
            }
        }

    gj = {
        'type': 'FeatureCollection',
        'features': [
            row_to_feature(row) for idx, row in df.iterrows()]
    }
    with open('assets-06-24-2020.geojson', 'w') as f:
        json.dump(gj, f, indent=2)

if __name__ == "__main__":
    assets_to_geojson()