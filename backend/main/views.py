from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
# Create your views here.



@api_view(["GET", "POST", "PUT", "DELETE"])
def service_management(request, pk=None):

    # GET
    if request.method == "GET":
        service = ServiceManagement.objects.all()
        serializer = ServiceSerializer(service, many=True)

        return Response(serializer.data)

    # POST
    if request.method == "POST":

        serializer = ServiceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # PUT
    if request.method == "PUT":

        try:
            service = ServiceManagement.objects.get(pk=pk)
        except ServiceManagement.DoesNotExist:
            return Response(
                {"error": "Service not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ServiceSerializer(
            service,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE

    if request.method == "DELETE":
        service.delete()
        return Response(
            {"message": "Service deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )



@api_view(["GET", "POST", "PUT", "DELETE"])
def appointment(request, pk=None):
    if request.method == "GET":
        appointment = Appointment.objects.all()
        serializer = AppointmentSerializer(appointment, many=True)

        return Response(serializer.data)
    
    if request.method == "POST":
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if request.method == "PUT":
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return Response(
                {"error": "Appointment not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AppointmentSerializer(
            appointment,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if request.method == "DELETE":
        appointment.delete()
        return Response(
            {"message": "Appointment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )