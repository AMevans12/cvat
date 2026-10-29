# Definition of Done

Endpoint counts: done. Total is 3953 shapes, which matches what I worked out from the COCO file (3541 annotations, but some polygons have several parts and CVAT splits them). Proof in docs/evidence/item1-class-counts.json.

Page and chart: done, see item-3-chart.png. Empty and error screens: done, see item4-empty.png and item4-error.png.

Login check: no login gives 401 (item-5-no-login-401.png). A user who can't see the task gets 404 (item5-no-access-404.txt). My first test of this gave 200 for the wrong user, and it was fixed after restarting the server.

Speed: median 97 ms over 5 runs against my 150 ms target. Raw numbers in docs/measurements/mo1.txt.

Filter by shape type: done. Polygon 3916 + mask 37 = 3953, and 37 matches the crowd annotations in COCO. See item7-sums.txt.


Known gaps: tracks and tags aren't counted, and quick dropdown changes could show an old response.