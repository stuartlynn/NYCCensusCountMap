import geopandas as gp 
import pandas as pd
from shapely.geometry import Point
from pathlib import Path
from zipfile import ZipFile
import matplotlib.pyplot as plt
import json


## Load boundaries

community_districts = gp.read_file('../public/boundaries/cd.geojson')
city_council_districts =gp.read_file('../public/boundaries/cc.geojson')
school_districts = gp.read_file('../public/boundaries/sd.geojson')
ntas = gp.read_file('../public/boundaries/nta.geojson')
congress_assembly_districts = gp.read_file('../public/boundaries/nycongress.geojson')
senate_districts = gp.read_file('../public/boundaries/ss.geojson')
police_precincts = gp.read_file('../public/boundaries/pp.geojson')
noccs = gp.read_file('../public/boundaries/noccs_with_vars.geojson').to_crs('EPSG:4326')
state_assembly_districts = gp.read_file('../public/boundaries/sa.geojson').to_crs('EPSG:4326')
zipcodes = gp.read_file("../public/boundaries/zipcodes.geojson")

## Load dot layers

dot_layer_path = Path('NewData/dot_layers/')

dot_layers = {
    "HospitalsandHealthClinics_Layer":{
        "lname":"Hospitals and Rehab Centers",
        "address_cols":['Number', 'Street','City','State','Zip'],
        'name_col':'Facility_N',
        'type': 'Hospitals and Health Clinics',
        'icon':'Dot_Hospitals.png'
    },
    "FaithBasedOrganizations_Layer":{
     "lname" : "Faith-Based Organizations",
     "name_col" : "Partner",
     'type':'Faith Based Organizations',
     'icon': 'Dot_FBO.png',
     "address_cols" : [ 'Street', 'City',
       'State', 'Zip']
    },
    "CityWide Community Schools":
    { 
        "lname":"City Wide Community Schools",
        "name_col":"facname",
        "type":'Community Schools',
        "address_cols":['address','boro','zipcode'],
        'icon':'Dot_CommunitySchools.png'
    },
    
    "LGBTQOrganizations_Layer":{
        "lname": "LGBTQ Centers and Services", 
        "address_cols":['Street','City','State','Zip'], 
        'name_col':'Organizati',
        'type':"LGBTQ",
        'icon': 'Dot_LGBTQ.png'
    },
    
    "Food_kitchens_and_food_pantries":{
        "lname": "Food Kitchens and Pantries",
        "address_cols":['address','city','zipcode'],
        "type" :'Food Kitches and Pantries',
        'name_col':'facname',
        'icon':'Dot_FoodKitchens.png'
    },
    
    "Senior_Centers":{
        "lname": "Senior Centers",
        "address_cols":['address','city','zipcode'], 
        'type':'Senior Centers',
        'name_col': 'facname',
        'icon':'Dot_SeniorCenters.png'
    },
    
    "Universal_PreK":{
        "lname":"Universal Pre-K",
        "address_cols":['address','city','zipcode'],
        "type":'Universal Pre K',
        "name_col":'facname',
        "icon":'Dot_UniPreK.png'
    },

    "PUBLIC_K12": {
        "lname": "K-12 (NYC Public Schools)",
        "address_cols":['address','city','zipcode'],
        "type":"Public K12",
        "name_col":'facname',
        'icon':'Dot_K12.png'
    },
    
    "Community_centers_and_community_schools":{
        "lname": "Community Schools",
        "address_cols":['address','city','zipcode'],
        "name_col":'opname',
        'type': 'Community centers and schools',
        'icon':'Dot_CommunityCenters.png'
    },
    
    "MentalHealthOrganizations_Layer":{
        "lname": "Mental Health Services",
        "address_cols":['street_1','city','zip'],'name_col':'name_1',
        'type':'Mental Health Orgs',
        'name_col':'name_1',
        'icon':'Dot_MentalHealth.png'
    },
    
    "CommunityBasedOrganizations_Layer":{
        "lname":"Community-Based Organizations",
        "address_cols":['Street','City','Zip_1'], 
        'name_col' : 'Partner',
        'type': 'Community Based Organizations',
        'icon':'Dot_CBO.png'
    },
    
    "Public_Libraries":{
        "lname":"Public Libraries",
        "address_cols":['address','city','zipcode'], 
        'name_col':'facname',
        'type':'Libraries',
        'icon':'Dot_Libraries.png'
    }
  
}

