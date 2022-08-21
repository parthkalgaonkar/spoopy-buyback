import pandas as pd
import math

df = pd.read_excel('invtypes.xlsx')

jita_list = []
amarr_list = []
tax_list = []
haul_list = []
flat_list = []
discuss_list = []
jita_sell_list = []

for row in df.itertuples():
    if (not math.isnan(row._5)):
        # Amarr column blank
        # Add tax and typeid to jita_list
        jita_list.append(f'{row.typeID}\n')
        if (row._5 != 0.85):
            tax_list.append(f'{row.typeID}: {(1-row._5):.2f}\n')

    if (not math.isnan(row._8)):
        jita_sell_list.append(f'{row.typeID}\n')
        if (row._8 != 0.85):
            tax_list.append(f'{row.typeID}: {(1-row._8):.2f}\n')

    if (not math.isnan(row._4)):
        # Jita column blank
        amarr_list.append(f'{row.typeID}\n')
        if (row._4 != 0.85):
            tax_list.append(f'{row.typeID}: {(1-row._4):.2f}\n')

    if (math.isnan(row._4) and math.isnan(row._5) and math.isnan(row._6) and math.isnan(row._8)):
        # Item is not in any list.
        # TODO: Discuss with Jolly
        tax_list.append(f'{row.typeID}: 1\n')
        discuss_list.append(f'{row.typeID}: {row.typeName}\n')

    if (row._7 != 'y'):
        # Excemt from hauling
        haul_list.append(f'{row.typeID}: 0\n')

    if (not math.isnan(row._6)):
        # flat rate item
        jita_list.append(f'{row.typeID}\n')
        flat_list.append(f'{row.typeID}: {row._6}\n')

m_map = {
    'jita_list': jita_list,
    'amarr_list': amarr_list,
    'tax_list': tax_list,
    'haul_list': haul_list,
    'flat_list': flat_list,
    'discuss_list': discuss_list,
    'jita_sell_list': jita_sell_list
}

for fname, typelist in m_map.items():
    with open(fname, 'w') as outfile:
        outfile.writelines(typelist)

