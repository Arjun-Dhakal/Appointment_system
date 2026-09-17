from django.db import models

# Create your models here.
class ServiceManagement(models.Model):
    name=models.CharField(max_length=100)
    price=models.DecimalField(max_digits=10, decimal_places=2)
    time=models.DurationField()


    def __str__(self):
        return self.name
    
STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

class Appointment(models.Model):
    customer_name=models.CharField(max_length=100)
    customer_phone=models.CharField(max_length=20)
    service=models.ForeignKey(ServiceManagement, on_delete=models.CASCADE)
    appointment_date=models.DateField()
    appointment_time=models.TimeField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    notes=models.TextField(blank=True, null=True)

    def __str__(self):
        return self.customer_name