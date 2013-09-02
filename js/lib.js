var eventField = document.getElementsByName('event');
var dateField = document.getElementsByName('date');
var peopleField = document.getElementsByName('people');
var descriptionField = document.getElementsByName('description');
var searchField = document.getElementsByName('search');
var popup = document.getElementById('popup');
var wrapper = document.getElementById('wrapper');
var arrow = document.getElementById('arrow');
var showInfo = document.getElementById('showInfo');
var inputText = document.getElementById('inputText');
var buttons_popup = document.getElementById('buttons_popup');
var showDiv1 = document.getElementById('showDiv1');
var showDiv2 = document.getElementById('showDiv2');
var showDiv3 = document.getElementById('showDiv3');
var showDiv4 = document.getElementById('showDiv4');
var addEventInput = document.getElementsByName('addEvent');
var addEvent = document.getElementById('addEvent');
var showSearchInner = document.getElementById('showSearchInner');
var showSearch = document.getElementById('showSearch');
var oneEvent = document.getElementsByClassName('oneEvent');
var conteiner = document.getElementById("conteiner");

//Номер ячейки, заполняется при клике на ячейку
var cell;

//Для отмены таймера при mouseout или click
var timer;

//Для сохранения элемента предыдущего клика
var previousClick;

//Для сохранения даты полученной при вводе нового события
var arrDate = [];

//Для сохранения текста, введенного при добавлении нового
//события (перед отображением ошибки)
var textBeforError = [];

//Массив для хранения всех записей localStorage
var localStorageArray = [];

//Массив для отображения во всплывающем окне поиска
var searchArray = [];



//При наличии некорректно заполненного поля выделяем красным
//textError - текст ошибки
function showError(elem, textError) {

    //Если в поле отображена не ошибка, то сохраняем введенное значение в массив
    if (('Введите дату в формате дд мм гггг' !== elem[0].value) &&
	    ('День не может быть больше 31' !== elem[0].value) &&
	    ('День не может быть равен 0' !== elem[0].value) &&
	    ('Месяц не может быть больше 12' !== elem[0].value) &&
	    ('Месяц не может быть равен 0' !== elem[0].value) &&
	    ('Год не может быть больше ' + arrayForValid[1] !== elem[0].value) &&
	    ('Год не может быть меньше ' + arrayForValid[0] !== elem[0].value) &&
	    ('Поле не может быть пустым' !== elem[0].value))
	textBeforError[elem[0].name] = elem[0].value;

    //Выделяем элемент с ошибкой красным и присваиваем текст ошибки
    elem[0].style.border = '1px solid red';
    elem[0].value = textError;
    elem[0].style.color = 'red';
}
;


//Очищаем ошибку
//flag - если флаг 1, то форма либо сохранена, либо закрыта
//следовательно присваиваем значение по умолчанию
function cleanError(elem, flag) {

    elem[0].style.border = '';
    elem[0].style.color = '';

    //Если в массиве есть сохраненный текс для элемента
    //и он не равен тексту по умолчанию, то восстанавливаем текст,
    //если текст по умолчанию, то обнуляем его
    if (textBeforError[elem[0].name])
	if ((eventStandart !== textBeforError[elem[0].name]) &&
		(dateStandart !== textBeforError[elem[0].name]))
	    elem[0].value = textBeforError[elem[0].name];
	else
	    elem[0].value = '';

    //Если передан флаг, то устанавливаем значения по умолчанию
    if (1 === flag)
	if ('date' === elem[0].name)
	    elem[0].value = dateStandart;
	else if ('event' === elem[0].name)
	    elem[0].value = eventStandart;
	else if ('people' === elem[0].name)
	    elem[0].value = peopleStandart;
	else if ('description' === elem[0].name)
	    elem[0].value = descriptionStandart;
	else if ('addEvent' === elem[0].name)
	    elem[0].value = eventFastStandart;
    flag = 0;
}
;


//Отображаем форму быстрого ввода события
function showAddEvent() {

    //Если отображено окно ввода события, закрываем его
    if ('block' === popup.style.display) {
	closePopup();
    }
    if ('block' !== addEvent.style.display) {
	addEvent.style.display = 'block';
    }
}
;


//Закрываем форму быстрого ввода события
function closeAddEvent() {

    //Очищаем массив с временными значениями
    textBeforError = [];
    cleanError(addEventInput, 1);

    if ('block' === addEvent.style.display) {
	addEvent.style.display = 'none';
    }
}
;


//Закрываем всплывающее окно
function closePopup() {

    textBeforError = [];

    if ('block' === popup.style.display) {
	popup.style.display = 'none';

	cleanError(eventField);
	cleanError(dateField);
	cleanError(peopleField, 1);
	cleanError(descriptionField, 1);
    }
}
;


//При фокусе убираем текст по умолчанию либо
//отображенную ошибку
function showTextFocus(elem, text) {

    if (elem) {
	if (text === elem[0].value)
	    elem[0].value = '';
	cleanError(elem);
    }
}
;


//Устанавливаем текст по умолчанию
function showTextBlur(elem, text) {

    if (elem) {
	if ('' === elem[0].value)
	    elem[0].value = text;
    }
}
;


