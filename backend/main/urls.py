from django.urls import path,include
from .views import *


urlpatterns = [
   path("services/", service_management, name="services"),
   path("services/<int:pk>/", service_management, name="service_detail"),
   path("appointments/", appointment, name="appointments"),
   path("appointments/<int:pk>/", appointment, name="appointment_detail"),
]
