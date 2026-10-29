from django.urls import path

from .views import TaskClassCountView

urlpatterns = [
    path("tasks/<int:task_id>/class-counts", TaskClassCountView.as_view()),
]