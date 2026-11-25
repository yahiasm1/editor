#!/bin/bash
# one pass over the queue, then retry missing ones, 60 s between attempts
cd "$(dirname "$0")/photos"
Q=(
"commons-popovich-sideline-2010-mike-ccbysa2.jpg https://upload.wikimedia.org/wikipedia/commons/1/13/Gregg_Popovich_sideline.jpg"
"commons-shaq-dunk-suns-2009-keithallison-ccbysa2.jpg https://upload.wikimedia.org/wikipedia/commons/9/9a/O%27Neal_dunks_for_Phoenix.jpg"
"commons-quarter-2006-proof-usmint-pd.png https://upload.wikimedia.org/wikipedia/commons/d/d4/2006_Quarter_Proof.png"
"commons-rick-barry-1976-russreed-pd.jpg https://upload.wikimedia.org/wikipedia/commons/4/45/1976_Rick_Barry.jpeg"
"commons-larry-obrien-trophy-2016-erikdrost-ccby2.jpg https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Cleveland_Cavaliers_Larry_O%27Brien_Trophy_%2829407120124%29.jpg/1920px-Cleveland_Cavaliers_Larry_O%27Brien_Trophy_%2829407120124%29.jpg"
"commons-clown-nose-robertcudmore-ccbysa2.jpg https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Clown_nose.jpg/1280px-Clown_nose.jpg"
"commons-rick-barry-warriors-1976-pd.jpg https://upload.wikimedia.org/wikipedia/commons/5/5a/Rick_Barry_%E2%80%93_Warriors_%281%29.jpeg"
"commons-shaq-free-throw-heat-2005-jannene-ccby2.jpg https://upload.wikimedia.org/wikipedia/commons/9/9e/O%27NealFT.jpg"
"commons-don-nelson-warriors-2009-brokensphere-ccbysa3-1.jpg https://upload.wikimedia.org/wikipedia/commons/d/d1/Don_Nelson_at_Suns_at_Warriors_3-15-09_1.jpg"
)
for round in $(seq 1 40); do
  left=0
  for e in "${Q[@]}"; do set -- $e; [ -s "$1" ] && continue; left=1
    code=$(curl -s -A 'Mozilla/5.0' -o "$1.part" -w "%{http_code}" "$2")
    if [ "$code" = 200 ] && ! file "$1.part" | grep -q HTML; then mv "$1.part" "$1"; echo "ok $1"; else rm -f "$1.part"; fi
    sleep 60
  done
  [ $left = 0 ] && { echo ALLDONE; exit 0; }
done
echo GAVEUP
