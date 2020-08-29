$('.icon-menu').click(function () {
  $('.nav__list').slideToggle(200);
});

var x = window.matchMedia('(max-width: 600px)');
myFunction(x); // Call listener function at run time
x.addListener(myFunction); // Attach listener function on state changes

function myFunction(x) {
  if (x.matches) {
    // If media query matches
    $('.nav__list-link span').css({ border: 'none', padding: '0rem' });
  } else {
    $('.nav__list-link span').css({
      border: '1px solid #83939f',
      padding: '0.6rem 1.4rem',
      'border-radius': '10px',
    });
  }
}
