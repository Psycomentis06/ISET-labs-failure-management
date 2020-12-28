// Create the logic for active link
const navChildsItem = document.getElementsByClassName('header-list')[0].childNodes;
const currentPathName = window.location.pathname;
let listItem ='';
switch (currentPathName) {
    case '/':
        listItem = getnavChildElement(navChildsItem, '/');
        listItem.className = 'active';
        break;

    case '/listereclamation':
        listItem = getnavChildElement(navChildsItem, '/listereclamation');
        listItem.className = 'active';
        break;

    case '/stat':
        listItem = getnavChildElement(navChildsItem, '/stat');
        listItem.className = 'active';
        break;

    case '/login':
        listItem = getnavChildElement(navChildsItem, '/login');
        listItem.className = 'active';
        break;

    default:
        break;
}

function getnavChildElement(table, routeName) {
    for (let i = 0; i < table.length; i++) {
        let element = table[i].children;
        if (typeof(element) != "undefined" && element[0].pathname == routeName) {
                return table[i];
        }

    }
}
