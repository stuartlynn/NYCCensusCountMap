export const fillStyles = {
    responseRate: [
        "interpolate-lab",
        ["linear"],
        ["get", "CRRALL"],
        0.0,
        "#FFFFFF",
        100.0,
        "#8f1158"
    ],
    strategy: [
        "match",
        ["get", "strategy_code"],
        0,
        "#C2A5CF",
        1,
        "#9970AB",
        2,
        "#A6DBA0",
        3,
        "#5AAE61",
        "grey"
    ],
    blackPop: [
        "interpolate-lab",
        ["linear"],
        ["/", ["get", "race_black"], ["get", "race_total"]],
        0.0,
        "#FFFFFF",
        1.0,
        "#b93f22"
    ],
    asianPop: [
        "interpolate-lab",
        ["linear"],
        ["/", ["get", "race_asian"], ["get", "race_total"]],
        0.0,
        "#FFFFFF",
        1.0,
        "#8f1158"
    ],
    latinxPop: [
        "interpolate-lab",
        ["linear"],
        ["/", ["get", "race_hispanic"], ["get", "race_total"]],
        0.0,
        "#FFFFFF",
        1.0,
        "#cf0621"
    ],
    whitePop: [
        "interpolate-lab",
        ["linear"],
        ["/", ["get", "race_white"], ["get", "race_total"]],
        0.0,
        "#FFFFFF",
        1.0,
        "#faaf12"
    ],
    otherPop: [
        "interpolate-lab",
        ["linear"],
        ["/", ["get", "race_other"], ["get", "race_total"]],
        0.0,
        "#FFFFFF",
        1.0,
        "#00000"
    ],
    noInternetPC: [
        "interpolate-lab",
        ["linear"],
        ["/", ["get", "internet_no_access"], ["get", "internet_total"]],
        0.0,
        "#FFFFFF",
        1.0,
        "#faaf12"
    ],
    englishProficency: [
        "interpolate-lab",
        ["linear"],
        [
            "-",
            1,
            [
                "/",
                ["get", "english_english"],
                ["get", "english_total_households"]
            ]
        ],
        0.0,
        "#FFFFFF",
        1.0,
        "#faaf12"
    ],
    under5: [
        "interpolate-lab",
        ["linear"],
        ["/", ["get", "age_less_5"], ["get", "age_total"]],
        0.0,
        "#FFFFFF",
        0.1,
        "#faaf12"
    ],
    returnCount: [
        "step",
        ["get", "MRR2010"],
        "#b95356",
        60,
        "#ee5658",
        65,
        "#ecbaa8",
        70,
        "#f9bd53",
        73,
        ["rgba", 0, 0, 0, 0]
    ]
};

export default {
    HTCLayer: {
        //url: `${process.env.PUBLIC_URL}/CensusTractsAllVariables.geojson`,
        url: `${process.env.PUBLIC_URL}/census_tracts.geojson`,
        paintFill: {
            "fill-color": "grey",
            "fill-opacity": 0.7
        },
        paintLine: {
            "line-color": [
                "case",
                [
                    "boolean",
                    ["coalesce", ["feature-state", "selected"], false],
                    true
                ],
                "red",
                "white"
            ],
            "line-width": [
                "case",
                [
                    "boolean",
                    ["coalesce", ["feature-state", "selected"], false],
                    true
                ],
                3,
                1
            ]
        }
    },
    EarlyNRFU: {
        url: `${process.env.PUBLIC_URL}/boundaries/EarlyNRFULocations.geojson`,
        paintFill: {
            "fill-color": "blue",
            "fill-opacity": 0.7
        }
    }
};

export function BoundaryLayers() {
    const layer_list = [
        {
            id: "NOCCs",
            datasetName: "NOCCS",
            polygons: "noccs_with_vars.geojson",
            labels: "noccs_labels.geojson",
            url:
                "http://data.cityofnewyork.us/api/geospatial/cpf4-rkhq?method=export&format=Shapefile",
            nameCol: "ntaname",
            nameAlt: "ntacode"
        },
        {
            id: "sd",
            datasetName: "School Districts",
            polygons: "school_districts_with_vars.geojson",
            labels: "school_district_labels.geojson",
            url:
                "http://data.cityofnewyork.us/api/geospatial/r8nu-ymqj?method=export&format=Shapefile",
            nameCol: "district",
            nameAlt: "districtco"
        },
        {
            id: "police_precincts",
            datasetName: "Police Precincts",
            polygons: "police_precincts_with_vars.geojson",
            labels: "police_precincts_labels.geojson",
            url:
                "http://data.cityofnewyork.us/api/geospatial/yusd-j4xi?method=export&format=Shapefile",
            nameCol: "geoid",
            nameAlt: null
        },
        {
            id: "cd",
            datasetName: "Community Districts",
            polygons: "community_districts_vars.geojson",
            labels: "communty_district_labels.geojson",
            url:
                "http://data.cityofnewyork.us/api/geospatial/yfnk-k7r4?method=export&format=Shapefile",
            nameCol: "boro_cd",
            nameAlt: null
        },
        {
            id: "cc",
            datasetName: "City Council Districts",
            polygons: "city_council_district_with_vars.geojson",
            labels: "city_council_district_labels.geojson",
            url:
                "http://data.cityofnewyork.us/api/geospatial/yusd-j4xi?method=export&format=Shapefile",
            nameCol: "coun_dist",
            nameAlt: null
        },
        {
            id: "congress_districts",
            datasetName: "Congressional Districts",
            polygons: "congress_assembly_with_vars.geojson",
            labels: "congress_assembly_district_labels.geojson",
            url:
                "http://data.cityofnewyork.us/api/geospatial/yusd-j4xi?method=export&format=Shapefile",
            nameCol: "geoid",
            nameAlt: null
        },
        {
            id: "senate_districts",
            datasetName: "Senate Districts",
            polygons: "senate_districts_with_vars.geojson",
            labels: "senate_districts_with_vars.geojson",
            url:
                "http://data.cityofnewyork.us/api/geospatial/yusd-j4xi?method=export&format=Shapefile",
            nameCol: "st_sen_dist",
            nameAlt: null
        }
        /*{
      id: 'pp',
      datasetName: 'Police Precincts',
      url:
        'http://data.cityofnewyork.us/api/geospatial/78dh-3ptz?method=export&format=Shapefile',
      nameCol: 'precinct',
      nameAlt: null,
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
            "line-color": "black"
        }
    }));
}
