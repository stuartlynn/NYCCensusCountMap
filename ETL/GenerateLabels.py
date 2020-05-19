import pandas as pd 
import geopandas as gp

def generate_labels(boundary,id_col, how='rep'):
    result = boundary.rename(columns={id_col:'geoid'}) 
    if(how=='centroid'):
        result = result.assign(geometry=result.geometry.centroid)
    else:
        result = result.assign(geometry=result.representative_point())
    return result


community_districts = gp.read_file('../public/boundaries/cd.geojson')
city_council_districts =gp.read_file('../public/boundaries/cc.geojson')
school_districts = gp.read_file('../public/boundaries/sd.geojson')
ntas = gp.read_file('../public/boundaries/nta.geojson')
congress_assembly_districts = gp.read_file('../public/boundaries/nycongress.geojson')
senate_districts = gp.read_file('../public/boundaries/ss.geojson')
police_precincts = gp.read_file('../public/boundaries/pp.geojson')
noccs = gp.read_file('../ETL/NewData/nocc_boundaries.shp').to_crs('EPSG:4326').dropna(subset=['boro_code'])
state_assembly_districts = gp.read_file('../public/boundaries/sa.geojson').to_crs('EPSG:4326')
zipcodes = gp.read_file("../public/boundaries/zipcodes.geojson")

community_district_labels = generate_labels(community_districts,'boro_cd')
city_council_district_labels = generate_labels(city_council_districts,'coun_dist')
school_district_labels = generate_labels(school_districts,'school_dist')
nta_labels = generate_labels(ntas,'ntacode')
congress_assembly_district_labels = generate_labels(congress_assembly_districts,'cong_dist')
senate_districts_labels = generate_labels(senate_districts,'st_sen_dist')
police_precincts_labels = generate_labels(police_precincts,'precinct', how='centroid')
noccs_labels = generate_labels(noccs,'NCode')
state_assembly_district_labels = generate_labels(state_assembly_districts,'assem_dist')
zipcodes_labels = generate_labels(zipcodes,'ZIPCODE')

community_district_labels.to_file('../public/boundaries/communty_district_labels.geojson',driver='GeoJSON')
city_council_district_labels.to_file('../public/boundaries/city_council_district_labels.geojson',driver='GeoJSON')
school_district_labels.to_file('../public/boundaries/school_district_labels.geojson',driver='GeoJSON')
nta_labels.to_file('../public/boundaries/nta_labels.geojson',driver='GeoJSON')
congress_assembly_district_labels.to_file('../public/boundaries/congress_assembly_district_labels.geojson',driver="GeoJSON")
senate_districts_labels.to_file('../public/boundaries/senate_districts_labels.geojson',driver='GeoJSON')
police_precincts_labels.to_file('../public/boundaries/police_precincts_labels.geojson',driver='GeoJSON')
noccs_labels.to_file('../public/boundaries/noccs_labels.geojson',driver='GeoJSON')
state_assembly_district_labels.to_file('../public/boundaries/state_assembly_districts_labels.geojson', driver='GeoJSON')
zipcodes_labels.to_file('../public/boundaries/zipcodes_labels.geojson', driver='GeoJSON')