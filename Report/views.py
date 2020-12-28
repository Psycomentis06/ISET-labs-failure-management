from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse, JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from .models import Report, User, Pc, Notification
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import  check_password, make_password
from django.contrib.auth.models import User as AdminObject
from django.core import serializers
from django.db.models import Count
from datetime import datetime


"""
Create the view for the urls and the AJAX functions and all the DB manipulation
"""

context = {
    'isAdmin': False, # Means that this is not the admin side to load the right css and js files
    'sideBar': False, # true means create the admin sidebar
    'LoginError': []
    }
def Reclamation(request):
    context['bootstrap'] = False # true mean import bootstrap framework
    if  context['isAdmin'] == True:
        context['sideBar'] = True
        context['mdbootstrap'] = True # true mean import bootstrap material
    return render(request, 'report/reclamation.html', context)

def ListReclamation(request):
    context['bootstrap'] = True
    context['sideBar'] = False
    context['mdbootstrap'] = False
    return render(request, 'report/list.html', context)

def PcStats(request):
    context['bootstrap'] = True
    context['sideBar'] = False
    context['mdbootstrap'] = False
    return render(request, 'report/stat.html', context)

def Login(request):
    context['bootstrap'] = False
    context['sideBar'] = False
    context['mdbootstrap'] = False
    # if admin logged redirect him to home

    if context['isAdmin'] == True:
        # if admin already logged redirect him from this page
        return redirect('/')
    elif context['isAdmin'] == False and len(context['LoginError']) != 0  :
        # if admin isn't logged in and Login error list contains data set it to empty
        context['LoginError'] = []
    # Check for post data

    if  request.method == 'POST':
        #check if varibles are sent correctly without  changed name from sent form
        if (request.POST.get('username') is not None):
            username = request.POST['username']
        else:
            context['LoginError'].insert(0, 'Username is missing')

        if (request.POST.get('password') is not None):
            password = request.POST['password']
        else:
            context['LoginError'].insert(0,'Password is missing')
        
        #check if varibles are empty

        if len(username) == 0 or len(password) == 0 :
            context['LoginError'].insert(0,'Username or Password is empty')
        else:
            # if data not empty check for login
            context['isAdmin'] = adminAuthentificate(username, password, request, context['LoginError'])

        if context['isAdmin'] == True:
            # if admin logged successfuly redirect him
            return redirect('/listereclamation')
        else:
            return render(request, 'report/login.html', context)

    else :

        return render(request, 'report/login.html', context)

def Logout(request):
    if context['isAdmin'] == False :
        return redirect('/listereclamation')
    
    context['isAdmin'] = False
    Logout(request)
    return redirect('/login')

"""
Those functions to handel the Http requests
"""


