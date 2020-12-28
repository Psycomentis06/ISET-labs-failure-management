/*
    This file is for creating the form transitions using JQuery Library
*/

// -----> functions

function switchLanguage(language){
    // switch the cookie lanfg value to the choosen one
    document.cookie = "lang="+language;
    refreshContent();
}

function readCookie(name) {
    //read a cookie by it's name
      let nameEQ = name + "=";
      let ca = document.cookie.split(';');
      for(let i=0;i < ca.length;i++) {
          let c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      document.cookie = "lang=en";
      return 0;
  }

function getLanguageData(lang){
    let dataResponse = 'gregerg';
    $.ajax({
        type: "GET",
        url: "/static/languages/"+ lang +".json",
        async: false,
        dataType: "json",
        success: function (response) {
            dataResponse =  response;
        }
    });
    return dataResponse;    
}

let shortcut_1 = "";
let shortcut_2 = "";
let ancre2Content = "";

function refreshContent(){
    // update page content (language)
    let language = readCookie("lang");
    textContent = getLanguageData(language);
    shortcut_1 = textContent[language].shortcut_1;
    shortcut_2 = textContent[language].shortcut_2;
    ancre2Content = textContent[language].platform_desc;
    // set animation messages on local storage

    localStorage.setItem("pause", textContent[language].on_pause);
    localStorage.setItem("play", textContent[language].on_play);
    localStorage.setItem("reverse", textContent[language].on_reverse);

    $('.lang').each( (index, element) => {
        // check for input elements to set the placeholder
        if (element.placeholder != undefined) {
          element.placeholder = textContent[language][$(element).attr('key')];
        }
      $(element).text(textContent[language][$(element).attr('key')]);
    });
}

// remove the preload class once the page is ready and load the data of the page
$(window).ready(() => {
    // remove body class
    $('body').removeAttr("class");
    // auto select the picked language
    let currentLang = readCookie("lang");
    $('#choose_language').val(currentLang);
    // refresh content
    refreshContent();
});

// Transitions between form parts
$('#first-form-page').click(function () {
    // form part 1 to part 2
    $('.part-one').addClass("out-part");
    $('.part-two').addClass("coming-part");
});

$('#second-form-page').click(() => {
    // form part 2 to part 3
    $('.part-two').addClass("out-part");
    $('.part-three').addClass("coming-part");
});

$('#add-report').click(() => {
    // form choice part  to part 1
    $('.choice-conatiner').addClass("fade-out");
    $('.part-one').addClass("fade-in");
});

// handle the click event of the help btn on the choice menu

$('#help').click(() => {
    $('.choice-conatiner').addClass("fade-out");
    $('.help-container').addClass("fade-in");
});

// handle the click event of the add report part on the help part

$('#help-add').click( ()=>{
    $('.help-container').addClass("fade-out");
    $('.part-one').addClass("fade-in");
});

// change content of help container after the user click on one of them 

$('.ancre1').click( () => { 
    $('#help-text-content').html(ancre2Content);
});

$('.ancre2').click( () => { 
    let textContent = "<ul><li>"+ shortcut_1 +"</li> <br>"+
     "<li>"+ shortcut_2 +"</li> </ul>";
    $('#help-text-content').html(textContent);
});




// handle the help btn on the help part

$('#help-add').hover(function () {
    // Change The btn css class on hover event
    // over
    $('#help-add').removeClass("help");
    $('#help-add').addClass("add-report");
}, function () {
    // out
    $('#help-add').addClass("help");
    $('#help-add').removeClass("add-report");
}
);

// POPUP close and open

$('#close_popup').click( () =>{
    //close
    $('.popup-wrapper').css("display", "none");
});

$('.form_valid_help_btn').click( () => { 
    //open
    $('.popup-wrapper').css("display", "block");
});


$('.popup-wrapper').click( (event) => {
    // close if the user click outside (on the black background)
    if (event.target.className == "popup-wrapper") {
        $('.popup-wrapper').css("display", "none");
    }
});

