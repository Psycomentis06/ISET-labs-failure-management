from django.db import models
import random
# Create Post model

class Pc(models.Model):
    pc_name = models.CharField(max_length=15, blank=False)
    labo_name = models.CharField(max_length=15, blank=False)
    pc_number = models.IntegerField(blank=False)
    registred_date = models.DateTimeField(auto_now_add=True, blank=True)
    last_update = models.DateTimeField(auto_now_add=True, blank=True)
    stat = models.BooleanField(default=False, blank=True)

    def __str__(self):
        # set the Pc name as the default identifier for the Report model ( not the PK )
        return self.pc_name

class User(models.Model):
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=False)
    email = models.EmailField(blank=False, unique=True)
    phone_number = models.IntegerField(blank=True)
    signin_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        # set the Email as the default identifier for the Report model ( not the PK )
        return self.email

class Report(models.Model):
    user_id = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    pc_id = models.ForeignKey(Pc, on_delete=models.CASCADE, blank=True, null=True)
    report_subject = models.CharField(max_length=100, blank=False, null=False, unique=False, default='Empty Subject')
    report_description = models.TextField(max_length=2000, default='No description for this report')
    report_date = models.DateTimeField(auto_now_add=True, blank=True)
    vkey = models.IntegerField(default=random.randrange(100000, 999999, 250))

class Notification(models.Model):
    report_id = models.ForeignKey(Report, blank=False, on_delete=models.CASCADE, null=False)
    new = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)