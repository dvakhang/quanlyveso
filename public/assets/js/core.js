let DISTRIBUTED = 'DISTRIBUTED'
let PREORDER = 'PREORDER'
let SUCCESS = 'SUCCESS'
let INVESTED = 'INVESTED'

jQuery.fn.fadeOutAndRemove = function(speed) {
  $(this).fadeOut(speed, function() {
    $(this).remove();
  })
}
window.selectedIndex = 0

function getMe() {
  return axios.get('/api/me').then((response) => {
    window.me = response.data
    return window.me
  })
}

function initDatatable(options, onRowClick) {
  let tbId = '#datatables'
  if (window.app && window.app.$datatable) {
    window.app.$datatable.destroy()
    $(`${tbId}`).empty()
  }

  let defaultOptions = _.assign({
    order: [
      [1, 'desc']
    ],
    iDisplayLength: 100,
    bLengthChange: false,
    columns: [],
    data: [],
  }, options)

  let $datatable = $(`${tbId}`).DataTable(defaultOptions)

  $(`${tbId} tbody`)
    .on('click', 'tr', function() {
      if (!$(this).hasClass('selected')) {
        $datatable.$('tr.selected').removeClass('selected')
        $(this).addClass('selected')
      }

      window.selectedIndex = $(`${tbId} tbody tr.selected`).index()
      if (onRowClick) {
        onRowClick(window.selectedIndex, $datatable.row(this).data())
      }
    }).on("dblclick", "tr", function() {
      if (!$(this).hasClass('selected')) {
        $datatable.$('tr.selected').removeClass('selected')
        $(this).addClass('selected')
      }

      window.selectedIndex = $(`${tbId} tbody tr.selected`).index()
      if (window.app.onRowDblClick) {
        window.app.onRowDblClick(window.selectedIndex, $datatable.row(this).data())
      }
    })

  window.app.$datatable = $datatable

  setTimeout(() => {
    $(`${tbId} tbody tr:nth-child(${window.selectedIndex + 1})`).click()
  })

  return $datatable
}

$(document).ready(function() {
  document.addEventListener('scroll', function(event) {
    let scrollTop = $(event.target).scrollTop()
    if ($(event.target).is(document)) {
      if (scrollTop < 100) {
        $("#panel-customer").css("top", "100px")
      } else {
        $("#panel-customer").css("top", `${scrollTop}px`)
      }
    }
  }, true /*Capture event*/ )
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      if ($("#panel-customer").hasClass("open")) {
        $("#panel-customer").removeClass("open").addClass("off")
      }
    }
  })
  $sidebar = $('.sidebar');
  $sidebar_img_container = $sidebar.find('.sidebar-background');

  $full_page = $('.full-page');

  $sidebar_responsive = $('body > .navbar-collapse');

  window_width = $(window).width();

  $('.switch-sidebar-image input').change(function() {
    $full_page_background = $('.full-page-background');

    $input = $(this);

    if ($input.is(':checked')) {
      if ($sidebar_img_container.length != 0) {
        $sidebar_img_container.fadeIn('fast');
        $sidebar.attr('data-image', '#');
      }

      if ($full_page_background.length != 0) {
        $full_page_background.fadeIn('fast');
        $full_page.attr('data-image', '#');
      }

      background_image = true;
    } else {
      if ($sidebar_img_container.length != 0) {
        $sidebar.removeAttr('data-image');
        $sidebar_img_container.fadeOut('fast');
      }

      if ($full_page_background.length != 0) {
        $full_page.removeAttr('data-image', '#');
        $full_page_background.fadeOut('fast');
      }

      background_image = false;
    }
  });

  $('.switch-sidebar-mini input').change(function() {
    $body = $('body');

    $input = $(this);

    if (md.misc.sidebar_mini_active == true) {
      $('body').removeClass('sidebar-mini');
      md.misc.sidebar_mini_active = false;

      $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

    } else {

      $('.sidebar .collapse').collapse('hide').on('hidden.bs.collapse', function() {
        $(this).css('height', 'auto');
      });

      $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');

      setTimeout(function() {
        $('body').addClass('sidebar-mini');

        $('.sidebar .collapse').css('height', 'auto');
        md.misc.sidebar_mini_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    var simulateWindowResize = setInterval(function() {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function() {
      clearInterval(simulateWindowResize);
    }, 1000);

  });
});