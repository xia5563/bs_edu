/**
 * Created with JetBrains WebStorm.
 * User: xia55
 * Date: 12/02/17
 * Time: 1:40 PM
 * To change this template use File | Settings | File Templates.
 */
var screenWidth;
var smScreenWidth;

$(document).ready(function(){
    screenWidth = $(window).width();
//    768px is the bootstrap default definition of 'sm' screen width. Navigation bar items will be hidden when screen width < 768px.
    smScreenWidth = 768;

    addClassToActivePage();
    animateNavbarOnScroll();
//    Some animate only happen on large screens.
    if(!isOnSmallScreen(screenWidth, smScreenWidth)) {
        animateCxbox()
    };
    animatePTETestAnswerGroup();
    animatePTETestFeedback();
});

function addClassToActivePage(){
    var pageMeta = $("meta[name='pageIndex']");
    if(pageMeta.length == 0) return; //Will skip following if no pageIndex meta.
    var pageIndex = pageMeta.attr("content");
    $("li[pageIndex="+pageIndex+"]").addClass("active");
}
function isOnSmallScreen(screenWidth, smScreenWidth){
    if(screenWidth < smScreenWidth) {
        return true;
    }else{
        return false;
    }
}
function animateNavbarOnScroll(){
    var nav = $(".cx-navRow");
    if(nav.length==0) return; //Will skip the following if navigation bar doesn't exist.

    var nav_top = nav.offset().top;
    var bslogo = $(".cx-bslogoOverlap");
    var aniSpeed = 400 ; // The animation speed in milliseconds.
    var varOpacity = 0.2;  //The value of opacity of navigation bar.

    function mouseenterNav(){
        nav.css({"opacity":"1"})  ;
    }
    function mouseleaveNav(){
        nav.css({"opacity":varOpacity});
    }

    $(window).scroll(function(){
        var scrollTop = $(window).scrollTop();
//      when the page scrolls down more than the value of nav_top.
        if(nav_top   <= scrollTop){
            var diffTop = scrollTop - nav_top;
//          Display the nav at the very top of the "screen".
            nav.css({"top":diffTop+"px"}) ;
            if(bslogo.hasClass("cx-bslogoOverlap")){
                bslogo.switchClass("cx-bslogoOverlap", "cx-bslogoSmall", aniSpeed);
                if(isOnSmallScreen(screenWidth, smScreenWidth)) return; //Will skip the following on small screens.
                nav.css({"opacity":varOpacity});
                nav.on("mouseenter", mouseenterNav);
                nav.on("mouseleave", mouseleaveNav);
            }
        }else{
//        The original classes.
            nav.css({"top":0+"px"}) ;
            if(bslogo.hasClass("cx-bslogoSmall")){
                bslogo.switchClass("cx-bslogoSmall", "cx-bslogoOverlap", aniSpeed);
                if(isOnSmallScreen(screenWidth, smScreenWidth)) return; //Will skip the following on small screens.
                nav.css({"opacity":1});
                nav.off("mouseenter", mouseenterNav);
                nav.off("mouseleave", mouseleaveNav);
            }
        }
    });
}
function animateCxbox(){
    var cxboxGroup = $(".cx-box");
    if(cxboxGroup.length == 0) return; //Will skip following if no ".cx-box" on the page.
    var container = $(".cx-boxContainer");
    var containerWidth = container.css("width");
    var containerWidthNoPx = parseInt(containerWidth.replace("px", ""));
    var calculationFactorA = containerWidthNoPx * (400 / 1170) ; //Helps calculation responsive to the screen width.
    var oldWidth = cxboxGroup.css("width");
    var oldWidthNoPx = parseInt(oldWidth.replace("px", ""));
    var newLgWidthNoPx = oldWidthNoPx + calculationFactorA - 2 ;
    var newSmWidthNoPx = oldWidthNoPx - calculationFactorA ;
    var oldHeight = cxboxGroup.css("height");
    var oldHeightNoPx = parseInt(oldHeight.replace("px", ""));
    var newLgHeightNoPx = oldHeightNoPx + 100 ;
    var newSmHeightNoPx = oldHeightNoPx - 150 ;
    var aniSpeed = 1000 ; //Animation speed.

    function mouseenterBox(){
        var thisOne = $(this);
        var sibling = thisOne.siblings(".cx-box");
        var others = cxboxGroup.not(thisOne).not(sibling);

            cxboxGroup.stop(true,false);   //Kill subsequent animations but execute current one.
            cxboxGroup.animate({width:oldWidth, height:oldHeight}, aniSpeed, function(){
                thisOne.animate({width: newLgWidthNoPx + "px", height: newLgHeightNoPx + "px"}, aniSpeed);
                sibling.animate({width: newSmWidthNoPx + "px", height: newLgHeightNoPx + "px"},aniSpeed);
                others.animate({height:newSmHeightNoPx + "px"}, aniSpeed);
            });


    }

    function mouseleaveBox(){
        var thisOne = $(this);

        cxboxGroup.stop(true,false);
        cxboxGroup.animate({width:oldWidth, height:oldHeight}, aniSpeed)
    }

    cxboxGroup.on("mouseenter",  mouseenterBox  )  ;
    cxboxGroup.on("mouseleave", mouseleaveBox)  ;
}
function animatePTETestAnswerGroup(){
    var answerGroup = $(".cx-PTETestReadingBtn, .cx-PTETestSpeakingBtn, .cx-PTETestWritingBtn, .cx-PTETestListeningBtn");
    var resultClassName;
    answerGroup.on("click", function(){
        var thisClassName = $(this).attr("class");
        var classNameArr = thisClassName.split(" ") ;
        for(var i = 0, len = classNameArr.length; i < len; i++){
            if( (classNameArr[i]).indexOf("PTETest") > 0) {
                resultClassName = classNameArr[i].replace("Btn", "");
            }
        }
        var element = $("." + resultClassName);
        element.toggle("slide", {direction:"up"}, 500);
    }) ;


}
function animatePTETestFeedback(){
    var feedback = $(".cx-PTETestFeedback");
    var allAnswers =$(".cx-PTETestAnswerGroup input");
    var rightAnswers = $(".cx-PTETestAnswerTypeA");
    var answersDoneByUser ;
    var wrongAnswersDoneByUser;

    $("#cx-PTETestSubmitBtn").on("click", function(){
        answersDoneByUser = $(".cx-PTETestAnswerGroup :checked");
        wrongAnswersDoneByUser = answersDoneByUser.not(rightAnswers);
//        Clear the highlighted styles.
        allAnswers.parent().removeClass("cx-PTETestAnswerTypeAHighlighted cx-PTETestAnswerTypeBHighlighted");
        feedback.show("slide",{direction:"up"},1000, showPTETestResult);
    });
    $("#cx-PTETestShowAnswerBtn").on("click", function(){
//        All right answers will be highlighted in a different background color.
        rightAnswers.parent().addClass("cx-PTETestAnswerTypeAHighlighted");
//        All wrong answers done by user will be highlighted.
        wrongAnswersDoneByUser.parent().addClass("cx-PTETestAnswerTypeBHighlighted");


    });
    $("#cx-PTETestResetBtn").on("click", function(){
        feedback.hide("slide",{direction:"up"},1000);
        allAnswers.removeAttr("checked");
        allAnswers.parent().removeClass("cx-PTETestAnswerTypeAHighlighted cx-PTETestAnswerTypeBHighlighted");
    });
}
function getPTETestResult(){
//  Each question comes with only one ".cx-PTETestAnswerGroup".
    var sizeOfQuestions = $(".cx-PTETestAnswerGroup").length;
//  Each right answer comes with a ".cx-PTETestAnswerTypeA" class.
    var sizeOfRightAnswerDoneByUser = $(".cx-PTETestAnswerTypeA:checked").length;
    var allScores = {
        allQuestions:0,
        rightOnes:0,
        total:0,
        reading:0,
        speaking:0,
        writing:0,
        listening:0
    };
    allScores.allQuestions = sizeOfQuestions;
    allScores.rightOnes = sizeOfRightAnswerDoneByUser;
//    Total score will multiply by 100 so as to make it in percentage.
    allScores.total = Math.round( sizeOfRightAnswerDoneByUser * 100 / sizeOfQuestions );
    allScores.reading = getPartialScore(".cx-PTETestReadingAnswerGroup");
    allScores.speaking = getPartialScore(".cx-PTETestSpeakingAnswerGroup");
    allScores.writing = getPartialScore(".cx-PTETestWritingAnswerGroup");
    allScores.listening = getPartialScore(".cx-PTETestListeningAnswerGroup");
    return allScores;
}
function getPartialScore(whichPart){
    var total = $(whichPart).length;
    var rightOnes = $(whichPart + "  .cx-PTETestAnswerTypeA:checked").length;
    var partialScore;
    if(total > 0) {
        partialScore = rightOnes / total ;
        partialScore = Math.round(partialScore * 100) / 100 ;
    }
    return partialScore;
}
function showPTETestResult(){
    var radioGroup = $(".cx-PTETestAnswerGroup :radio");
    if(radioGroup.length == 0 ) return; //Will skip following if there is no "radio".
    var result = getPTETestResult();
    showPartialResult("Reading", result.reading);
    showPartialResult("Speaking", result.speaking);
    showPartialResult("Writing", result.writing);
    showPartialResult("Listening", result.listening);
    $("#cx-PTETestScoreRightAnswers").text(result.rightOnes);
    $("#cx-PTETestScoreAllQuestions").text(result.allQuestions);
    animateNumbers(0, result.total, $("#cx-PTETestScore"));
}
function showPartialResult(whichPart, score){
    var progressBar = $(".cx-PTETest" + whichPart + "Feedback");
//    Make sure the feedbackText is the previous sibling of progressBar.
    var feedbackText = progressBar.prev();
    score *= 100;
    feedbackText.text(whichPart + ": " + score +"%");
    if(score == 0) {
        feedbackText.addClass("cx-PTETestFeedbackTextHighlighted");
    }else{
        feedbackText.removeClass("cx-PTETestFeedbackTextHighlighted");
    }
    progressBar.css({"width":0}).delay(500).animate({"width": score + "%"}, 1000, "linear");
}

