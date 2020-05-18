import geopandas as gp 
import pandas as pd
from shapely.geometry import Point
from pathlib import Path
from zipfile import ZipFile
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime
import json
import os


tracts = gp.read_file('../public/CensusTractsAllVariables.geojson')


### Total population
total_pop = pd.read_csv('NewData/ACSDT5Y2018.B01003_TotalPopulation.csv' ,skiprows=1, dtype={'id':str})
total_pop = total_pop.rename(columns={'Estimate!!Total':'total_population'})[['id','total_population']]
total_pop['GEOID'] = total_pop['id'].str.split("US").str[-1].astype('int64')
total_pop = total_pop.drop('id',axis=1)

new_tracts = total_pop.set_index("GEOID").join(tracts[['GEOID','MRR2010','MRR20pctthreshold','strategy_code']].set_index('GEOID'),how='inner')

### Ethnicities
race = pd.read_csv('NewData/ACSDT5Y2018.B03002_race_nyc.csv' ,skiprows=1, dtype={'id':str})
race = race.rename(columns={
  'Estimate!!Total' : 'race_total',
  'Estimate!!Total!!Not Hispanic or Latino!!White alone': 'race_white',
  'Estimate!!Total!!Not Hispanic or Latino!!Black or African American alone' : 'race_black',
  'Estimate!!Total!!Not Hispanic or Latino!!American Indian and Alaska Native alone': 'race_native_american',
  'Estimate!!Total!!Not Hispanic or Latino!!Asian alone': 'race_asian',
  'Estimate!!Total!!Not Hispanic or Latino!!Native Hawaiian and Other Pacific Islander alone' : 'race_hawaiian',
 'Estimate!!Total!!Not Hispanic or Latino!!Some other race alone' : 'race_other',
    'Estimate!!Total!!Hispanic or Latino' : 'race_hispanic'
}).drop(['Geographic Area Name','Estimate!!Total!!Not Hispanic or Latino'],axis=1)

race = race.assign(GEOID=race.id.str.split('US').str[-1].astype('int64')).drop('id',axis=1).set_index("GEOID")
new_tracts = new_tracts.join(race,how='inner')


### Languages 

languages = pd.read_excel("NewData/LangSpknAtHome_NYC_CT_2013-2017[1].xlsx", skiprows=5).dropna(how='all',axis=1).dropna(how='any', axis=0)
origin_columns = languages.columns
for col in languages.columns:
    if col + ': Speak English less than "very well"' in languages.columns:
        languages[col] = languages[col] + languages[col+ ': Speak English less than "very well"']
languages = languages[[col for col in languages.columns if ': Speak English less than "very well"' not in col ]]
def boro_to_county(x):
    boro_code = x[0]
    county = {'1':'061',
             '2':'005',
             "3":'047',
             "4":'081',
             "5":'085'}[boro_code]
    return "36" + county + x[1:]
languages['BOROCT2010'] = languages["BOROCT2010"].apply(boro_to_county).astype(np.int64)
languages = languages.set_index('BOROCT2010')
languages = languages.rename(columns={'Total Population' : 'language_total_pop'})
new_tracts= new_tracts.join(languages,how='left').fillna(0)

### Foreign born

foreign_born =  pd.read_csv('NewData/ACSDT5Y2018.B05002_ForeignBorn_NYC_Updated.csv' ,skiprows=1, dtype={'id':str})
foreign_born = foreign_born.rename(columns={ 'Estimate!!Total': 'foreign_born_total',
                                            'Estimate!!Total!!Native' : 'foreign_born_native',
                                            'Estimate!!Total!!Foreign born': 'foreign_born_foreign'
                                           }).drop(['Geographic Area Name'],axis=1)
foreign_born=foreign_born.assign(GEOID=foreign_born.id.astype('int64')).set_index('GEOID').drop("id",axis=1)
new_tracts = new_tracts.join(foreign_born,how='inner')

### Renting status