def AddReclamation(request):
    context = { 
        'validForm': False
     }
    
    # check the existance of vars
    if (request.POST.get('last_name') is not None):
        last_name = request.POST['last_name']
    else:
        return JsonResponse({'Error': 'Last name missing'})
    
    if (request.POST.get('first_name') is not None):
        first_name = request.POST['first_name']
    else:
        return JsonResponse({'Error': 'First name missing'})
    
    if (request.POST.get('email') is not None):
        email = request.POST['email']
    else:
        return JsonResponse({'Error': 'Email missing'})

    if (request.POST.get('phone_number') is not None):
        phone_number = request.POST['phone_number']
    else:
        return JsonResponse({'Error': 'Phone number missing'})

    if (request.POST.get('pc_name') is not None):
        pc_name = request.POST['pc_name']
    else:
        return JsonResponse({'Error': 'PC name missing'})

    if (request.POST.get('labo_name') is not None):
        labo_name = request.POST['labo_name']
    else:
        return JsonResponse({'Error': 'Labo name missing'})

    if (request.POST.get('num_pc') is not None):
        num_pc = request.POST['num_pc']
    else:
        return JsonResponse({'Error': 'Pc number missing'})

    if (request.POST.get('subject') is not None):
        subject = request.POST['subject']
    else:
        return JsonResponse({'Error': 'Subject missing'})

    if (request.POST.get('description') is not None):
        description = request.POST['description']
    else:
        return JsonResponse({'Error': 'Description missing'})

    validErrorList = []
    validList = []
    # validate last_name and first_name

    if len(first_name) >= 3 and len(last_name) >= 3 and hasNumber(first_name) == False and hasNumber(last_name) == False:
        pass
    else:
        validErrorList.append('first name error or last _name')

    # validate email

    if validMail(email):
        pass
    else:
        validErrorList.append('Email Error')

    # validate Phone number

    if len(phone_number) >= 8 and phone_number.isdigit():
        pass
    else:
        validErrorList.append('In valid phone number')

    # validate pc name

    if len(pc_name) >= 3 and len(pc_name) < 8:
        pass
    else:
        validErrorList.append('Invalid PC name')

    # validate labo name

    if len(labo_name) >= 2:
        pass
    else:
        validErrorList.append('inValid labo name')

    # validate num PC

    if num_pc.isdigit() and len(num_pc) <= 2:
        pass
    else:
        validErrorList.append('inValid pc number ')

    # validate subject
    if len(subject) >= 5:
        pass
    else:
        validErrorList.append('Invalid Subject')
    # validate description

    if len(description) > 10:
        pass
    else:
        validErrorList.append('Invalid Desc')

    # Insert the data into database

    if len(validErrorList) == 0:
        # if there is no errors
        validList.append('no errors')

        # check if the email is already exist and if it is we check if the other user data are the same
        isExist = User.objects.all().filter(email=email)
        
        list(isExist)

        if len(isExist) != 0 :
            # email already exist

            for i in isExist:
                # get data one by one
                current_fn = i.first_name
                current_ln = i.last_name
                current_pn = i.phone_number
                current_id = i.id
            
            if str(current_fn) != str(first_name) or str(current_ln) != str(last_name) or str(current_pn) != str(phone_number):
                return JsonResponse({ 'error': ' The data associated with this email are not correct' })
            else:

                #Validate PC Data and update stat
                pcExist = Pc.objects.all().filter(pc_name=pc_name, labo_name=labo_name, pc_number=num_pc)
                pcId = -1 # Defalut pc id
                list(pcExist)

                if len(pcExist) != 0 :
                    # PC exist and data is valid

                    for j in pcExist:
                        # get pc id
                        pcId = j.id
                        # update stat
                        j.stat = False
                        j.last_update = datetime.now()
                        j.save()
                else:
                    # PC not exist in database
                    return JsonResponse({ 'error': 'PC data isn\'t correct ' })


                '''
                P = Pc()
                P.pc_name = pc_name
                P.labo_name = labo_name
                P.pc_number = num_pc
                P.save()'''

                # insert Report
                R = Report()
                R.user_id_id = current_id
                R.pc_id_id = pcId
                R.report_subject = subject
                R.report_description = description
                R.save()
                user_vkey = R.vkey

                # insert notification
                print(R.id)
                N = Notification()
                N.report_id_id = R.id
                N.save()

                # send Email for user

                sendMailToUser(
                    'Report Added',
                    'Dear '+ first_name +' Thanks for using our platform and submit your report here and here we are'+
                    'Your Repport was Added successfuly and here you got you report vkey. This key is usefull if you want to remove '+
                    'or modify your Report. Note that every report has it\'s own key \n '
                    'Your Report VKey is : '+ str(user_vkey) + '\n'
                    'Report Name: '+subject+'\n Report ID: '+ str(R.id),
                    'gestionPanne@info.com',
                    email)

                validList.append(R)
                validList.append(pcId)

                context['form_validator'] = validList
                return JsonResponse({'Valid': 'Your Report added successfuly'})
        else:
        
            # mean the the data are correct So we can insert user is data

            # insert user
            U = User()
            U.first_name = first_name
            U.last_name = last_name
            U.email = email
            U.phone_number = phone_number
            U.save()

            #Validate PC Data and update stat
            pcExist = Pc.objects.all().filter(pc_name=pc_name, labo_name=labo_name, pc_number=num_pc)
            pcId = -1 # Defalut pc id
            list(pcExist)

            if len(pcExist) != 0 :
                # PC exist and data is valid

                for j in pcExist:
                    # get pc id
                    pcId = j.id
                    # update stat
                    j.stat = False
                    j.last_update = datetime.now()
                    j.save()
            else:
                # PC not exist in database
                return JsonResponse({ 'error': 'PC data isn\'t correct ' })
            '''
            P = Pc()
            P.pc_name = pc_name
            P.labo_name = labo_name
            P.pc_number = num_pc
            P.save()'''

            # insert Report
            R = Report()
            R.user_id_id = U.id
            R.pc_id_id = pcId
            R.report_subject = subject
            R.report_description = description
            R.save()
            user_vkey = R.vkey

            # insert notification

            N = Notification()
            N.report_id_id = R.id
            N.save()

            validList.append(R)
            validList.append(pcId)
            validList.append(U.id)

            # send Email for user

            sendMailToUser(
                'Report Added',
                'Dear '+ first_name +' Thanks for using our platform and submit your report here and here we are'+
                'Your Repport was Added successfuly and here you got you report vkey. This key is usefull if you want to remove '+
                'or modify your Report. Note that every report has it\'s own key \n '
                'Your Report VKey is : '+ str(user_vkey) + '\n'
                'Report Name: '+subject+'\n Report ID: '+ str(R.id),
                'gestionPanne@info.com',
                email)

            context['form_validator'] = validList

            return JsonResponse({'Valid': 'Your Report added successfuly'})
    else:
        context['form_errors'] = validErrorList

    return render(request, 'report/respond.html', context=context)




