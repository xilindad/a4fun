$(document).ready(function() {
    var gunshot = document.getElementById('gunshot-sound');
    var totalScore = 0;
    var shotCount = 0;
    var audioInitialized = false;

    $('#start-button').on('click', function() {
        if (!audioInitialized) {
            // Play a silent sound or the actual gunshot sound at zero volume
            var silentSound = document.getElementById('gunshot-sound');
            silentSound.volume = 0;
            silentSound.play();
            silentSound.volume = 1; // Reset the volume
            audioInitialized = true;
        }
    });
    
    $('#target').click(function(event) {
        var rect = this.getBoundingClientRect();
        var x = event.clientX - rect.left; // x position within the element.
        var y = event.clientY - rect.top;  // y position within the element.
        var $bulletHole = $('<div class="bullet-hole"></div>');
        var $scorePopup = $('<div class="score-popup"></div>');

        $bulletHole.css({ left: x + 'px', top: y + 'px' });
        $scorePopup.css({ left: x + 'px', top: y + 'px' });

        $(this).append($bulletHole);
        $('body').append($scorePopup); // Append to body to ensure it's not inside #target

        gunshot.currentTime = 0;
        gunshot.play();

        var score = updateScore(x, y);
        totalScore += score;
        shotCount++;

        $scorePopup.text(score.toFixed(2)); // Display the score

        // Update total score and shot count display
        $('#total-score').text('Total Score: ' + totalScore.toFixed(2));
        $('#shot-count').text('Shots: ' + shotCount);

        // Remove the score popup after a short delay
        setTimeout(function() {
            $scorePopup.fadeOut('slow', function() { $(this).remove(); });
        }, 2000);

        setTimeout(function() {
            $bulletHole.remove();
        }, 5000);

        // Check if shot count has reached 10
        if (shotCount >= 10) {
            resetGame();
        }
    });

    $('#reset').click(function() {
        resetGame();
    });

    function resetGame() {
        $('.bullet-hole, .score-popup').remove();
        totalScore = 0;
        shotCount = 0;
        $('#total-score').text('Total Score: 0');
        $('#shot-count').text('Shots: 0');
    }

    function updateScore(x, y) {
        var targetWidth = $('#target').width();
        var targetHeight = $('#target').height();
    
        var centerX = targetWidth / 2;
        var centerY = targetHeight / 2;
    
        var distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        var maxDistance = Math.min(targetWidth, targetHeight) / 2;
    
        var score = 0;
        if (distance <= maxDistance) {
            score = 10 * (1 - distance / maxDistance);
        }
    
        return score;
    }
    
});