own_vs_rent = pd.read_csv("NewData/ACSDT5Y2018.B25003_Tenure_OwnVSRent.csv",skiprows=1,dtype={'id':str})
own_vs_rent = own_vs_rent.rename(columns={'Estimate!!Total':'own_vs_rent_total', 
                            'Estimate!!Total!!Owner occupied':'own_vs_rent_owner',
                            'Estimate!!Total!!Renter occupied':'own_vs_rent_rent'}).drop(['Geographic Area Name'],axis=1)
own_vs_rent = own_vs_rent.assign(GEOID=own_vs_rent.id.str.split('US').str[-1].astype('int64')).drop('id',axis=1).set_index("GEOID")
own_vs_rent = own_vs_rent[['own_vs_rent_total','own_vs_rent_owner','own_vs_rent_rent']]
new_tracts = new_tracts.join(own_vs_rent,how='inner')

### Household size 

avg_household_size = pd.read_csv('NewData/ACSDT5Y2018.B25010_AvgHouseholdSize.csv',skiprows=1,dtype={'id':str})
avg_household_size = (avg_household_size.rename(columns= { 'Estimate!!Total' : 'hosehold_size_total',
                                                        'Estimate!!Total!!Owner occupied' : 'household_size_owner_occupied',
                                                        'Estimate!!Total!!Renter occupied' : 'household_size_renter_occupied'})
                                                .drop(['Geographic Area Name', 'Margin of Error!!Total', 
                                                       'Margin of Error!!Total!!Owner occupied',
                                                       'Margin of Error!!Total!!Renter occupied'],axis=1))
avg_household_size = avg_household_size.assign(GEOID=avg_household_size.id.str.split("US").str[-1].astype('int64')).drop('id',axis=1).set_index("GEOID")
new_tracts = new_tracts.join(avg_household_size,how='inner')


### Internet 

internet = pd.read_csv('NewData/ACSDT5Y2018.B28002_InternetSubscriptions_Updated.csv', skiprows=1, dtype={'id':str})
internet = internet.rename(columns={'Estimate!!Total' : 'internet_total', 'Estimate!!Total!!With an Internet subscription': 'internet_subscription',
                        'Estimate!!Total!!Internet access without a subscription': 'internet_no_subscription',
                       'Estimate!!Total!!No Internet access' : 'internet_no_access' }).drop(['Geographic Area Name'],axis=1)
internet = internet.assign(GEOID=internet.id.str.split("US").str[-1].astype('int64')).drop('id',axis=1).set_index("GEOID")
new_tracts = new_tracts.join(internet,how='inner')

### Computer access 

computer = pd.read_csv("NewData/ACSDT5Y2018.B28003_HasAComputer.csv",skiprows=1,dtype={"id":str})
cols = [ col for col in computer if '!'in col and not 'Margin' in col]
new_cols = ["computer_{}".format(col.split("!!")[-1].lower().replace(" ","_")  ) for col in cols]
computer = computer.rename(columns= dict(zip(cols,new_cols)))[['id']+new_cols]


### Ages 

