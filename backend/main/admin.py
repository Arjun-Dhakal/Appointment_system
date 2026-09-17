from django.contrib import admin
from .models import ServiceManagement, Appointment


@admin.register(ServiceManagement)
class ServiceManagementAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "customer_phone",
        "service",
        "appointment_date",
        "appointment_time",
        "status",
    )

    list_filter = (
        "status",
        "appointment_date",
        "service",
    )

    search_fields = (
        "customer_name",
        "customer_phone",
    )

    list_editable = (
        "status",
    )