def getReportList(request):

    try:
        # Get all the data from database and return it in jason response
        data = Report.objects.select_related('user_id', 'pc_id')
        # put the data into lists
        
        data_list = []
        for value in data:

            dict_data = {
                'last_name': value.user_id.last_name,
                'first_name': value.user_id.first_name,
                'email': value.user_id.email,
                'email_id': value.user_id.id,
                'report_id': value.id,
                'pc_name': value.pc_id.pc_name,
                'labo_name': value.pc_id.labo_name,
                'pc_number': value.pc_id.pc_number,
                'subject': value.report_subject,
                'description': value.report_description,
                'date': value.report_date
            }
            # append the result of one report on a dict
            data_list.append(dict_data)

        # return JSON rsponse if the request is an AJAX
        return JsonResponse({'results': data_list})
        
        #return render(request, 'report/view_reports.html', context={'result':data_list})
       
    except Exception:
        return Exception

def getPCs(request):
    # get all pc Data and return it in JSON response
    dataQuery = Pc.objects.all()

    '''dataQueryJson = serializers.serialize('json', dataQuery)

    return HttpResponse(dataQueryJson, content_type='application/json')'''

    data_list = []
    for value in dataQuery:
        dict_data = {
            'pc_name': value.pc_name,
            'stat': value.stat,
            'last_update': value.last_update,
            'id': value.id,
            'labo_name': value.labo_name,
            'pc_number': value.pc_number,
            'registred_date': value.registred_date
        }
        # append the result of one report on a dict
        data_list.append(dict_data)

        # return JSON rsponse if the request is an AJAX
    return JsonResponse({'results': data_list})


   
@csrf_exempt # disable csrf tokens 
def EditReport(request):
    # update report
    try:

            # check values exist or not
        if request.POST.get('report_id') is not None:
            report_id = request.POST['report_id']
        else:
            return JsonResponse({'Error': 'Report id is missing'})

        if request.POST.get('email_id') is not None:
            email_id = request.POST['email_id']
        else:
            return JsonResponse({'Error': 'Email is missing'})

        if request.POST.get('vkey') is not None:
            vkey = request.POST['vkey']
        else:
            return JsonResponse({'Error': 'Verification key is missing'})

        if request.POST.get('description') is not None:
            description = request.POST['description']
            # check if the description is valid
            if len(description) < 10 :
                return JsonResponse({'Warning': 'Description must be a content not some words (more than 10 chars)'})
        else:
            return JsonResponse({'Error': 'Description is missing'})

        update_query = Report.objects.filter(user_id=email_id, vkey=vkey, id=report_id)
        updated_number = list(update_query)
        if len(updated_number) == 0:
            # no row found
            return JsonResponse({'Warning': 'The Vérification key is not Valid' })
        else :
            # update column
            for i in update_query:
                i.report_description = description
                i.save()

            return JsonResponse({'Valid': 'Report updated successfuly'})

    except Exception:

        return JsonResponse({'Error': 'An error has been occured'})