function animateNumbers(startNum, endNum, element){
    var aniSpeed = 40; //The animation speed.
    if(startNum > endNum){
        return;
    }else{
        element.html(startNum);
        startNum++;
//        setTimeout doesn't allow the first parameter to be a function with its own parameters, but it's ok to wrap them using anonymous function
        window.setTimeout(function(){animateNumbers(startNum, endNum, element)}, aniSpeed);
    }
}
//function toggleVideo is not being used for now.
function toggleVideo(){
    $(".cx-btn-video").click(function(){
        var hidden_div = $("#cx-hidden-div");
        var btn = $("#cx-btn-for-hidden-div");
        var speedOne = 1500;
        var speedTwo = 600;
        var effect = "fold";

        if(hidden_div.css("display")=="none"){
            hidden_div.show(effect, {}, speedOne,
                function(){
                    btn.text("Hide video.");
                    var top = btn.offset().top ;
                    $("html,body").animate({scrollTop:top},speedTwo);
                });
        }
        else{
            btn.text("Show video.");
            hidden_div.hide(effect,{},speedOne);
        }

    });
}
//function animateImg is not being used for now.
function animateImg(){
    var theDiv = $(".cx-animateImg");
    var speedMedium = 1000; //The animation speed.
    if(theDiv.length==0) return; //Will skip following if the div doesn't exist.

    var imgOne = $(".cx-imgOne");
    var imgTwo = $(".cx-imgTwo");
//    theDiv.on("mouseenter",function(){
//        imgOne.hide("slide",{direction:"left"},speedMedium, function(){
//            imgTwo.show("slide",{direction:"right"},speedMedium);
//
//        });
//    });
//
//    theDiv.on("mouseleave",function(){
//        imgTwo.hide("slide",{direction:"left"},speedMedium, function(){
//            imgOne.show("slide",{direction:"right"},speedMedium);
//
//        });
//    });

    theDiv.hover(
        function () {
            imgOne.finish();
            imgTwo.finish();
            imgOne.hide("slide", {direction: "left"}, speedMedium, function () {
                    imgTwo.show("slide", {direction: "right"}, speedMedium);  })

        },
        function () {
            imgOne.finish();
            imgTwo.finish();
            imgTwo.hide("slide", {direction: "left"}, speedMedium, function () {
                imgOne.show("slide", {direction: "right"}, speedMedium);})
                });
 }