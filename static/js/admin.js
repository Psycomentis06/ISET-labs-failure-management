// read notif value set by angular because angular dosen't  have the scope to the side bar

$(document).ready( () => {

    setInterval(() => {

        const notifsNumber = localStorage.getItem('notif_numbers');
        if ( notifsNumber != undefined ) {
            // if the varible is setted by angularJs
           
            $('#notifsBadge').html(' '+notifsNumber);
        }
        

    }, 2500);


});