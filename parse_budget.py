import os
import re
import xlrd
import json


def get_budget_filenames(directory):
	filenames = os.walk(directory).next()[2]
	return filenames


def get_summary_file(filenames):
	summary_pattern = r'.*summary of receipts.*current dollars.*'
	for file in filenames:
		if re.match(summary_pattern,file, flags=re.IGNORECASE):
			return file


def parse_header(sheet):
	header_list = []

	# primary header
	last_primary_header = u''
	last_secondary_header = u''
	for i in range(sheet.ncols):
		current_primary_header = sheet.row(2)[i].value
		current_secondary_header = sheet.row(3)[i].value

		if (len(current_primary_header)):
			last_primary_header = current_primary_header
			last_secondary_header = u'' # reset the secondary header

		if (len(current_secondary_header)):
			last_secondary_header = current_secondary_header

		header = ' '.join([last_secondary_header, last_primary_header])
		header_list.append(header)

	return header_list


def parse_data(sheet, header):
	data = []

	def convert_data(d):
		if (x.ctype in {2,3}):
			return x.value
		elif(x.ctype == 1):
			try:
				if ('estimate' in x.value):
					m = re.search(r'(2[0-9]{3})',x.value)
					return int(m.group(0))
				return int(x.value)
			except ValueError:
				pass
		return None

	for i in range(4,sheet.nrows):
		data_point = [convert_data(x.value) for x in sheet.row(i)]
		data.append(dict(zip(header,data_point)))
			
	return data

def save_as_json(data, filename):
	with open(filename, 'w') as file:
		json.dump(data,file)


if __name__ == '__main__':
	import pprint
	pp = pprint.PrettyPrinter(indent=4)

	raw_data_path = './data/raw_budget_files'
	json_data_path = './data/json_budget_files'

	filenames = get_budget_filenames(raw_data_path)
	summary_file = get_summary_file(filenames)

	book = xlrd.open_workbook(os.path.join(raw_data_path,summary_file))
	sheet = book.sheet_by_index(0)
	book.release_resources()

	header = parse_header(sheet)
	data = parse_data(sheet, header)

	summary_json_filename = summary_file.split('.')
	print summary_json_filename
	summary_json_filename[-1] = 'json'
	summary_json_filename = '.'.join(summary_json_filename)
	save_as_json(data,os.path.join(json_data_path,summary_json_filename))
	# pp.pprint(data)