//Создаем таймер при наведении на ячейку
function mouseOverCell(event) {

    if (('block' !== popup.style.display) ||
	    ('block' === showInfo.style.display))
	timer = setTimeout(mainTableOnClick, 1000, event, 1);
}
;


//Отменяем таймер при покидании ячейки
function mouseOutCell() {

    if (timer)
	clearTimeout(timer);

    if (('block' === popup.style.display) &&
	    ('block' === showInfo.style.display))
	setTimeout(closePopup, 300);
}
;


//При клике по таблице задаем координаты для окна
//ввода нового события и отображаем его
//event - объект события
//flag - признак того, что отображать, если 1 то
//окно без возможности редактирования
function mainTableOnClick(event, flag) {

    //Если отображено окно быстрого ввода события или поиска, выходим
    if (('block' === addEvent.style.display) ||
	    ('block' === showSearch.style.display))
	return;

    textBeforError = [];

    //Если есть таймер для всплытия окна, то убираем
    if (timer)
	clearTimeout(timer);

    //Для сохранения номера ячейки, по которой кликнули
    var x, y;

    //Если клик не первый, то восстанавливаем стили
    //у элемента с предыдущим кликом
    if (1 !== flag)
	if (previousClick) {
	    previousClick.style.backgroundColor = '';
	    previousClick.style.border = '';
	}

    //Проверяем если кликнули по дочернему элементу ячейки, то
    //выбираем родителя и задаем координаты смещения,
    //выделяем ячейку, сохраняем элемент для удаления стилей
    //при следующим клике
    if ('TD' !== event.target.nodeName) {
	var offsetLeft = event.target.offsetParent.offsetLeft;
	var offsetTop = event.target.offsetParent.offsetTop;

	if (1 !== flag) {
	    event.target.offsetParent.style.backgroundColor = '#E5F1F9';
	    event.target.offsetParent.style.border = '2px solid lightblue';
	    previousClick = event.target.offsetParent;
	}
    }

    //Тоже, что и предыдущее, только непосредственно для элемента
    //не для родителя
    else {
	var offsetLeft = event.target.offsetLeft;
	var offsetTop = event.target.offsetTop;
	if (1 !== flag) {
	    event.target.style.backgroundColor = '#E5F1F9';
	    event.target.style.border = '2px solid lightblue';
	    previousClick = event.target;
	}
    }

    //Сравниваем координату Х полученную из события с заданными
    for (var i = 0; i < 7; i++)
	if (offsetLeft <= coordinatsOffsetX[i]) {

	    //Проверяем нужно ли переносить стрелку на всплывающем окне
	    if (i > 3) {
		arrow.style.left = '-16px';
		wrapper.style.left = '302px';
	    }
	    else {
		arrow.style.left = '';
		wrapper.style.left = '';
	    }
	    popup.style.left = coordinatsShowX[i] + 'px';
	    x = i + 1;
	    break;
	}

    //Тоже по Y
    for (var i = 0; i < 5; i++)
	if (offsetTop <= coordinatsOffsetY[i]) {

	    //Проверяем нужно ли переносить стрелку на всплывающем окне
	    if (i > 1) {

		//Если передан флаг, то уменьшаем всплывающее окно
		if (1 !== flag) {
		    wrapper.style.top = '260px';
		    popup.style.top = coordinatsShowY[i] + 'px';
		}
		else {
		    wrapper.style.top = '130px';
		    popup.style.top = coordinatsShowY[i] + 130 + 'px';
		}
	    }
	    else {
		wrapper.style.top = '';
		popup.style.top = coordinatsShowY[i] + 'px';
	    }

	    y = i;
	    break;
	}

    //Убираем предыдущие ошибки и введенные данные
    cleanError(eventField, 1);
    cleanError(dateField, 1);
    cleanError(peopleField, 1);
    cleanError(descriptionField, 1);

    //Вычисляем номер ячейки по которой кликнули
    cell = (x + y * 7) - 1;

    //Проверяем если есть данные о событии в массиве month
    //выводим их в окно для редактирования
    if (1 !== flag) {
	if (calendar.month[cell][3]) {

	    //Выводим дату
	    dateField[0].value = calendar.month[cell][0] + separator +
		    calendar.month[cell][1] + separator +
		    calendar.month[cell][2];

	    //Выводим событие
	    eventField[0].value = calendar.month[cell][3];

	    //Выводим участников
	    if (calendar.month[cell][4])
		peopleField[0].value = calendar.month[cell][4];

	    //Выводим описание
	    if (calendar.month[cell][5])
		descriptionField[0].value = calendar.month[cell][5];
	}
	else {

	    //Выводим дату
	    dateField[0].value = calendar.month[cell][0] + separator +
		    calendar.month[cell][1] + separator +
		    calendar.month[cell][2];
	}

	//Отображаем форму для редактирования события
	popup.style.minHeight = '329px';
	showInfo.style.display = "none";
	inputText.style.display = "block";
	buttons_popup.style.display = "block";
    }
    else {

	//Проверяем если есть данные о событии в массиве month
	//выводим их в окно для отображения
	if (calendar.month[cell][3]) {

	    //Выводим дату
	    showDiv2.textContent = calendar.month[cell][0] + separator +
		    calendar.monthTitle[calendar.month[cell][1] - 1] + separator +
		    calendar.month[cell][2];

	    //Выводим событие
	    showDiv1.textContent = calendar.month[cell][3];

	    //Выводим участников
	    if (calendar.month[cell][4])
		showDiv3.textContent = calendar.month[cell][4];

	    //Выводим описание
	    if (calendar.month[cell][5])
		showDiv4.textContent = calendar.month[cell][5];
	}
	else {

	    //Выводим дату
	    showDiv2.textContent = calendar.month[cell][0] + separator +
		    calendar.monthTitle[calendar.month[cell][1] - 1] + separator +
		    calendar.month[cell][2];

	    //Выводим событие
	    showDiv1.textContent = "Событий нет";

	    //Выводим участников
	    showDiv3.textContent = '';

	    //Выводим описание
	    showDiv4.textContent = '';
	}


	//Отображаем форму с отображением информации
	popup.style.minHeight = '200px';
	showInfo.style.display = "block";
	inputText.style.display = "none";
	buttons_popup.style.display = "none";
    }

    //Отображаем окно
    popup.style.display = 'block';
    flag = 0;
}
;