[ {layer['lname']:  layer['icon']} for key, layer in dot_layers.items()]
tracts = gp.read_file('../public/census_tracts.geojson')

def join_address(x,cols):
    return ",".join([str(x[col]) for col in cols])

all_point_data = []

for file in dot_layers.keys():
    df = gp.read_file( dot_layer_path / (file + '.shp'))
    meta = dot_layers[file]
    df = df.rename(columns={meta['name_col']:'name'}).assign(poi_type =meta['type'])
    df = df.assign(address=df.apply(lambda x: join_address(x,meta['address_cols']),axis=1))
    df = df.assign(asset_type = meta['lname'], icon=meta['icon'])
    all_point_data.append(df[['name','asset_type','address','geometry','icon']])

## Special processing for the head start data
head_start = pd.read_csv(dot_layer_path/'HeadStartData.csv')
head_start = head_start.assign(geometry = head_start.apply(lambda x: Point(x.longitude, x.latitude),axis=1))
head_start = head_start.assign(asset_type='Head Start and Early Head Start', 
                               icon='Dot_HeadStart.png', 
                               address = head_start.apply(lambda x: ','.join([x.addressLineOne, x.city, str(x.zipFive)]),axis=1))
head_stsart = gp.GeoDataFrame(head_start[['name','asset_type','address','geometry','icon']],crs={"init":'epsg:4326'})
all_point_data.append(head_start)


## Special processing for Robin Hood layer

robinhood = pd.read_csv(dot_layer_path/'RHPartners_All.csv')
robinhood = robinhood.assign(geometry = robinhood.apply(lambda x: Point(x.Longitude, x.Latitude),axis=1))
robinhood = robinhood.assign(asset_type='Robin Hood Partners', 
                               icon='Dot_RobinHood.png', 
                               address = robinhood.apply(lambda x: ','.join([str(x['Billing Address Line 1']), str(x['Billing City']), str(x['Billing Zip/Postal Code'])]),axis=1),
                               name  = robinhood['Partner Name'])
head_stsart = gp.GeoDataFrame(robinhood[['name','asset_type','address','geometry','icon']],crs={"init":'epsg:4326'})
all_point_data.append(robinhood)

## Special processing for interfaith layer

interfaith = pd.read_csv(dot_layer_path/'InterfaithCensus2020CountCoalitionGrantees_Geocoded.csv')
interfaith = interfaith.assign(geometry = interfaith.apply(lambda x: Point(x.Longitude, x.Latitude),axis=1))
interfaith = interfaith.assign(asset_type='Faith-Based Organizations', 
                               icon='Dot_FBO.png', 
                               address = interfaith.apply(lambda x: ','.join([str(x['Address (1)']), str(x['Address (2)']), str(x['Zip Code'])]),axis=1),
                               name = "Grantee Name")
head_stsart = gp.GeoDataFrame(interfaith[['name','asset_type','address','geometry','icon']],crs={"init":'epsg:4326'})
all_point_data.append(interfaith)

## Join all the data 
pois = gp.GeoDataFrame(pd.concat(all_point_data))

## Join to get boundary ids
pois = gp.sjoin( pois, tracts[['GEOID','geometry']], op='within',how='inner').rename(columns={"GEOID":'census_tract_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, community_districts[['boro_cd','geometry']], op='within',how='inner').rename(columns={"boro_cd":'community_district_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, city_council_districts[['coun_dist','geometry']], op='within',how='inner').rename(columns={"coun_dist":'city_council_district_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, school_districts[['school_dist','geometry']], op='within',how='inner').rename(columns={"school_dist":'school_district_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, ntas[['ntacode','geometry']], op='within',how='inner').rename(columns={"ntacode":'ntaid'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, noccs[['nocc_id','geoid','geometry']], op='within',how='inner').rename(columns={"geoid":'noccs_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, congress_assembly_districts[['cong_dist','geometry']], op='within',how='inner').rename(columns={"cong_dist":'cong_dist_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, senate_districts[['st_sen_dist','geometry']], op='within',how='inner').rename(columns={"st_sen_dist":'st_sen_dist_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, police_precincts[['precinct','geometry']], op='within',how='inner').rename(columns={"precinct":'precinct_id'}).drop('index_right',axis=1)
pois = gp.sjoin( pois, zipcodes[['ZIPCODE','geometry']], op='within', how='inner').rename(columns={'ZIPCODE': 'zipcode_id'}).drop('index_right', axis=1)
## Write out the results.
pois.drop_duplicates().to_file('../public/facilities.geojson',driver='GeoJSON')