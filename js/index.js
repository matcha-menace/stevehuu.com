// displaying header
var isHeaderAnimating = false;
var isHeaderDisplaying = true;
function dHeader(time) {
  isHeaderAnimating = true;
  $("header").animate({ top: "0" }, time);
  $("#game-nav-horizontal").animate({ top: "0px" }, time);
  setTimeout(function () {
    isHeaderAnimating = false;
    isHeaderDisplaying = true;
    $("#game-nav-horizontal").attr("style", "position: default;");
  }, time);
}
function undHeader(time) {
  isHeaderAnimating = true;
  $("header").animate({ top: "-80px" }, time);

  if (isHeaderDisplaying) {
    $("#game-nav-horizontal").attr("style", "position: relative;");
    $("#game-nav-horizontal").animate({ top: "-80px" }, time);
  }
  else {
    $("#game-nav-horizontal").attr("style", "position: relative; top: -80px;");
  }
  setTimeout(function () {
    isHeaderAnimating = false;
    isHeaderDisplaying = false;
  }, time);
}

// loader
function loading() {
  setTimeout(showPage, 500);
}
function showPage() {
  $(".loader").css("display", "none");
  $(".loader-text").css("display", "none");
  $(".loaded-content").css("display", "block");
}

$(() => {
  $("._footer").load("/master_htmls/footer.html", function () {
    $(".back-to-top").load("/master_htmls/back-to-top.html").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 100);
    });
  });

  // mobile header
  var prevScrollpos = window.scrollY;
  var headerDiv = document.querySelector("header");
  var headerBottom = headerDiv.offsetTop + headerDiv.offsetHeight + 200;
  window.onscroll = function () {
    var onMobile = window.matchMedia("(max-width: 1319px)").matches;
    // ad
    if (
      document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150
    ) {
      $(".back-to-top").fadeIn(100);
    } else {
      $(".back-to-top").fadeOut(100);
    }
    // ad
    if (
      (document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100) &&
      !adViewed && !onMobile
    ) {
      $("#index-ad").fadeIn(300);
    }

    // mobile header
    if (onMobile) {
      var currentScrollPos = window.scrollY;
      if (prevScrollpos > currentScrollPos || currentScrollPos < headerBottom) {
        if (!isHeaderAnimating) {
          dHeader(100)
        }
      }
      else {
        if (!isHeaderAnimating) {
          undHeader(250)
        }
      }
      prevScrollpos = currentScrollPos;
    }
  }

  // make sure header displays if resized out of mobile mode
  $(window).on('resize', function () {
    var onMobile = window.matchMedia("(max-width: 1319px)").matches;
    if (!onMobile) {
      if (!isHeaderDisplaying) {
        dHeader(0)
      }
    }
    else {
      adViewed = true;
      $("#index-ad").fadeOut(100);
    }
  });
});

function LoadSvgs() {
  $("._svg-steam").load("/master_htmls/svg/svg-steam.html");
  $("._svg-itch").load("/master_htmls/svg/svg-itch.html");
  $("._svg-new-window").load("/master_htmls/svg/svg-new-window.html");
  $("._svg-down").load("/master_htmls/svg/svg-down.html");
}

function PageSetup(showSocial, currentPageNavLink, isCat) {
  $("._header").load("/master_htmls/header.html", function () {
    $(".social-bar").load("/master_htmls/social-bar.html")
    $(currentPageNavLink).attr("class", showSocial ? "nav-game current-page" : "nav-link current-page");
    $("#header-social").addClass(showSocial ? "" : "d-md-none");
    $("#header-cat").addClass(isCat ? "" : "d-none");
    $("#header-stuff").addClass(isCat ? "d-none" : "");
    LoadSvgs();
    // stuff logo animation
    $("#header-stuff").mouseenter(function () {
      $("#header-stuff img").animate({
        width: "+=10",
        height: "+=10"
      }, 100,)
    }).mouseleave(function () {
      $("#header-stuff img").animate({
        width: "-=10",
        height: "-=10"
      }, 100,)
    })
  });
};

function GameInfoSetup(gameTitle, gameTime, gameEngine, gameContext, gameRole, gameDescription,
  hasGamePlayButton, gamePlayButtonLink, gamePlayButtonIcon, leftLink, rightLink,
  uniqueColor
) {
  $("._game-info").load("/master_htmls/game-info-card.html", function () {
    $('.game-h1').html(gameTitle);
    $('.game-time').html(gameTime);
    $('.game-engine').html(gameEngine);
    $('.game-context').html(gameContext);
    $('.game-role').html(gameRole);
    $('.game-description').html(gameDescription);
    $('.game-play-button-div').removeClass(hasGamePlayButton ? "d-none" : '');
    $('.game-play-link').attr('href', gamePlayButtonLink);
    $('.game-play-icon').addClass(gamePlayButtonIcon == 0 ? '_svg-steam' : '_svg-itch');
    $('.game-h1').attr('style', `text-shadow: 0px 4px 8px ${uniqueColor}`)
    GamePageSetup(leftLink, rightLink)
    LoadSvgs()
  })
}

function GamePageSetup(left, right) {
  $("._page-buttons").load("/master_htmls/page-buttons.html", function () {
    $(".pb-left").attr("href", left == "none" ? "#" : left);
    $(".pb-right").attr("href", right == "none" ? "#" : right);
    if (left == "none") { $(".pb-left").removeAttr('href').addClass("disabled") };
    if (right == "none") { $(".pb-right").removeAttr('href').addClass("disabled") };
  });
};

function GamePageTabs(htmlList) {
  const gamePostButtons = $(".game-pages-nav-button").toArray();
  let allPages = '';
  $.each(htmlList, function (i, pg) {
    $.get(pg, function (text) {
      allPages += `<div class='game-page-${i} d-none'>` + text + "</div>"
      $("#game-content").html(allPages)
      $(`.game-page-0`).removeClass('d-none')
    }, 'html')
  })


  $(gamePostButtons[0]).addClass("active-game-page").addClass("flex-fill").addClass("disabled")

  $.each(gamePostButtons, function (i, btn) {
    $(btn).click(function () {
      $.each(gamePostButtons, function (i, btn) {
        $(btn).removeClass("active-game-page").removeClass("flex-fill").removeClass("disabled")
        $(`.game-page-${i}`).addClass('d-none')
      })
      $(btn).addClass("active-game-page").addClass("flex-fill").addClass("disabled")
      $(`.game-page-${i}`).removeClass('d-none')
      $("html, body").animate({ scrollTop: 0 }, 100);
      LoadSvgs()
    })
  })
}

function LoadGameTabs() {
  const gameTabs = $(".game-tab").toArray();
  console.log(gameTabs)

  let time = 0;
  var doLoad = setTimeout(() => {
    $.each(gameTabs, function (i, tab) {
      setTimeout(() => {
        $(tab).fadeIn(250);
      }, time);
      time += 150;
    });
  }, 50);
}

// ad
var adViewed = false;
function CloseAd() {
  adViewed = true;
  $("#index-ad").fadeOut(100);
}

// themes
function ToLight() {
  ChangeTheme("light");
  $("#light-mode").hide();
  $("#dark-mode").show();
}
function ToDark() {
  ChangeTheme("default");
  $("#dark-mode").hide();
  $("#light-mode").show();
}
function ChangeTheme(themeName) {
  $("#theme-stylesheet").attr("href", `/css/themes/${themeName}.css`);
  if (themeName == "default" || themeName == "light") {
    localStorage.setItem("theme", themeName);
  }
}