age = pd.read_csv("NewData/ACSST5Y2018.S0101_Age_NYC.csv", skiprows=1,dtype={"id":str})
age = age.assign(age_total = age['Estimate!!Total!!Total population'],
          age_less_5 = age['Estimate!!Total!!Total population!!AGE!!Under 5 years'],
          age_6_15 = age['Estimate!!Total!!Total population!!AGE!!5 to 9 years']+ age['Estimate!!Total!!Total population!!AGE!!10 to 14 years'] ,
          age_16_64 = age[['Estimate!!Total!!Total population!!AGE!!10 to 14 years',
                           'Estimate!!Total!!Total population!!AGE!!15 to 19 years',
                          'Estimate!!Total!!Total population!!AGE!!20 to 24 years',
                            'Estimate!!Total!!Total population!!AGE!!25 to 29 years',
                          'Estimate!!Total!!Total population!!AGE!!30 to 34 years',
                            'Estimate!!Total!!Total population!!AGE!!35 to 39 years',
                            'Estimate!!Total!!Total population!!AGE!!40 to 44 years',
                            'Estimate!!Total!!Total population!!AGE!!45 to 49 years',
                            'Estimate!!Total!!Total population!!AGE!!50 to 54 years',
                            'Estimate!!Total!!Total population!!AGE!!55 to 59 years',
                            'Estimate!!Total!!Total population!!AGE!!60 to 64 years']].sum(axis=1),
         age_64_over = age[['Estimate!!Total!!Total population!!AGE!!65 to 69 years',
       'Estimate!!Total!!Total population!!AGE!!70 to 74 years',
       'Estimate!!Total!!Total population!!AGE!!75 to 79 years',
       'Estimate!!Total!!Total population!!AGE!!80 to 84 years',
       'Estimate!!Total!!Total population!!AGE!!85 years and over']].sum(axis=1),
           
        GEOID = age.id.astype('int64')
         ).set_index('GEOID')[['age_total','age_less_5','age_6_15','age_16_64','age_64_over']]
new_tracts=new_tracts.join(age,how='inner')

### 

income = pd.read_csv('NewData/ACSST5Y2018.S1901_IncomeHouseholds_NYC.csv',skiprows=1,dtype={
    "id":'int64'})
income = income.assign(median_income = income['Estimate!!Households!!Median income (dollars)'],
              pc_below_poverty = income[['Estimate!!Households!!Total!!Less than $10,000',
       'Estimate!!Households!!Total!!$10,000 to $14,999',
       'Estimate!!Households!!Total!!$15,000 to $24,999']].apply(pd.to_numeric,  errors='coerce').sum(axis=1))

income = income.assign(income_houses_total = income['Estimate!!Households!!Total'],
                      homes_below_poverty = income.pc_below_poverty*income['Estimate!!Households!!Total']/100.0)

income = income.assign(GEOID=income['id']).set_index('GEOID')
new_tracts= new_tracts.join(income[['median_income','pc_below_poverty','income_houses_total','homes_below_poverty']],how='inner')

### English Proficency

