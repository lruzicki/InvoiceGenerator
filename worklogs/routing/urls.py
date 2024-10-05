from django.urls import path
from worklogs.views import LogFileView

urlpatterns = [
    path('validate/', LogFileView.as_view(), name='validate_log_file'),
]
