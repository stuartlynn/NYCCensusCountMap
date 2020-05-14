"""
Consume geojson files and upload some columns to google sheets. The following
sheets are in the document.

By Census Tract
By NOCC
By School District
By Police Precinct
By Council District
By Community District
By Congressional District
By State Assembly District
By Senate District

pip install --upgrade google-api-python-client google-auth-httplib2

Ref:
    * https://api.census.gov/data/2020/dec/responserate/variables.html
    * https://stackoverflow.com/a/49965912

TODO:
    * Missing geojson file for By Census Tract
    * Missing geojson file for By Community District
    * Unclear which boundary corresponds to ntas_with_vars.geojson
    * The Google Sheets API must be activate through GCP
        * Service Account credential should be created
        * The credential json file should be specified in CREDENTIAL_FILE below
    * Spoofing data for the following columns. Wasn't sure how to map to properties.
        * Current 2020 Self-Response Rate
        * 2010 Self-Response Rate As of Today
        * 2010 Final Self-Response Rate (HTC)
        * 2020 Mail Contact Strategy
"""


import os
import json
import pandas as pd

from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.auth.credentials import Credentials

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
# TODO: Update to Hester Street's sheet id
SPREADSHEET_ID = '1w2LU4UpQIeiBLgt1rXnkVb8N4IARdQh4fzOii2ko90M'
# TODO: Create credentials on appropriate GCS account. We can use mine (amit's)
#       if needed.
CREDENTIAL_FILE = 'hester-street-census-project-f17e736d942e.json'


def main():

    filepath = os.path.realpath(__file__)
    project_directory = os.path.join(os.path.dirname(filepath), '..')
    boundaries_directory = os.path.join(
        project_directory, 'public', 'boundaries')

    datasets = [
        {
            'filename': 'noccs_with_vars.geojson',
            'sheet': 'By NOCC',
        },
        {
            'filename': 'school_districts_with_vars.geojson',
            'sheet': 'By School District'
        },
        {
            'filename': 'police_precincts_with_vars.geojson',
            'sheet': 'By Police Precinct'
        },
        {
            'filename': 'city_council_district_with_vars.geojson',
            'sheet': 'By Council District',
        },
        {
            'filename': 'congress_assembly_with_vars.geojson',
            'sheet': 'By Congressional District'
        },
        {
            'filename': 'state_assembly_districts_with_vars.geojson',
            'sheet': 'By State Assembly District'
        },
        {
            'filename': 'senate_districts_with_vars.geojson',
            'sheet': 'By Senate District'
        },
        # {
        #     'filename': 'ntas_with_vars.geojson',
        #     'sheet': None
        # },
    ]

    credential_filepath = os.path.join(project_directory, CREDENTIAL_FILE)
    credentials = service_account.Credentials.from_service_account_file(
        credential_filepath, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=credentials)
    sheet = service.spreadsheets()

    for dataset in datasets:
        gj_filepath = os.path.join(boundaries_directory, dataset['filename'])
        with open(gj_filepath) as f:
            gj = json.load(f)

        df = pd.DataFrame([
            feature['properties'] for feature in gj['features']])

        # Race statistics
        df['Total Population'] = df['total_population']
        df['Black Population'] = df['race_black'] / df['race_total']
        df['Latinx Population'] = df['race_hispanic'] / df['race_total']
        df['Asian Population'] = df['race_asian'] / df['race_total']
        df['White Population'] = df['race_white'] / df['race_total']
        df['Other Population'] = df['race_other'] / df['race_total']
        df['People of Color Population'] = ( \
            df['race_black'] + \
            df['race_native_american'] + \
            df['race_asian'] + \
            df['race_hawaiian'] + \
            df['race_other'] + \
            df['race_hispanic']) / df['race_total']

        # Internet statistics
        df['Population With Internet Access'] = df['internet_subscription'] / df['internet_total']

        # English proficiency statistics
        df['Population with Low English Proficiency'] = 1 - df['english_english'] / df['english_total_households']

        # Young age statistics
        df['Population 5 Years or Younger'] = df['age_less_5'] / df['age_total']

        # TODO: I'm unsure of the geojson property to sheet column mapping for a few columns
        df['?'] = '-'
        columns_to_export = [
            'geoid',
            '?', '?', '?', '?',
            'Total Population', 'Black Population', 'Latinx Population', 'Asian Population',
            'White Population', 'Other Population', 'People of Color Population',
            'Population With Internet Access', 'Population with Low English Proficiency',
            'Population 5 Years or Younger'
        ]

        data = {
            'values': df[columns_to_export].to_numpy().tolist()
        }
        range_name = '{}!A2:O{}'.format(dataset['sheet'], df.shape[0] + 1)

        sheet.values().update(
            spreadsheetId=SPREADSHEET_ID, range=range_name, body=data, valueInputOption='RAW').execute()
        print('Updated {}'.format(dataset['sheet']))


if __name__ == "__main__":
    main()