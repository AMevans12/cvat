from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cvat.apps.engine.models import LabeledShape, Task
from cvat.apps.engine.permissions import TaskPermission


class TaskClassCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        visible_tasks = TaskPermission.create_scope_list(request).filter(Task.objects.all())
        task = get_object_or_404(visible_tasks, pk=task_id)

        rows = (
            LabeledShape.objects.filter(job__segment__task=task)
            .values("label__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        return Response([{"label": r["label__name"], "count": r["count"]} for r in rows])