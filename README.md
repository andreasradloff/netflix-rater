netflix-rater for Filmtipset
============================

This is a fork of https://github.com/UltraNurd/netflix-rater modified to take a json file with ratings from filmtipset.se.

Very simple Chrome extension that "imports" a large number of movie ratings into a Netflix profile by automatically clicking on stars.

**It is not my fault if you somehow destroy your Netflix account.**

Usage
-----

This was a one-off project, so there's no real interface. This assumes you have a bunch of movie ratings in the JSON format described below.

1. Download the extension code in the netflix-rater subdirectory (https://github.com/andreasradloff/netflix-rater/archive/master.zip)
2. Drop your input into that subdirectory as a file called `betyg.txt`
3. In Chrome, go to Tools > Extensions or chrome://extensions and enable Developer Mode if you haven't already
4. Click "Load unpacked extension..." and select the netflix-rater subdirectory
5. Log into Netflix and make sure the **correct** profile is selected under your account
6. Click the Netflix Rater button in the toolbar
7. Wait

The extension submits one rating every five seconds to avoid getting kicked out of Netflix. You will see a large number of tabs opening and closing. It took about two hours to import my 1400 ratings from my old account. After it's all done, you can delete the extension.

Input
-----

Go here and click on "Exportera denna lista": http://nyheter24.se/filmtipset/yourpage.cgi
You then need to convert the excel-file from filmtipset to json. Save or export the excel-file to .csv (Kommaseparerade värden) from your favorite spreadsheet program and then use this tool to convert it to json: http://www.convertcsv.com/csv-to-json.htm

The input is a simple JSON list of objects, with each object containing at least a `"url"` key containing a string URL that points to a movie on Netflix and a `"rating"` key containing an integer rating from 0 to 5, inclusive. 0 indicates "Not Interested".

An example input file is checked in under `example.txt`.
