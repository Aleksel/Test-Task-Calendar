function Calendar() {

    this.monthTitleCal = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь'
    ];

    this.monthTitle = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря'
    ];

    this.week = [
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота',
	'Воскресенье'
    ];

    //Создаем массив, который будет содержать все дни для отображения выбранного месяца
    this.month = [];

    //Массив значений для вычисления понедельника первой недели месяца
    this.nameDay = ['5', '0', '0', '1', '2', '3', '4'];

    //Получаем дату понедельника первой недели месяца
    this.getFirstMonday = function() {

	//Если первый день месяца не понедельник то
	//получаем дату понедельника первой недели
	if (1 !== this.date.getDay())
	    this.date.setDate(-(this.nameDay[this.date.getDay()]));

    };


    //Получаем массив для заполнения календаря
    this.getMonthArray = function() {
	this.getFirstMonday();
	var month = [];
	//Заполняем массив на 35 дней
	for (var i = 0; i < 35; i++) {
	    month[i] = [this.date.getDate(), this.date.getMonth() + 1, this.date.getFullYear()];
	    this.date.setDate(this.date.getDate() + 1);
	}
	this.month = month;
    };


    //Построитель таблицы
    this.creatCalendarTable = function(mon, yr) {

	//если параметры не переданы, то устанавливаем текущие
	//из середины массива month
	if ((0 !== mon) && (!mon))
	    mon = this.month[17][1];
	if ((0 !== yr) && (!yr))
	    yr = this.month[17][2];

	//Получаем дату и создаем объект Date,
	//также сохраняем полученные месяц и год
	this.date = new Date(yr, mon, 1);

	//Счетчик дней для массива month
	var day = 0;

	//Создаем массив с датами на текущий месяц
	this.getMonthArray();

	//Считываем данные из localStorage и добавляем их в массив month
	loadFromLocalStorage();

	//Изменяем месяц и год перед таблицей
	var titleMonth = document.getElementById("title_month");
	titleMonth.firstChild.nodeValue = String(this.monthTitleCal[this.month[17][1] - 1] + ' ' + this.month[17][2]);

	//Создаем таблицу и присваиваем ее id
	var table = document.createElement("table");
	var attr = document.createAttribute('id');
	attr.value = "main_table";
	table.setAttributeNode(attr);

	//Создаем строки таблицы
	for (var i = 1; i < 6; i++) {
	    var tr = document.createElement('tr');
	    table.appendChild(tr);

	    //Создаем ячейки таблицы
	    for (var j = 0; j < 7; j++) {
		var td = document.createElement('td');

		//Если ячейка соответствует сегодняшней дате, то присваиваем id
		var now = new Date();
		if ((now.getDate() === this.month[day][0]) &&
			(now.getMonth() + 1 === this.month[day][1]) &&
			(this.month[17][1] === this.month[day][1]) &&
			(now.getFullYear() === this.month[day][2]) &&
			(this.month[17][2] === this.month[day][2])) {
		    attr = document.createAttribute('id');
		    attr.value = "today";
		    td.setAttributeNode(attr);
		}

		//Если столбец первый присваиваем день недели и число
		//иначе просто число
		(1 === i) ?
			td.innerHTML = this.week[j] + ', ' + this.month[day][0]
			:
			td.innerHTML = this.month[day][0];

		tr.appendChild(td);

		//Если есть событие для этой ячейки, присваиваем класс event
		if (this.month[day][3]) {
		    var attrCl = document.createAttribute('class');
		    attrCl.value = 'event';
		    td.setAttributeNode(attrCl);

		    //Создаем див для вывода названия события
		    var div = document.createElement('div');
		    var text = document.createTextNode(this.month[day][3]);
		    div.appendChild(text);
		    td.appendChild(div);

		    //Если есть участники, создаем div и выводим их
		    if (this.month[day][4]) {
			var div = document.createElement('div');
			var text = document.createTextNode(this.month[day][4]);
			div.appendChild(text);
			td.appendChild(div);
		    }
		}

		day++;
	    }
	}

	//Присваиваем таблице функцию обработки клика
	attrClick = document.createAttribute('onclick');
	attrClick.value = "mainTableOnClick(event);";
	table.setAttributeNode(attrClick);

	//Присваиваем таблице функцию наведения мыши
	attrClick = document.createAttribute('onmouseover');
	attrClick.value = "mouseOverCell(event);";
	table.setAttributeNode(attrClick);

	//Присваиваем таблице функцию при уходе мыши
	attrClick = document.createAttribute('onmouseout');
	attrClick.value = "mouseOutCell();";
	table.setAttributeNode(attrClick);

	conteiner.appendChild(table);
    };


    //Отображение следующего месяца
    this.nextMonth = function() {
	closePopup();
	var table = document.getElementById("main_table");
	this.remove(table);
	this.creatCalendarTable();
    };


    //Отображение предыдущего месяца
    this.previousMonth = function() {
	closePopup();
	var table = document.getElementById("main_table");
	this.remove(table);
	this.creatCalendarTable(this.month[17][1] - 2);
    };


    //Возврат текущего месяца
    this.currentMonth = function() {
	closePopup();
	var table = document.getElementById("main_table");
	this.remove(table);
	this.date = new Date();
	this.creatCalendarTable(now.getMonth(), now.getFullYear());
    };


    //Удаляем предыдущую таблицу
    this.remove = function(elem) {
	elem.parentNode ? elem.parentNode.removeChild(elem) : elem;
    };

}