@csrf_exempt # disable csrf tokens 
def RemoveReport(request):
    # remove a report 

    try:
        
        # check values exist or not
        if request.POST.get('report_id') is not None:
            report_id = request.POST['report_id']
        else:
            return JsonResponse({'Error': 'Report id is missing'})

        if request.POST.get('email_id') is not None:
            email_id = request.POST['email_id']
        else:
            return JsonResponse({'Error': 'Email is missing'})

        if request.POST.get('vkey') is not None:
            vkey = request.POST['vkey']
        else:
            return JsonResponse({'Error': 'Verification key is missing'})

        delete_query = Report.objects.filter(user_id=email_id, vkey=vkey, id=report_id).delete()

        deleted_rows = delete_query[0] # number of deleted rows

        if deleted_rows == 0:
            # mean the vkey not valid
            return JsonResponse({'Warning': 'The Vérification key is not Valid' })
        

        return JsonResponse({'Valid': 'Report has been deleted'})
    except Exception:
        return JsonResponse({'Error': 'An error has been occured'})


@csrf_exempt # disable csrf tokens 
def toggleComputerState(request):

    # first of all check if admin is logged or not
    try :
        if context['isAdmin'] == False :
            return JsonResponse({'Error': 'Request is denied'})
        else:
            #check existance of data 

            if (request.POST['pc_id']) is not None :
                pc_id = request.POST['pc_id']
            else :
                return JsonResponse({'Error': 'ID is missing'})
            

            data = Pc.objects.all().filter(id=pc_id)
            if  len(list(data)) == 0:
                # No data found
                return JsonResponse({'Warning': 'ID is not correct'})
            else:
                # ID is valid so we will toogle the value
                for i in data:
                    if i.stat == True :
                        i.stat = False
                        i.last_update =  datetime.now()
                        i.save()
                        return JsonResponse({'Valid': 'Pc stat setted to False'})
                    else :
                        i.stat = True
                        i.last_update =  datetime.now()
                        i.save()
                        return JsonResponse({'Valid': 'Pc stat setted to True'})
    except:
        return JsonResponse({'Error': 'Pc stat server Error'})

@csrf_exempt # disable csrf tokens 
def changeAdminPass(request):

    if context['isAdmin']:
        # logged in

        # check vars existance
        if (request.POST.get('new_pass') is not None):
            new_pass = request.POST['new_pass']
        else:
            return JsonResponse({'Error': 'New password is missing'})

        if (request.POST.get('retype_pass') is not None):
            retype_pass = request.POST['retype_pass']
        else:
            return JsonResponse({'Error': 'Retype password is missing'})

        if (request.POST.get('old_pass') is not None):
            old_pass = request.POST['old_pass']
        else:
            return JsonResponse({'Error': 'Old password is missing'})

        # now check if old password is true
        try:
        # based on the documentation Django models get function throw error if there is no data in database
            newUserPass = AdminObject.objects.get(username=request.user.username)
            # check old password saved and sent
            if check_password(old_pass, request.user.password):
                # valid
                if new_pass != retype_pass:
                    # check new password matches or not with the retyped
                    return JsonResponse({'Error': 'New password dosen\'t match the retyped one '})
                else :
                    # finally we can set the password
                    newUserPass.set_password(new_pass)
                    newUserPass.save()
                    return JsonResponse({'Valid': 'Password successfuly changed you can logout now and test it '})
            else:
                # invalid password
                return JsonResponse({'Error': 'Admin is password not correctly sended'})
        except  :
            return JsonResponse({'Error': 'No Admin matches with this password'})
    else:
        return JsonResponse({'Error': 'Request denied'})

def getNotifications (request):
    
    notif = Notification.objects.select_related('report_id')

    data_list = []
    for value in notif:
        dict_data = {
            'notif_id': value.id,
            'id_report': value.report_id_id,
            'new': value.new,
            'date': value.date,
            'report_name': value.report_id.report_subject
        }
        # append the result of one report on a dict
        data_list.append(dict_data)

        # return JSON rsponse if the request is an AJAX
    return JsonResponse({'results': data_list})


