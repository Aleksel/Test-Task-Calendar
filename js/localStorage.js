//Проверяем валидность поля.
//text - Тест из поля Input
//если flag - 1, проверяем на валидность дату
//иначе текстовое поле
function validForm(textStandart, text, elem, flag) {

    //Если поле - дата, то проверяем регулярным выражением
    if (1 === flag) {
	//Сначала проверяем на соответствие формату "дд мм гггг"
	if (!text.match(dateReg)) {
	    showError(elem, 'Введите дату в формате дд мм гггг');
	    return;
	}

	//Если формату соответствует, то проверяем на правильность даты
	else {
	    arrDate = text.split(separator);
	    if (arrDate[0] > 31) {
		showError(elem, 'День не может быть больше 31');
		return;
	    }
	    if (0 === arrDate[0]) {
		showError(elem, 'День не может быть равен 0');
		return;
	    }
	    if (arrDate[1] > 12) {
		showError(elem, 'Месяц не может быть больше 12');
		return;
	    }
	    if (0 === arrDate[1]) {
		showError(elem, 'Месяц не может быть равен 0');
		return;
	    }
	    if (arrDate[2] > arrayForValid[1]) {
		showError(elem, 'Год не может быть больше ' + arrayForValid[1]);
		return;
	    }
	    if (arrDate[2] < arrayForValid[0]) {
		showError(elem, 'Год не может быть меньше ' + arrayForValid[0]);
		return;
	    }
	}
    }

    //Проверяем содержит ли поле текст ошибки
    //либо текст по умолчанию, либо оно пустое, выдаем ошибку
    if ((textStandart === text) ||
	    ('' === text) ||
	    ('Поле не может быть пустым' === text) ||
	    (!text)) {

	showError(elem, 'Поле не может быть пустым');
	return;
    }
    else
	//Если валидация удачна, возвращаем true
	return true;
    flag = 0;
}
;

