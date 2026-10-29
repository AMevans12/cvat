# Plan

## What I set out to do

The order of my approach was: get CVAT running and import COCO (most of the time was just waiting on the docker), build the counting endpoint, add login and access checks, build the page with the chart plus empty and error states, measure one speed target, add one filter.

## Data

First 500 images of COCO val2017, with instances_val2017.json trimmed down to those images, because CVAT's COCO import fails when the file mentions images that are not in the task. That gave 500 images and 3541 annotations in the file.

## What I decided to skip

Tracks and tags. I count shapes only, since that is what COCO produces. I also skipped video tasks.

## What changed along the way

The page was meant to live at /tasks/:id/analytics, but CVAT already has a paid-feature page on that route, so mine is at /tasks/:id/class-counts. My dev compose file needed its Postgres host port moved because a local Postgres was using 5432, which I kept out of my commits.

## Decision record

I built the endpoint as a plain Django API View and filter the task list myself with TaskPermission.create_scope_list. The approach I rejected was a ViewSet with iam_permission_class = TaskPermission, the way CVAT's own views do it, which would have enforced access automatically. I rejected it because it needs router registration and a bigger diff in code I do not own. Rejecting it cost me automatic enforcement and generated API docs, and it means my access check is a manual call that I had to test myself, which is how I found my first test run was against stale code.