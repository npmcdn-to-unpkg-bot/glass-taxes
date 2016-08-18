from logger import logger
import urllib
from HTMLParser import HTMLParser
from htmlentitydefs import name2codepoint

class FederalBudgetParser(HTMLParser):
	def __init__(self):
		HTMLParser.__init__(self)
		self.tag_stack = []
		self.links = []
		self.in_anchor = False

	def handle_starttag(self, tag, attrs):
		if (len(self.tag_stack)):
			self.tag_stack.append(tag)
		elif ('id','content') in attrs:
			self.tag_stack.append(tag)
			logger.info('in content div')
		else:
			return

		if (tag=='a' and self.in_content_table()):
			self.links.append({'link':dict(attrs)['href'], 'text':u''})
			self.in_anchor = True
			logger.info('recording link {}'.format(self.links[-1]['link']))

	def handle_endtag(self, tag):
		if (len(self.tag_stack)):
			if (tag != self.tag_stack[-1]):
				# the expected closing tag did not match the actual closing tag
				raise HTMLParser.HTMLParseError
				
			self.tag_stack.pop()
			if (tag=='a'):
				self.in_anchor = False

			if (len(self.tag_stack) == 0):
				logger.info('end content div')

	def handle_entityref(self, name):
		c = unichr(name2codepoint[name])
		self.handle_data(c)

	def handle_charref(self, name):
		if name.startswith('x'):
			c = unichr(int(name[1:], 16))
		else:
			c = unichr(int(name))
		self.handle_data(c)

	def handle_data(self, data):
		if (self.in_anchor):
			self.links[-1]['text'] += unicode(data)

	def in_content_table(self):
		return 'table' in self.tag_stack

def fetch_budget():
	parser = FederalBudgetParser()

	# feed the parser the data
	fd = urllib.urlopen("https://www.whitehouse.gov/omb/budget/Historicals","test_historical_data.html")
	logger.info('got response from www.whitehouse.gov');
	parser.feed(fd.read())
	fd.close()

	# download the docs
	logger.info('fetching files')
	for link in parser.links:
		filename = u'{name}.{extension}'.format(
			name=link['text'].strip(),
			extension=link['link'].split('.')[-1]
		)
		logger.info(u'fetching {}'.format(filename))
		urllib.urlretrieve('https://www.whitehouse.gov'+link['link'],u'data/raw_budget_files/{}'.format(filename))
		logger.info('finished fetching')
	logger.info('finished fetching files')

if __name__ == "__main__":
	fetch_budget()