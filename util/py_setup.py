import pandas as pd
df = pd.read_excel('invtypes.xlsx')

def get_row(typeid):
    for row in df.itertuples():
        if row.typeID != typeid:
            continue
        return row;
