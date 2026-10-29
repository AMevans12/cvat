# Objectives

## Machine

AMD Ryzen 7 5800H, 16 GB RAM, Windows 26H2. CVAT commit I cloned: 4a09e27ff869b7aebbfdb07b29c4a34904a0221d. Data: one task with 500 COCO val2017 images, 3541 annotations in the trimmed file, which imported as 3953 shapes in CVAT.

## MO-1 Endpoint response time

What is measured: the total time for GET /api/test/tasks/1/class-counts to return, as reported by curl.

How: five requests with a token header after one discarded warm-up request, using curl's time_total. Raw output is in docs/measurements/mo1.txt. I used a token because basic auth makes Django hash the password on every request, which would have added noise.

Target: median of 5 runs at or below 150 ms. I picked it because the endpoint is one grouped query over a few thousand rows, so anything much slower would point to a mistake like an extra query. BTW this step was by local Docker stack with the dev compose override, the 500 image task, admin owner account, nothing else heavy running.The first request after a restart, tracks and tags, and the type filter aren't included.

Result: 92.6, 177.1, 97.1, 82.1 and 129.9 ms. The median is 97 ms, the spread is 82 to 177 ms. Target met. Run 2 was an outlier so i didn't checked that. These numbers include curl's connection setup, so the server's own time is a bit lower.