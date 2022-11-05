import pandas as pd
from jinja2 import Environment, FileSystemLoader, select_autoescape
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
        jita_list.append(f'{row.typeID}')
        if (row._5 != 0.85):
            tax_list.append(f'{row.typeID}: {(1-row._5):.2f}')

    if (not math.isnan(row._8)):
        jita_sell_list.append(f'{row.typeID}')
        if (row._8 != 0.85):
            tax_list.append(f'{row.typeID}: {(1-row._8):.2f}')

    if (not math.isnan(row._4)):
        # Jita column blank
        amarr_list.append(f'{row.typeID}')
        if (row._4 != 0.85):
            tax_list.append(f'{row.typeID}: {(1-row._4):.2f}')

    if (math.isnan(row._4) and math.isnan(row._5) and math.isnan(row._6) and math.isnan(row._8)):
        # Item is not in any list.
        # TODO: Discuss with Jolly
        tax_list.append(f'{row.typeID}: 1')
        discuss_list.append(f'{row.typeID}: {row.typeName}')

    if (row._7 != 'y'):
        # Excemt from hauling
        haul_list.append(f'{row.typeID}: 0')

    if (not math.isnan(row._6)):
        # flat rate item
        jita_list.append(f'{row.typeID}')
        flat_list.append(f'{row.typeID}: {row._6}')

m_map = {
    'jita_list': jita_list,
    'amarr_list': amarr_list,
    'tax_list': tax_list,
    'haul_list': haul_list,
    'flat_list': flat_list,
    'discuss_list': discuss_list,
    'jita_sell_list': jita_sell_list
}

outfiles = [
    'deductions.js',
    'flat_rates.js',
    'market_lists.js'
]

env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(),
    trim_blocks=True,
    lstrip_blocks=True
)
for outfile in outfiles:
    tmplt = env.get_template(f'{outfile}.jinja2')
    file_content = tmplt.render(m_map)
    with open(outfile, 'w') as of:
        of.writelines(file_content)
