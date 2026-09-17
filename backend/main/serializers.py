from rest_framework import serializers
from .models import *


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceManagement
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ["id", "status"]

    def validate(self, data):
        date = data.get("appointment_date")
        time = data.get("appointment_time")

        if self.instance:
            date = date or self.instance.appointment_date
            time = time or self.instance.appointment_time

        if date and time:
            qs = Appointment.objects.filter(
                appointment_date=date,
                appointment_time=time,
            )
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise serializers.ValidationError(
                    {
                        "non_field_errors": [
                            "This date and time slot is already booked."
                        ]
                    }
                )

        return data