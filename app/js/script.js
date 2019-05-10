/* не забывать писать комментарии */

(function () {
var box = document.querySelector('.slider__area'),
    control = box.querySelector('.slider__control');

var controlWidth = control.getBoundingClientRect().width,
    controlHalfWidth = controlWidth / 2,
    LIMITS,
    boxWidth;

/**
 * Функция, получающая размеры области, в которой будет происходить перемещение.
 * Аргументы – ограничивающий элемент и "вылеты" за границы области.
 * Для полного ограничения вылета справа и снизу надо обязательно передать соответственно
 * rightOut, равный ширине DnD объекта, и bottomOut, равный его высоте)
**/

function getBoxLimits (elem, leftOut, rightOut, topOut, bottomOut, container) {
    return {
        // top: 0 - (topOut ? topOut : 0),
        right: (elem.offsetWidth - (rightOut ? rightOut : 0)) * 100 / container,
        // bottom: elem.offsetHeight - (bottomOut ? bottomOut : 0),
        left: (0 - (leftOut ? leftOut : 0)) * 100 / container
    }
}

// функция, ограничивающая перемещение в зависимости от смещения по горизонтали
function getCoordX (elemX, limits) {
    if (elemX >= limits.left && elemX <= limits.right) {
        control.style.left = elemX + '%';
    }
}

function mouseHandler (evt) {
    evt.preventDefault();
    var startCoords = {
        x: evt.clientX
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove (mouseMoveEvt) {

        mouseMoveEvt.preventDefault();
        var shift = {
            x: (startCoords.x - mouseMoveEvt.clientX) * 100 / boxWidth
        };

        startCoords = {
            x: mouseMoveEvt.clientX
        };

        boxWidth = box.offsetWidth;
        LIMITS = getBoxLimits(box, controlHalfWidth, controlHalfWidth, 0, 0, boxWidth);

        /* чтобы после выхода мыши за границу dnd области перемещение элемента начиналось только после возврата мыши к нему */
        if (mouseMoveEvt.pageX > (box.offsetLeft + boxWidth)) {
            startCoords.x = LIMITS.right
        } else if (mouseMoveEvt.pageX < box.offsetLeft ) {
            startCoords.x = box.offsetLeft
        }

        var elemX = control.offsetLeft * 100 / boxWidth - shift.x;
        getCoordX(elemX, LIMITS);
    }

    function onMouseUp (mouseUpEvt) { // при отпускании мыши
        mouseUpEvt.preventDefault(); // на всякий случай, если элемент с дефолтным обработчиком

        document.removeEventListener('mousemove', onMouseMove); // в момент отпускания кнопки мыши удаляем
        document.removeEventListener('mouseup', onMouseUp); // обработчики, слушающие движение мыши
    }
}

function onTouchMove(touchEvt) {

    var touchLocation = touchEvt.targetTouches[0]; // получаем объект со свойствами тача

    boxWidth = box.offsetWidth;
    LIMITS = getBoxLimits(box, controlHalfWidth, controlHalfWidth, 0, 0, boxWidth);

    var elemX = (touchLocation.clientX - box.offsetLeft) * 100 / boxWidth;
    getCoordX(elemX, LIMITS);

    control.addEventListener('touchend', function () {
        var x = parseInt(box.style.left);
        var y = parseInt(box.style.top);
    })
}

control.addEventListener('mousedown', mouseHandler);
control.addEventListener('touchmove', onTouchMove);

window.addEventListener('resize', function () {
    control.removeEventListener('mousedown', mouseHandler);
    control.removeEventListener('touchmove', onTouchMove);

    setTimeout(function () {
        control.addEventListener('mousedown', mouseHandler);
        control.addEventListener('touchmove', onTouchMove);
    })

});

})();
