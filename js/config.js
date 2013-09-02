//Регулярное выражение для валидации даты
var dateReg = '^\\d{1,2}\\s\\d{1,2}\\s\\d{4}$';

//Задаем предельные года для создания событий
var arrayForValid = [2000, 2020];

//Разделитель для разбивки строки даты
var separator = ' ';

//Разделитель для разбивки строки из формы быстрого добавления события
var separatorAddEvent = ',';

//Координаты по Х для отображения всплывающего окна
var coordinatsShowX = [191, 319, 447, 575, 251, 380, 509];
//Координаты по Х для расчета по какой ячейке кликнули
var coordinatsOffsetX = [50, 131, 260, 388, 516, 645, 773];
//Тоже только для Y
var coordinatsShowY = [124, 246, 107, 226, 345];
var coordinatsOffsetY = [50, 121, 240, 358, 474];

//Тест по умолчанию для полей ввода
var eventStandart = 'Событие';
var dateStandart = 'День месяц год';
var peopleStandart = 'Имена участников';
var descriptionStandart = 'Описание';
var eventFastStandart = '5 3 2013, День рождения';
var searchStandart = 'Событие, дата или участник';