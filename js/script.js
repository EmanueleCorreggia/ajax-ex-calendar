$(document).ready(function () {
  //vado a stampare dei numeri che rappresentano i giorni del mese
  //parto da gennaio che ha 31 giorni

  var thisMonth = 0;
  var year = 2018;
  var baseMonth = moment(
    {
      year: year,
      month: thisMonth
    }
  );


  printMonth(baseMonth);
  printHoliday(baseMonth);

  // quando clicchiamo su next
  $('#next').click(function () {
    //dobbiamo andare avanti di un mese e chiamare la funzione che genera i guiorni e poi chiamare quella che crea le festivita

    var thisMonth = $('h1').attr('data-this-month');
    var date = moment(thisMonth).add(1, 'months');
    console.log(date);


    printMonth(date);
    printHoliday(date);
  });

  $('#prev').click(function () {
    var thisMonth = $('h1').attr('data-this-month');
    var date = moment(thisMonth).subtract(1, 'months');
    console.log(date);


    printMonth(date);
    printHoliday(date);
  });

});



// FUNCTION -----------------------

function printMonth(month) {
  $('.days').html('');
  //inseriamo h1 dinamicamente
  $('h1').text(month.format('MMMM YYYY'));
  $('h1').attr('data-this-month', month.format('YYYY-MM'));

  //quanti giorni ha il mese corrente?
  var daysInMonth = month.daysInMonth();

  // faccio un ciclo che parte da 1 fino a 31 incluso
  for (var i = 1; i <= daysInMonth ; i++) {

    var source = $('#entry-template').html();
    var template = Handlebars.compile(source);
    var context = {
      day: i,
      month: month.format('MMMM'),
      dateComplete: month.format('YYYY-MM') + '-' + addZero(i)
    };
    var html = template(context);
    $('.days').append(html);
  }
}

function addZero(num) {
  if(num < 10) {
    return '0' + num;
  }
  return num;
}


function printHoliday(month) {

  $.ajax(
    {
      url: 'https://flynn.boolean.careers/exercises/api/holidays',
      method: 'GET',
      data: {
        year: month.year(),
        month: month.month()
      },
      success: function (data) {

        var holidays = data.response;
        //prendo ogni holidays e la confronto con ogni li sul dom se quel li contiene la stessa data allora la coloro di rosso

        //ciclo sugli elementi di holidays
        for (var i = 0; i < holidays.length; i++) {
          var thisHoliday = holidays[i];

          var thisHolidayData = thisHoliday.date;


          //metodo con data attr
          $('li[data-date-complete="'+ thisHolidayData  +'"]').addClass('red');
          $('li[data-date-complete="'+ thisHolidayData  +'"]').find('.nome-festivita').append(thisHoliday.name);

        }
      },
      error: function () {
        alert('errore');
      }
    }
  );
}