def getUsers (request) :

    if context['isAdmin']:
        users = User.objects.all()

        data_list = []
        for value in users:
            dict_data = {
                'user_id': value.id,
                'first_name': value.first_name,
                'last_name': value.last_name,
                'email': value.email,
                'phone_number': value.phone_number,
                'signin_date': value.signin_date
            }
            # append the result of one report on a dict
            data_list.append(dict_data)

            # return JSON rsponse if the request is an AJAX
        return JsonResponse({'results': data_list})
    else:
        return JsonResponse({'Error': 'Need Admin previllages'})


@csrf_exempt # disable csrf tokens 
def setNotifToSeen(request):
    if context['isAdmin']: # Admin check
        if request.POST.get('notif_id') is not None:
            notif_id = request.POST['notif_id']
        else : 
            return JsonResponse({'Error': 'Notification id is missing'})

        # insert notif
        try :
            notif = Notification.objects.get(id=notif_id)
            notif.new = False
            notif.save()
            return JsonResponse({'Valid': 'Changed'})
        except :
            return JsonResponse({'Error': 'Notification not found'})

    else :
        return JsonResponse({'Error': 'Need Admin previllages'})

@csrf_exempt # disable csrf tokens 
def editAdminProfile(request):
    if context['isAdmin']:
        # change email part
        if request.POST.get('change_email') is not None:
            #getMail data
            if request.POST.get('old_mail') is not None:
                old_mail = request.POST['old_mail']
            else :
                return JsonResponse({'Error': ' Old Email missing'})
            
            if request.POST.get('new_email') is not None :
                new_mail = request.POST['new_email']
            else :
                return JsonResponse({'Error': 'New Email is missing'})
            
            #check is old mail is the  correct logged admin mail

            if request.user.email == old_mail:
                # valid mail
                if validMail(new_mail):
                    # check if new email with correct format
                    try:
                        userMail = AdminObject.objects.get(email=old_mail)
                        userMail.email = new_mail
                        userMail.save()
                        return JsonResponse({'Valid': 'Email changed successfuly'})
                    except:
                        return JsonResponse({'Error': 'Email could not be found'})
                else :
                    return JsonResponse({'Error': 'New email format is not valid'})
            else :
                return JsonResponse({'Error': 'Email could not be found'})
        elif  request.POST.get('delete_reports') is not None:
            # Admin want to remove all reports
            try :
                report = Report.objects.all().delete()
                return JsonResponse({'Valid': report+' Reports has been deleted'})
            except :
                return JsonResponse({'Error': 'Error while removing Reports'})
        elif request.POST.get('delete_pc') is not None:
            try :
                pc = Pc.objects.all().delete()
                return JsonResponse({'Valid': pc+' PCs has been removed'})
            except :
                return JsonResponse({'Error': 'Error while removing PCs'})

        else : 
            return JsonResponse({'Error': 'Data is missing'})    

    else:
        return JsonResponse({'Error': 'Need Admin previllages'})

def mostReportedPCs(request) :

    result = Report.objects.select_related('pc_id').values('pc_id').annotate(Count('pc_id'))

    return JsonResponse({'results': list(result)})



''' ****************************Functions to use**************************** '''


def hasNumber(string):
    # return true if the string contains numbers
    for char in string:
        if char.isdigit():
            return True
    return False

def validMail(string):
    # return true if the email is valid

    validServices = [
    'gmail',
    'yahoo',
    'hotmail',
    'outlook'
    ]

    spilltedWithAt = string.split('@')


    spilltedWithDot = spilltedWithAt[1].split('.')


    if len(spilltedWithAt) >= 2 and spilltedWithDot[0] in validServices:
        return True

    return False

def sendMailToUser(subject, message, AdnmiMail, UserMail):
    # this function send the user a key for the report . with this key he can delete or edit the report
    send_mail(
        subject,
        message,
        AdnmiMail,
        [UserMail],
        fail_silently=False
    )

def adminAuthentificate(username, password, request, errorList):
    # Admin authentification
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        # authentification is true
        return True
    else:
        # authentification is false
        errorList.insert(0,'  There is no Admin found with this username and password please check again!')
        return False
