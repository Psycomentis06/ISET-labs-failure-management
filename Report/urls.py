from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.Reclamation),
    path('listereclamation', views.ListReclamation),
    path('stat', views.PcStats),
    path('login', views.Login),
    path('logout', views.Logout),
    path('AddReclamation', views.AddReclamation),
    path('ViewList', views.getReportList),
    path('DeleteReport', views.RemoveReport),
    path('EditReport', views.EditReport),
    path('ViewStat', views.getPCs),
    path('ChangeStat', views.toggleComputerState),
    path('ChangeAdminPass', views.changeAdminPass),
    path('notifications', views.getNotifications),
    path('users', views.getUsers),
    path('admin_edit', views.editAdminProfile),
    path('setNotif', views.setNotifToSeen),
    path('most_reported', views.mostReportedPCs)
]