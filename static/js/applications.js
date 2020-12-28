/*
    This file containe all the AngularJs applications
*/

/*
    First App : liste des réclamtions
*/

let reportList = angular.module(
    'List',
    [
        // imports for angular js
        'ngAnimate', // Animation module 
        'angularUtils.directives.dirPagination' // Pagination module

    ]
    );

reportList.controller('ViewReport',['$scope', '$http', '$httpParamSerializerJQLike', ($scope, $http, $httpParamSerializerJQLike) =>{
    $scope.empty = true; // no data available
    $scope.showMorePopup = false; // disable the modal
    $scope.deletePopup = false; // disable the delete modal
    $scope.delete_request_loading = false; // dont create the loading element
    $scope.deleteSuccess = false; // don't create the sucess alert 
    $scope.deleteError = false; // don't create the error alert
    $scope.deleteWarning = false; // Warning message 
    $scope.editPopup = false; // edit
    $scope.vkey = "";
    $scope.newDescription = "";

    $scope.showMore = (subject, name, pc_name, pc_number, date, description) =>{
        // open the modal and pass the data on it
        $scope.modalValues = [subject, name, pc_name, pc_number, date, description];
        $scope.showMorePopup = true;
    };
    
    $scope.deleteReport = (email_id, email,user_id, report_id) =>{
        $scope.deleteReportModalValues = [email_id, email, user_id, report_id];
        $scope.deletePopup = true;
    };

    $scope.editReport = (email_id, email ,user_id, report_id, subject, description) => {
        $scope.editReportModalValues = [email_id, email, user_id, report_id, subject];
        $scope.newDescription = description;
        $scope.editPopup = true;
    };

    $scope.closeModal = () =>{
        // close modal and reset the modal ifs to false
        $scope.showMorePopup = false;
        $scope.deletePopup = false;
        $scope.delete_request_loading = false;
        $scope.deleteSuccess = false;
        $scope.deleteError = false;
        $scope.deleteWarning = false;
        $scope.editPopup = false;
    };

    $scope.outside = (event) => {
        // trigger if the click outside the modal close it
        const target = event.target.className;
        if (target.includes("popup-wrapper") == true){
            $scope.closeModal();
        }
    };


    // AJAX call for the data of the table

    $scope.getData = () => {
        $http({
            url: '/ViewList'
        }).then( (response) => {
            if (response.data.results.length > 0) {
                $scope.empty = false;
                $scope.results = response.data.results;
            }
        });
    };
    $scope.getStatData = () => {
        // Ajax function for stat page
        $http({
            url: '/ViewStat'
        }).then( (response) => {
            if (response.data.results.length > 0) {
                $scope.empty = false;
                $scope.results = response.data.results;
            }
        } 
    );
    };
    // Execue the ajax call once when the document is ready
    angular.element(document).ready(
            () => {
                let path = window.location.pathname;
                if (path === "/stat") {
                    $scope.getStatData();
                    // call it for first time then recall it on a loop
                    setInterval(() => {
                        $scope.getStatData();
                    }, 30000);
                    
                } else if (path == "/listereclamation") {
                    $scope.getData();
                    // call it for first time then recall it on a loop
                    setInterval(() => {
                        $scope.getData();
                    }, 30000);
                }
            }
        );

    $scope.deleteReportReq = (email_id, report_id, vkey) =>{
        $scope.delete_request_loading = true; // start the loading spinner
        $http({
            method: "POST",
            url: '/DeleteReport',
            data: $httpParamSerializerJQLike({
                'email_id': email_id,
                'report_id': report_id,
                'vkey': vkey
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then( function successCallback (response) {
            

            setTimeout( () => {

            let data = response.data;

            if(data.Valid != null){
                // set valid alert
                $scope.deleteSuccess = true;
                $scope.deleteError = false;
                $scope.deleteWarning = false;
                $scope.deleteMessage = data.Valid;
            }else if(data.Warning != null) {
                $scope.deleteWarning = true;

                $scope.deleteSuccess = false;
                $scope.deleteError = false;
                $scope.deleteMessage = data.Warning;
            }
            else{
                $scope.deleteError = true;
                $scope.deleteSuccess = false;
                $scope.deleteWarning = false;
                $scope.deleteMessage = data.Error;
            }

                $scope.delete_request_loading = false;
                $scope.getData();
            }, 1000);
        }, function errorCallback (response)  {
            $scope.deleteError = true;
            $scope.deleteSuccess = false;
            $scope.deleteWarning = false;
            $scope.deleteMessage = response.data;
            $scope.delete_request_loading = false;
        }) ;
    };

    $scope.editReportReq = (email_id, report_id, vkey, desc) =>{
        $scope.delete_request_loading = true; // start the loading spinner
        $http({
            method: "POST",
            url: '/EditReport',
            data: $httpParamSerializerJQLike({
                'email_id': email_id,
                'report_id': report_id,
                'vkey': vkey,
                'description': desc
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then( (response) => {
            

            setTimeout( () => {

            let data = response.data;

            if(data.Valid != null){
                // set valid alert
                $scope.deleteSuccess = true;
                $scope.deleteError = false;
                $scope.deleteWarning = false;
                $scope.deleteMessage = data.Valid;
            }else if(data.Warning != null) {
                $scope.deleteWarning = true;

                $scope.deleteSuccess = false;
                $scope.deleteError = false;
                $scope.deleteMessage = data.Warning;
            }
            else{
                $scope.deleteError = true;
                $scope.deleteSuccess = false;
                $scope.deleteWarning = false;
                $scope.deleteMessage = data.Error;
            }

                $scope.delete_request_loading = false;
                $scope.getData();
            }, 1000);
        }) ;
    };

    // set pc stat 

    $scope.ChangeStat = (id) => {
        $http({
            url: '/ChangeStat',
            method: 'POST',
            data: $httpParamSerializerJQLike({
                'pc_id': id
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(  function successCallback (response) {
            console.log(response);
            if (response.data.Valid != undefined) {
                $scope.getStatData();
            } else {
                alert('Change Stat Error : '+ response.data.Error);
            }
        },
        function errorCallback(response) {
            alert('Request error'+ response.data);
        }
        );
    };

}]);


/*
    Second App : admin Home
*/

let adminHome = angular.module(
    'adminHome',
    [
        // imports for angular js
        'ngAnimate', // Animation module 
        'angularUtils.directives.dirPagination', // Pagination module
        'ngRoute'
    ]
    );

    adminHome.config(function($routeProvider) {
        $routeProvider
        .when("/", {
          templateUrl : "static/angular_templates/home.html"
        })
        .when("/users", {
            templateUrl : "static/angular_templates/users.html"
        })
        .when("/reports", {
            templateUrl : "static/angular_templates/reports.html"
        })
        .when("/settings", {
            templateUrl : "static/angular_templates/settings.html"
        });
      });

      adminHome.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('%/');
        $interpolateProvider.endSymbol('/%');
      });

      adminHome.controller("adminHomeController", ['$scope', '$http', '$httpParamSerializerJQLike', ($scope, $http, $httpParamSerializerJQLike)  => {
            $scope.old_password = "";
            $scope.new_password ="";
            $scope.retype_password ="";
            $scope.new_mail ="";
            $scope.old_mail ="";
            $scope.danger_alert = false;
            $scope.danger_alert_msg = "";
            $scope.valid_alert = false;
            $scope.valid_alert_msg ="";
            $scope.change_pass_loader = false;
            $scope.change_mail_loader = false;
            $scope.notifsData = "";
            $scope.usersData = "";

            // set data to it's normal values
            $scope.close_alerts = () => {
                $scope.danger_alert = false ;
                $scope.danger_alert_msg = "";
                $scope.valid_alert = false;
                $scope.valid_alert_msg ="";
            };
            
            $scope.changePassword = (old_pass, new_pass, retype_pass) => {
                if ( new_pass != retype_pass ) {
                    $scope.danger_alert = true;
                    $scope.danger_alert_msg = "New password and retype password don\'t match";
                    return 0;
                }
                else if (new_pass.length == 0 || old_pass.length == 0 || retype_pass.length == 0) {
                    $scope.danger_alert = true;
                    $scope.danger_alert_msg = "Empty field disallowed";
                } else {
                    $scope.change_pass_loader = true; // btn spinner
                    // send Ajax request then
                    setTimeout(() => {
                        $http({
                        method: 'POST',
                        url: '/ChangeAdminPass',
                        data: $httpParamSerializerJQLike({
                            'old_pass': old_pass,
                            'new_pass': new_pass,
                            'retype_pass': retype_pass
                        }),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then( function successCallback (response) {
                        $scope.change_pass_loader = false;
                        $scope.close_alerts(); // reset html
                        // check and display msg
                        if (response.data.Valid != undefined) {
                            // valid stat
                            $scope.valid_alert = true;
                            $scope.valid_alert_msg = response.data.Valid;
                        } else {
                            $scope.danger_alert = true;
                            $scope.danger_alert_msg = response.data.Error;
                        }
                    }, function errorCallback (response) {
                        $scope.close_alerts(); // reset html
                        $scope.change_pass_loader = false;
                        $scope.danger_alert = true;
                        $scope.danger_alert_msg = "There is an error occured during this request";
                    });
                    }, 1000) ;
                }
            };
            
            $scope.getNotifications = () => {
                $http({
                    url: '/notifications'
                }).then( (response) => {
                    if (response.data.results.length > 0) {
                        $scope.empty = false;
                        $scope.results = response.data.results;
                        let newNotifs = 0;
                        let data = response.data.results;
                        for (let index = 0; index < data.length; index++) {
                            // count the new notifications
                            if (data[index].new == true) {
                                newNotifs++;
                            }
                        }
                        localStorage.setItem('notif_numbers', newNotifs); // access it with JQuery
                        $scope.notifsData = data;
                    } else {
                        $scope.noDataFound = true;
                    }
                });
            };

            $scope.getMostReported = () => {
                $http({
                    url: '/most_reported'
                }).then( function successCallback (response) {
                    if(response.data.results != undefined) {
                        // no error in ajax
                        if (response.data.results.length > 0) {
                            // there is data
                            $scope.pcsData = response.data.results;
                        }
                    }
                }, function errorCallback () {
                    return 0;
                });
            };

            $scope.getUsersReq = () => {
                $http({
                    url: '/users'
                }).then( function successCallback (response) {
                    if(response.data.results != undefined) {
                        // no error in ajax
                        if (response.data.results.length > 0) {
                            // there is data
                            $scope.usersData = response.data.results;
                        } else {
                            $scope.close_alerts();
                            $scope.danger_alert = true;
                            $scope.danger_alert_msg = response.data.Error;
                        }
                    }
                }, function errorCallback () {
                    $scope.close_alerts();
                    $scope.danger_alert = true;
                    $scope.danger_alert_msg = response.data.Error;
                });
            };

            $scope.editEmail = (new_mail, old_mail) => {
                // this function will handle edit admin mail
                $scope.close_alerts();
                $scope.change_mail_loader = true;
                if (new_mail.length == 0 || old_mail.length == 0) {
                    $scope.danger_alert = true;
                    $scope.danger_alert_msg = "Empty emails Fields please verify";
                } else {
                    $http({
                        url: '/admin_edit',
                        method: 'POST',
                        data: $httpParamSerializerJQLike({
                            'change_email': 1,
                            'old_mail': old_mail,
                            'new_email': new_mail
                        }),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then( function successCallback (response) {
                        $scope.change_mail_loader = false;
                        if (response.data.Valid != undefined) {
                            $scope.valid_alert = true;
                            $scope.valid_alert_msg = response.data.Valid;
                        } else {
                            $scope.danger_alert = true;
                            $scope.danger_alert_msg = response.data.Error;
                        }
                    }, function errorCallback (response) { 
                        $scope.change_mail_loader = false;
                        $scope.danger_alert = true;
                        $scope.danger_alert_msg = "Error during this request";
                     });
                }
                $scope.change_mail_loader = false;
            };
            
            $scope.deleteAllReports = () => {
                $http({
                    method: 'POST',
                    url: '/admin_edit',
                    data: $httpParamSerializerJQLike({
                        'delete_reports': 1,
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then( function successCallback (response) {
                    if (response.data.Valid != undefined) {
                        $scope.valid_alert = true;
                        $scope.valid_alert_msg = response.data.Valid;
                    } else {
                        $scope.danger_alert = true;
                        $scope.danger_alert_msg = response.data.Valid;
                    }
                }, function errorCallback (response) {
                    $scope.change_mail_loader = false;
                    $scope.danger_alert = true;
                    $scope.danger_alert_msg = "Error during this request";
                });
            };

            $scope.deleteAllPCs = () => {
                $http({
                    method: 'POST',
                    url: '/admin_edit',
                    data: $httpParamSerializerJQLike({
                        'delete_pc': 1,
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then( function successCallback (response) {
                    if (response.data.Valid != undefined) {
                        $scope.valid_alert = true;
                        $scope.valid_alert_msg = response.data.Valid;
                    } else {
                        $scope.danger_alert = true;
                        $scope.danger_alert_msg = response.data.Valid;
                    }
                }, function errorCallback (response) {
                    $scope.change_mail_loader = false;
                    $scope.danger_alert = true;
                    $scope.danger_alert_msg = "Error during this request";
                });
            };
               // Execue the ajax call once when the document is ready
    angular.element(document).ready(
        () => {
            let path = window.location.pathname;
            if (path === "/") {
                $scope.getNotifications();
                $scope.getUsersReq();
                $scope.getMostReported();
                // call it for first time then recall it on a loop
                setInterval(() => {
                    $scope.getNotifications();
                    $scope.getUsersReq();
                    $scope.getMostReported();
                }, 5000);
                
            }
        }
    );

    $scope.changeNotifToSeen = (id) => {
       $http({
            url: '/setNotif',
            method:'POST',
            data: $httpParamSerializerJQLike({
                'notif_id': id,
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
       }).then (function successCallback (response) {
            if (response.data.Valid != undefined) {
                $scope.getNotifications();
            }
       }, function errorCallback (response) {
           return 0;
       });
    };

    }]);

    adminHome.filter('reverse', function() {
        // pipe or filter to reverse loop
        return function(items) {
          return items.slice().reverse();
        };
      });