# mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
# (c) 2022 by TH Koeln
# Author: Andreas Schwenk contact@compiler-construction.com
# Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
# License: GPL-3.0-or-later

# this file extracts all SMPL examples from files ma1-*.mbl of repository
#   https://github.com/mathebuddy/mathebuddy-public-courses/tree/main/demo-ma1
# and writes each into a file

# we assume that the above mentioned repository is located next to the present
# repository (mathebuddy-smpl)

import glob, os

os.system('cp -r ../mathebuddy-public-courses/demo-course examples/')
os.system('cp ../mathebuddy-public-courses/demo-basic/*.mbl examples/')

path = '../mathebuddy-public-courses/demo-ma1/*.mbl'
files = sorted(glob.glob(path))
path = '../mathebuddy-public-courses/demo-ma2/*.mbl'
files += sorted(glob.glob(path))

listings = []

for file in files:
  print(file)
  f = open(file, 'r')
  lines = f.readlines()
  f.close()
  reading = False
  for line in lines:
    line = line.replace('\n', '')
    if line == '---':
      reading = not reading
      if reading:
        listings.append('')
    if reading:
      listing = listings.pop()
      listing += line + '\n'
      listings.append(listing)

for i, listing in enumerate(listings):
  listing = 'Exercise ' + str(i) + '\n################\n\n' + listing + '---\n'
  print('===== ' + str(i) + ' =====')
  print(listing)
  f = open('examples/zzz_exercise_' + str(i).zfill(3) + '.mbl', 'w')
  f.write(listing)
  f.close()