//Сохраняем данные в localStorage
//flag - 1, то сохраняем из формы быстрого сохранения
//иначе из всплывающей
function saveToLocalStorage(flag) {

    if (1 !== flag) {
	var inputEvent = validForm(eventStandart, eventField[0].value, eventField);
	var inputDate = validForm(dateStandart, dateField[0].value, dateField, 1);
    }
    else {
	//Если сохраняем из формы быстрого добавления, разбиваем строку по разделителю
	var arr = addEventInput[0].value.split(separatorAddEvent);

	//Если в полученной массиве есть первый элемент, проводим его валидацию как даты
	if (arr[0]) {
	    var addEventInp1 = validForm(eventFastStandart, arr[0], addEventInput, 1);
	}

	//Если в массиве меньше 3 элементов, валидируем остальную часть строки на пустоту
	if (arr.length < 3) {
	    var addEventInp2 = validForm(eventFastStandart, arr[1], addEventInput);
	}

	//Если в массиве больше элементов чем 2, то остальные объединяем в одну строку
	//и валидируем
	else {
	    var newStr = new String;
	    for (var i = 1; i < arr.length; i++) {
		newStr += arr[i];
	    }
	    var addEventInp2 = validForm(eventFastStandart, newStr);
	}

    }

    //Если валидация обоих полей из всплывающей формы ввода прошла успешно,
    //сохраняем данные и возвращаем полям значение по умолчанию
    if (1 !== flag)
	if ((inputEvent) && (inputDate)) {
	    //Стираем текст по умолчанию, для того, чтобы
	    //не сохранялся в localStorage если значения не заданы
	    showTextFocus(peopleField, peopleStandart);
	    showTextFocus(descriptionField, descriptionStandart);

	    //Создаем ключ из даты
	    var dateKey = parseInt(arrDate[0]) + '|' +
		    parseInt(arrDate[1]) + '|' +
		    parseInt(arrDate[2]);

	    //Создаем строку с данными для сохранения
	    var safe = eventField[0].value + '|' +
		    peopleField[0].value + '|' +
		    descriptionField[0].value;

	    //Сохраняем
	    localStorage.setItem(dateKey, safe);

	    //Очищаем поля
	    cleanError(eventField, 1);
	    cleanError(dateField, 1);
	    cleanError(peopleField, 1);
	    cleanError(descriptionField, 1);

	    //Закрываем окно добавления событий
	    closePopup();

	    //Если был клик и в cell находится номер ячейки
	    //и при этом есть запись события в массиве month
	    //сравниваем даты из массива month и введенную пользователем
	    //и если они не совпадают, то создаем в localStorage
	    //новую запись, старую удаляем и перерисовываем таблицу
	    if (cell) {
		var dateKeyFromArray = calendar.month[cell][0] + '|' +
			calendar.month[cell][1] + '|' +
			calendar.month[cell][2];
		if (dateKeyFromArray !== dateKey) {
		    removeItemFromLocalStorage();
		}
		else {
		    var table = document.getElementById("main_table");
		    calendar.remove(table);
		    calendar.creatCalendarTable(calendar.month[17][1] - 1);
		}
	    }
	}

    //Если валидация обоих полей из формы быстрого ввода прошла успешно,
    //сохраняем данные и возвращаем полям значение по умолчанию
    if (1 === flag)
	if ((addEventInp1) && (addEventInp2)) {
	    //Создаем ключ из даты
	    var dateKey = parseInt(arrDate[0]) + '|' +
		    parseInt(arrDate[1]) + '|' +
		    parseInt(arrDate[2]);

	    if (arr.length < 3)
		var safe = arr[1];
	    else
		var safe = newStr;

	    //Сохраняем
	    localStorage.setItem(dateKey, safe);

	    //Очищаем поля
	    cleanError(addEventInput, 1);

	    //Закрываем окно добавления событий
	    closeAddEvent();

	    //Перерисовываем таблицу
	    var table = document.getElementById("main_table");
	    calendar.remove(table);
	    calendar.creatCalendarTable(calendar.month[17][1] - 1);
	}
    flag = 0;
}
;


//Считываем данные из localStorage
function loadFromLocalStorage() {
    var dataArray = [];
    for (i = 0; i < 35; i++) {

	//Создаем ключ массива month и проверяем запись в стораж по этому ключу
	var dateKey = calendar.month[i][0] + '|' +
		calendar.month[i][1] + '|' +
		calendar.month[i][2];
	var getItem = localStorage.getItem(dateKey);
	if (getItem) {

	    //Если запись найдена, то заполняем массив данными из стораж
	    dataArray = getItem.split('|');
	    calendar.month[i].push(dataArray[0]);
	    if (dataArray[1])
		calendar.month[i].push(dataArray[1]);
	    if (dataArray[2])
		calendar.month[i].push(dataArray[2]);
	}
    }
}
;


//При нажатии клавиши получаем все данные из
//localStorage и проверяем с помощью RegExp
function loadFromLocalStorageForSearch() {

    var reg = '^\\d{1,2}\|\\d{1,2}\|\\d{4}$';

    for (var name in localStorage) {
	if (name[0].match(reg))
	    localStorageArray.push([name, localStorage.getItem(name)]);
    }
}
;


//Удаляем запись из localStorage стораже
function removeItemFromLocalStorage() {

    if (cell) {

	//Создаем ключ массива month и проверяем запись в стораж по этому ключу
	var dateKey = calendar.month[cell][0] + '|' +
		calendar.month[cell][1] + '|' +
		calendar.month[cell][2];
	localStorage.removeItem(dateKey);

	//Закрываем окно добавления событий
	closePopup();

	//Перерисовываем таблицу
	var table = document.getElementById("main_table");
	calendar.remove(table);
	calendar.creatCalendarTable(calendar.month[17][1] - 1);
    }
}
;