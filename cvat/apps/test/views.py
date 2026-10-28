from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cvat.apps.engine.models import LabeledShape, ShapeType, Task
from cvat.apps.engine.permissions import TaskPermission


class TaskClassCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        visible_tasks = TaskPermission.create_scope_list(request).filter(Task.objects.all())
        task = get_object_or_404(visible_tasks, pk=task_id)

        shapes = LabeledShape.objects.filter(job__segment__task=task)

        shape_type = request.query_params.get("type")
        if shape_type:
            if shape_type not in {t.value for t in ShapeType}:
                raise ValidationError({"type": f"Unknown shape type '{shape_type}'"})
            shapes = shapes.filter(type=shape_type)

        rows = shapes.values("label__name").annotate(count=Count("id")).order_by("-count")
        return Response([{"label": r["label__name"], "count": r["count"]} for r in rows])