//Проверяем каждый элемент полученного из localStorage массива
//с введенным в поле search текстом
function pressOnInput() {

    searchArray = [];
    showSearch.style.display = 'none';
    for (var i = 0; i < localStorageArray.length; i++) {

	//Для поиска по названию месяца
	var dateArray = localStorageArray[i][0].split('|');
	var dateString = dateArray[0] + ' ' + calendar.monthTitle[dateArray[1]] + ' ' + dateArray[2];

	//Если введенные символы найдены, то сохраняем их в массив
	if ((dateString.match(searchField[0].value)) ||
		(localStorageArray[i][1].toLowerCase().match(searchField[0].value)))
	    searchArray.push([localStorageArray[i][0], localStorageArray[i][1]]);
    }
    showResultInput();
}
;


//Создаем всплывающее окно с полученными из localStorage результатами
function showResultInput() {

    var showResult = new String;

    //Если найдены записи по введенной строке, обрабатываем их и отображаем
    if (0 !== searchArray.length) {

	//Пробегаем массив с отсеянными результатами и восстанавливаем данные
	for (var i = 0; i < searchArray.length; i++) {
	    var dateArray = searchArray[i][0].split('|');
	    var dataArray = searchArray[i][1].split('|');

	    //Формируем div'ы для отображения результатов
	    showResult +=
		    '<div class="oneEvent">' +
		    '<div class = "showSearchEvent">' + dataArray[0] +
		    '</div><div class = "showSearchDate">' +
		    dateArray[0] + ' ' + calendar.monthTitle[dateArray[1] - 1] + ' ' + dateArray[2] +
		    '</div></div>';
	}

	//Добавляем div'ы и отображаем блок с результатами
	showSearchInner.innerHTML = showResult;
	showSearch.style.display = 'block';

    }
}
;


//При наведении на общий div всех результатов
showSearch.onmouseover = function() {
    addEvents2();
};


//Навешиваем события onmouseover, onmouseout и onclick на массив div'ов
//с результатами поиска
function addEvents2() {

    for (var i = 0; i < oneEvent.length; i++) {
	oneEvent[i].onmouseover = function(x) {

	    return function() {

		//При наведении присваиваем дополнительный класс select
		oneEvent[x].childNodes[0].className = 'showSearchEvent select';
		oneEvent[x].childNodes[1].className = 'showSearchDate select';
	    };
	}(i);

	oneEvent[i].onmouseout = function(x) {

	    return function() {

		//Убираем класс
		oneEvent[x].childNodes[0].className = 'showSearchEvent';
		oneEvent[x].childNodes[1].className = 'showSearchDate';
	    };
	}(i);

	oneEvent[i].onclick = function(x) {

	    return function() {

		//Создаем массив с датой
		var arrDate = searchArray[x][0].split('|');

		//Перерисовываем таблицу
		var table = document.getElementById("main_table");
		calendar.remove(table);
		calendar.creatCalendarTable(arrDate[1] - 1, arrDate[2]);

		var arrayTd = document.getElementsByTagName('td');

		//Прогоняем вновь созданный массив текущего месяца и сравниваем
		//с датой из события по которому кликнули
		for (var i = 0; i < calendar.month.length; i++)
		    if ((String(arrDate[0]) === String(calendar.month[i][0])) &&
			    (String(arrDate[1]) === String(calendar.month[i][1])) &&
			    (String(arrDate[2]) === String(calendar.month[i][2]))) {

			//Выделяем ячейку
			arrayTd[i].style.backgroundColor = '#E5F1F9';
			arrayTd[i].style.border = '2px solid lightblue';

			//Сохраняем элемент для того, чтобы убрать выделение
			//при следующем клике
			previousClick = arrayTd[i];
			return;
		    }
	    };
	}(i);
    }
}