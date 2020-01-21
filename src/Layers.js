export const fillStyles = {
  strategy: [
    'match',
    ['get', 'strategy_code'],
    0,
    '#C2A5CF',
    1,
    '#9970AB',
    2,
    '#A6DBA0',
    3,
    '#5AAE61',
    'grey',
  ],
  returnCount: [
    'interpolate',
    ['linear'],
    ['get', 'MRR2010'],
    0,
    '#309dae',
    100,
    '#ebf7f9',
  ],
};

export default {
  HTCLayer: {
    url: `${process.env.PUBLIC_URL}/CensusTractsAllVariables.geojson`,
    paintFill: {
      'fill-color': 'grey',
      'fill-opacity': 0.7,
    },
    paintLine: {
      'line-color': 'white',
    },
  },
};

export function BoundaryLayers() {
  const layer_list = [
    {
      id: 'cd',
      datasetName: 'Community Districts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/yfnk-k7r4?method=export&format=Shapefile',
      nameCol: 'boro_cd',
      nameAlt: null,
    },
    {
      id: 'pp',
      datasetName: 'Police Precincts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/78dh-3ptz?method=export&format=Shapefile',
      nameCol: 'precinct',
      nameAlt: null,
    },
    {
      id: 'sd',
      datasetName: 'School Districts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/r8nu-ymqj?method=export&format=Shapefile',
      nameCol: 'district',
      nameAlt: 'districtco',
    },
    {
      id: 'hc',
      datasetName: 'Health Center Districts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/b55q-34ps?method=export&format=Shapefile',
      nameCol: 'hcent_dist',
      nameAlt: null,
    },
    {
      id: 'cc',
      datasetName: 'City Council Districts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/yusd-j4xi?method=export&format=Shapefile',
      nameCol: 'coun_dist',
      nameAlt: null,
    },
    {
      id: 'nycongress',
      datasetName: 'Congressional Districts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/qd3c-zuu7?method=export&format=Shapefile',
      nameCol: 'cong_dist',
      nameAlt: null,
    },
    {
      id: 'sa',
      datasetName: 'State Assembly Districts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/pf5b-73bw?method=export&format=Shapefile',
      nameCol: 'assem_dist',
      nameAlt: null,
    },
    {
      id: 'ss',
      datasetName: 'State Senate Districts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/h4i2-acfi?method=export&format=Shapefile',
      nameCol: 'st_sen_dis',
      nameAlt: null,
    },
    {
      id: 'nta',
      datasetName: 'Neighborhood Tabulation Area',
      url:
        'http://data.cityofnewyork.us/api/geospatial/cpf4-rkhq?method=export&format=Shapefile',
      nameCol: 'ntaname',
      nameAlt: 'ntacode',
    },
    {
      id: 'bid',
      datasetName: 'Business Improvement District',
      url:
        'http://data.cityofnewyork.us/api/geospatial/ejxk-d93y?method=export&format=Shapefile',
      nameCol: 'bid',
      nameAlt: null,
    },
    /*{
      id: 'zipcode',
      datasetName: 'Zip Code',
      url: 'http://data.cityofnewyork.us/download/i8iw-xf4u/application%2Fzip',
      nameCol: 'ZIPCODE',
      nameAlt: null,
},*/
  ];

  return layer_list.map(layer => ({
    ...layer,
    paintLine: {
      'line-color': 'black',
    },
  }));
}