english_proficency = pd.read_csv("NewData/ACSST5Y2018.S1602_LimitedEnglishProficiency.csv", skiprows=1,dtype={"id":str})
english_proficency = english_proficency.assign(GEOID=english_proficency.id.str.split('US').str[-1].astype('int64')).drop('id',axis=1)
english_proficency =english_proficency.assign( 
                           english_total_households = english_proficency['Estimate!!Total!!All households'], 
                           english_english = english_proficency['Estimate!!Total!!All households'] - english_proficency['Estimate!!Limited English-speaking households!!All households'],
                           english_spanish = english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Spanish'],
                           english_european = english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Other Indo-European languages'],
                           english_asian  = english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Asian and Pacific Island languages'],
                           english_other  = english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Other languages'],
                           bilingual = ((english_proficency['Estimate!!Total!!All households!!Households speaking --!!Spanish'] - english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Spanish'])+
                                       (english_proficency['Estimate!!Total!!All households!!Households speaking --!!Other Indo-European languages'] - english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Other Indo-European languages'])+
                                       (english_proficency['Estimate!!Total!!All households!!Households speaking --!!Asian and Pacific Island languages'] - english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Asian and Pacific Island languages'])+
                                       (english_proficency['Estimate!!Total!!All households!!Households speaking --!!Other languages'] - english_proficency['Estimate!!Limited English-speaking households!!All households!!Households speaking --!!Other languages']))

)

english_proficency= english_proficency[[
    'GEOID',
    'english_total_households',
    'english_english',
    'english_spanish',
    'english_european',
    'english_asian',
    'english_other',
    'bilingual'
    ]].set_index('GEOID')

new_tracts= new_tracts.join(english_proficency,how='inner')

### Disability

disability = pd.read_csv("NewData/ACSST5Y2018.S1810_Disability_Updated.csv",skiprows=1, dtype={'GEO_ID':str})
disability=disability.assign(
    hearing_difficulty = disability['Estimate!!Total!!Subject!!DISABILITY TYPE BY DETAILED AGE!!With a hearing difficulty!!Population 18 to 64 years'],
    vision_difficulty = disability['Estimate!!Total!!Subject!!DISABILITY TYPE BY DETAILED AGE!!With a vision difficulty!!Population 18 to 64 years'],
    cognative_difficulty= disability['Estimate!!Total!!Subject!!DISABILITY TYPE BY DETAILED AGE!!With a cognitive difficulty!!Population 18 to 64 years'],
    ambulatory_difficulty = disability['Estimate!!Total!!Subject!!DISABILITY TYPE BY DETAILED AGE!!With an ambulatory difficulty!!Population 18 to 64 years'],
    self_care_difficulty = disability['Estimate!!Total!!Subject!!DISABILITY TYPE BY DETAILED AGE!!With an independent living difficulty!!Population 18 to 64 years'],
    independent_living_difficulty = disability['Estimate!!Total!!Subject!!DISABILITY TYPE BY DETAILED AGE!!With an independent living difficulty!!Population 18 to 64 years'],
)

disability = disability.assign(GEOID=disability.id.str.split("US").str[-1].astype('int64')).drop('id',axis=1).set_index("GEOID")
disability[['hearing_difficulty','vision_difficulty','cognative_difficulty','ambulatory_difficulty','self_care_difficulty','independent_living_difficulty']]
new_tracts= new_tracts.join(disability,how='inner')

## 2010 resp rate 

with open("NewData/census_2020_response_rate.json") as f:
    data = json.load(f)
    data = pd.DataFrame(data[1:],columns=data[0])
    data = data.assign(GEO_ID = data.GEO_ID.str.replace('1400000US',''), resp_2010 = pd.to_numeric(data.FSRR2010,errors='coerce'))

def translate_counts_to_2010(rates):
    relationship = pd.read_csv('~/Projects/NYC_Census_2020_response_rates/data/geo/rr_tract_rel.txt', dtype={'TRACTCE10':str, "TRACTCE20":str, 'COUNTYFP10':str, 'COUNTYFP20':str, 'GEOID10' :str, 'GEOID20': str}) 
    merged = (pd.merge(
        relationship, 
        rates.assign(
            GEO_ID_SHORT=rates.GEO_ID.str.replace('1400000US','')
        ), 
        left_on="GEOID20", 
        right_on='GEO_ID_SHORT',
        how='inner'))

    counts_for_2010 = (merged.assign(
        resp_2010 = merged.resp_2010 * merged.HUCURPCT_T10.div(100.0), 
       ).groupby('GEOID10')
        .sum()[['resp_2010']])

    counts_for_2010 = counts_for_2010.reset_index().rename(columns={"GEOID10":"GEOID"})
    return counts_for_2010
    
result = translate_counts_to_2010(data)
    
new_tracts = new_tracts.join(result.set_index(result.GEOID.astype('int'))['resp_2010'])

### Response Rates

today = datetime.today().strftime("%Y-%m-%d")

resp_rates = pd.read_csv(f'../..//NYC_Census_2020_response_rates/data/counts_adjusted_for_2010/{today}.csv')
resp_rates=resp_rates.set_index('GEOID')
new_tracts = new_tracts.join(resp_rates,how='inner')


### Historic Rate 

## Relates the 2000 census data to 2010 data
relationship_2000_to_2010_cols=[
"STATE00",
"COUNTY00",
"TRACT00",
"GEOID00",
"POP00",
"HU00",
"PART00",
"AREA00",
"AREALAND00",
"STATE10",
"COUNTY10",
"TRACT10",
"GEOID10",
"POP10",
"HU10",
"PART10",
"AREA10",
"AREALAND10",
"AREAPT",
"AREALANDPT",
"AREAPCT00PT",
"AREALANDPCT00PT",
"AREAPCT10PT",
"AREALANDPCT10PT",
"POP10PT",
"POPPCT00",
"POPPCT10",
"HU10PT",
"HUPCT00",
"HUPCT10"]

relationship_2000_to_2010 = pd.read_csv('ny36trf.txt', names=relationship_2000_to_2010_cols, dtype={'GEOID00':str, 'GEOID10':str})
relationship_2000_to_2010.head()
historic_resp  = pd.read_excel('Final2010ParticipationRates.xlsx',sheet_name='Tract&Public Housing',skiprows=3)
historic_resp=historic_resp.assign(RESP_RATE = (historic_resp['April 28']))# + historic_resp['April\n 2'])/2)
# relationship_2000_to_2010 = relationship_2000_to_2010[relationship_2000_to_2010.HUPCT10==100]
merged = pd.merge( relationship_2000_to_2010 ,  historic_resp, left_on=['COUNTY00','TRACT00'], right_on =['COUNTY','Tract'],how='inner')

merged = merged.assign(RESP_RATE = merged.RESP_RATE*merged.HUPCT10.div(100)).groupby('GEOID10').sum()
merged.index = merged.index.astype(np.int)

new_tracts = new_tracts.assign(HISTORIC_RESP_RATE = merged.RESP_RATE)



### Add geo 

all_joined = gp.GeoDataFrame(new_tracts.join(tracts.set_index('GEOID')[['geometry']],how='inner').reset_index().rename(columns={'index':"GEOID"}))
all_joined = all_joined.assign(gid=all_joined.GEOID).set_index('gid')
all_joined.to_file('../public/census_tracts.geojson',driver='GeoJSON')



### Assign IDS

def addID(feature, id_col="GEOID"):
    feature['id'] = feature['properties'][id_col]
    return feature

def assign_id_file(file):
    with open(file,'r') as f:
        features = json.load(f)
        features['features'] =[ addID(feature,'GEOID') for feature in features['features']]

    with open(file,'w') as f:
        json.dump(features,f)
assign_id_file('../public/census_tracts.geojson')


### Load back in 

all_joined = gp.read_file('../public/census_tracts.geojson')


### Load in other boundaries 

community_districts = gp.read_file('../public/boundaries/cd.geojson')
city_council_districts =gp.read_file('../public/boundaries/cc.geojson')
school_districts = gp.read_file('../public/boundaries/sd.geojson')
ntas = gp.read_file('../public/boundaries/nta.geojson')
congress_assembly_districts = gp.read_file('../public/boundaries/nycongress.geojson')
senate_districts = gp.read_file('../public/boundaries/ss.geojson')
police_precincts = gp.read_file('../public/boundaries/pp.geojson')
noccs = gp.read_file('../ETL/NewData/nocc_boundaries.shp').to_crs('EPSG:4326').dropna(subset=['boro_code'])
state_assembly_districts = gp.read_file('../public/boundaries/sa.geojson').to_crs('EPSG:4326')

noccs=noccs.assign(geoid = noccs.boro_code.astype(int).astype(str)  + noccs.NCode.str[1:] )

### Generate the data on those boundaries 

def generate_boundary_level(boundary,census_tracts,boundary_id):
    
    addative_vars = [
        'total_population', 
        'MRR2010', 
        'MRR20pctthreshold',
        'race_total', 
        'race_white', 
        'race_black',
       'race_native_american', 
        'race_asian', 
        'race_hawaiian', 
        'race_other',
       'race_hispanic', 
        'foreign_born_total', 
        'foreign_born_native',
       'foreign_born_foreign', 
        'own_vs_rent_total', 
        'own_vs_rent_owner',
       'own_vs_rent_rent',
       'internet_total', 
        'internet_subscription', 
        'internet_no_subscription',
       'internet_no_access', 
        'age_total', 
        'age_less_5', 
        'age_6_15',
       'age_16_64', 
        'age_64_over', 
        'median_income', 
        'pc_below_poverty',
       'income_houses_total', 
        'homes_below_poverty',
       'english_total_households',
       'english_english',
       'english_spanish',
       'english_european',
        'english_asian',
        'english_other',
        'bilingual',
        'language_total_pop',
        'Speak only English',
       'Speak a Language Other than English at Home', 'Spanish',
       'French (incl. Cajun)', 'Haitian', 'Italian', 'Portuguese', 'German',
       'Yiddish, Pennsylvania Dutch or other West Germanic languages', 'Greek',
       'Russian', 'Polish', 'Serbo-Croatian',
       'Ukrainian or other Slavic languages', 'Armenian',
       'Persian (incl. Farsi, Dari)', 'Gujarati', 'Hindi', 'Urdu', 'Punjabi',
       'Bengali', 'Nepali, Marathi, or other Indic languages',
       'Other Indo-European languages', 'Telugu', 'Tamil',
       'Malayalam, Kannada, or other Dravidian languages',
       'Chinese (incl. Mandarin, Cantonese)', 'Japanese', 'Korean', 'Hmong',
       'Vietnamese', 'Khmer', 'Thai, Lao, or other Tai-Kadai languages',
       'Other languages of Asia', 'Tagalog (incl. Filipino)',
       'Ilocano, Samoan, Hawaiian, or other Austronesian languages', 'Arabic',
       'Hebrew', 'Amharic, Somali, or other Afro-Asiatic languages',
       'Yoruba, Twi, Igbo, or other languages of Western Africa',
       'Swahili or other languages of Central, Eastern, and Southern Africa',
       'Navajo', 'Other Native languages of North America',
       'Other and unspecified languages',
       'resp_2010'

  
  ]

    
    intersection = gp.overlay(census_tracts,boundary).assign(area=lambda x:x.area)
    intersection = (intersection.set_index('GEOID').assign(tract_area = census_tracts.set_index("GEOID").area)
                                   .assign(tract_fraction = lambda x: x.area/x.tract_area))
    
    intersection = intersection.rename(columns={boundary_id:'geoid'})
    
    
    addative = intersection[addative_vars].apply(pd.to_numeric,errors='coerce').apply(lambda x: x * intersection.tract_fraction)
    addative = addative.assign(geoid = intersection.geoid)
    addative = addative.assign(htc_pop = addative.MRR20pctthreshold*addative.total_population)
    addative = addative.assign(CRRALL = intersection.CRRALL,
                               CRRINT = intersection.CRRINT,
                               DRRALL = intersection.DRRALL,
                               DRRINT = intersection.DRRINT,
                               HISTORIC_RESP_RATE = intersection.HISTORIC_RESP_RATE
                              )
    ## Map the response count to other polygons
    addative  =addative.assign(CRRALL =  addative.CRRALL * addative.own_vs_rent_total / 100.0 , 
                               CRRINT = addative.CRRINT * addative.own_vs_rent_total /100.0, 
                               DRRALL = addative.DRRALL * addative.own_vs_rent_total/100.0, 
                               DRRINT  = addative.DRRINT * addative.own_vs_rent_total/100.0,
                               HISTORIC_RESP_RATE = intersection.HISTORIC_RESP_RATE *addative.own_vs_rent_total/100.0
                              )
    
    addative = addative.groupby('geoid').sum()
    
    addative = addative.assign(
                               CRRALL =  addative.CRRALL*100 / addative.own_vs_rent_total , 
                               CRRINT = addative.CRRINT *100 / addative.own_vs_rent_total, 
                               DRRALL = addative.DRRALL*100 / addative.own_vs_rent_total, 
                               DRRINT  = addative.DRRINT *100 /  addative.own_vs_rent_total,
                               HISTORIC_RESP_RATE = addative.HISTORIC_RESP_RATE*100/addative.own_vs_rent_total
    )
    
    addative = gp.GeoDataFrame(addative.join(boundary.rename(columns={boundary_id:'geoid'}).set_index('geoid')[['geometry']]))
    addative = addative.reset_index()
    return addative

### Generate those files 

community_districts_with_vars = generate_boundary_level(community_districts,all_joined,'boro_cd')
city_council_district_with_vars = generate_boundary_level(city_council_districts,all_joined,'coun_dist')
school_districts_with_vars = generate_boundary_level(school_districts,all_joined,'school_dist')
ntas_with_vars = generate_boundary_level(ntas,all_joined,'ntacode')
congress_assembly_districts_with_vars = generate_boundary_level(congress_assembly_districts,all_joined,'cong_dist')
senate_districts_with_vars = generate_boundary_level(senate_districts,all_joined,'st_sen_dist')
police_precincts_with_vars = generate_boundary_level(police_precincts,all_joined,'precinct')
noccs_with_vars = generate_boundary_level(noccs,all_joined,'geoid')
noccs_with_vars = noccs_with_vars.set_index('geoid').assign(neighborhood= noccs.set_index('geoid').Neighborho, nocc_id= noccs.set_index('geoid').NCode).reset_index()
state_assembly_districts_with_vars = generate_boundary_level(state_assembly_districts,all_joined,'assem_dist')


community_districts_with_vars.to_file('../public/boundaries/community_districts_vars.geojson',driver='GeoJSON')
city_council_district_with_vars.to_file('../public/boundaries/city_council_district_with_vars.geojson',driver='GeoJSON')
school_districts_with_vars.to_file('../public/boundaries/school_districts_with_vars.geojson',driver='GeoJSON')
ntas_with_vars.to_file('../public/boundaries/ntas_with_vars.geojson',driver='GeoJSON')
congress_assembly_districts_with_vars.to_file('../public/boundaries/congress_assembly_with_vars.geojson',driver='GeoJSON')
senate_districts_with_vars.to_file('../public/boundaries/senate_districts_with_vars.geojson',driver='GeoJSON')
police_precincts_with_vars.to_file('../public/boundaries/police_precincts_with_vars.geojson', driver='GeoJSON')
noccs_with_vars.to_file('../public/boundaries/noccs_with_vars.geojson',driver='GeoJSON')
state_assembly_districts_with_vars.to_file('../public/boundaries/state_assembly_districts_with_vars.geojson',driver='GeoJSON')


### Make sure the files have ids

def addID(feature, id_col="geoid"):
    feature['id'] = feature['properties'][id_col]
    return feature
def assign_id_file(file):
    with open(file,'r') as f:
        features = json.load(f)
        features['features'] =[ addID(feature,'geoid') for feature in features['features']]

    with open(file,'w') as f:
        json.dump(features,f)
        
        
fids = [
   '../public/boundaries/community_districts_vars.geojson',
    '../public/boundaries/city_council_district_with_vars.geojson',
    '../public/boundaries/school_districts_with_vars.geojson',
    '../public/boundaries/ntas_with_vars.geojson',
    '../public/boundaries/congress_assembly_with_vars.geojson',
    '../public/boundaries/senate_districts_with_vars.geojson',
    '../public/boundaries/police_precincts_with_vars.geojson',
    '../public/boundaries/state_assembly_districts_with_vars.geojson',
    '../public/boundaries/noccs_with_vars.geojson',
 '../public/boundaries/communty_district_labels.geojson',
    '../public/boundaries/city_council_district_labels.geojson',
    '../public/boundaries/school_district_labels.geojson',
    '../public/boundaries/nta_labels.geojson',
    '../public/boundaries/congress_assembly_district_labels.geojson',
    '../public/boundaries/senate_districts_labels.geojson',
    '../public/boundaries/police_precincts_labels.geojson',
    '../public/boundaries/noccs_labels.geojson',
    '../public/boundaries/state_assembly_districts_labels.geojson'
]

for fid in fids:
    assign_id_file(fid)

