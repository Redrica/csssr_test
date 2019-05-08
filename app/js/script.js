/* не забывать писать комментарии */

// (function () {
var box = document.querySelector('.slider'),
    control = box.querySelector('.slider__control');

var controlWidth = control.getBoundingClientRect().width,
    controlHalfWidth = controlWidth / 2;

/**
 * Функция, получающая размеры области, в которой будет происходить перемещение.
 * Аргументы – ограничивающий элемент и "вылеты" за границы области.
 * Для полного ограничения вылета справа и снизу надо обязательно передать соответственно
 * rightOut, равный ширине DnD объекта, и bottomOut, равный его высоте)
**/

function getBoxLimits (elem, leftOut, rightOut, topOut, bottomOut) {
    return {
        top: 0 - (topOut ? topOut : 0),
        right: elem.offsetWidth - (rightOut ? rightOut : 0),
        bottom: elem.offsetHeight - (bottomOut ? bottomOut : 0),
        left: 0 - (leftOut ? leftOut : 0)
    }
}

var LIMITS = getBoxLimits(box, controlHalfWidth, controlHalfWidth, 0, controlWidth);

// функция, ограничивающая перемещение в зависимости от смещения по горизонтали
function getCoordX (elemX, limits) {
    if (elemX >= limits.left && elemX <= limits.right) {
        control.style.left = elemX + 'px';
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
            x: startCoords.x - mouseMoveEvt.clientX
        };

        startCoords = {
            x: mouseMoveEvt.clientX
        };

        /* чтобы после выхода мыши за границу dnd области перемещение элемента начиналось только после возврата мыши к нему */
        if (mouseMoveEvt.pageX > (box.offsetLeft + box.offsetWidth)) {
            startCoords.x = LIMITS.right
        } else if (mouseMoveEvt.pageX < box.offsetLeft ) {
            startCoords.x = box.offsetLeft
        }

        var elemX = control.offsetLeft - shift.x;
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

    var elemX = touchLocation.clientX - box.offsetLeft;
    getCoordX(elemX, LIMITS);

    control.addEventListener('touchend', function () {
        var x = parseInt(box.style.left);
        var y = parseInt(box.style.top);
    })
}

control.addEventListener('mousedown', mouseHandler);
control.addEventListener('touchmove', onTouchMove);

// })();

var checkboxesBlock = document.querySelector('.block-checkboxes');

var summHeight = 0;

for (var i = 0; i < checkboxesBlock.children.length; i++) {
    summHeight += checkboxesBlock.children[i].offsetHeight;
}

checkboxesBlock.style.height = (summHeight / 2.5) + 'px';