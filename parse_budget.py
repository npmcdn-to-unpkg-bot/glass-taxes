import os
import re
import xlrd
import json

from logger import logger

raw_data_path = './data/raw_budget_files'
json_data_path = './data/json_budget_files'

def get_budget_filenames(directory):
	filenames = os.walk(directory).next()[2]
	return filenames


def match_filename_pattern(filenames, pattern):
	for filename in filenames:
		if re.match(pattern, filename, flags=re.IGNORECASE):
			return filename


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
		header_list.append(header.strip())

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
	logger.info('successfully converted {}'.format(filename))


def load_and_save_as_json(filename):
	# load the file to memory
	book = xlrd.open_workbook(os.path.join(raw_data_path, filename))
	sheet = book.sheet_by_index(0)
	book.release_resources()

	# extract the data from the sheet
	header = parse_header(sheet)
	data = parse_data(sheet, header)

	# replace the current extension with json
	json_filename = filename.split('.')
	json_filename[-1] = 'json'
	json_filename = '.'.join(json_filename)

	# save the file to disk
	save_as_json(data,os.path.join(json_data_path,json_filename))


if __name__ == '__main__':
	filenames = get_budget_filenames(raw_data_path)
	summary_filename = match_filename_pattern(filenames, r'.*summary of receipts.*current dollars.*')
	fund_group_split_filename = match_filename_pattern(filenames, r'.*receipts.*by fund group.*')
	load_and_save_as_json(summary_filename)
	load_and_save_as_json(fund_group_split_filename)
	