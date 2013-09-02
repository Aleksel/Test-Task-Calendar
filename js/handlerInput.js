//Навешиваем обработчик для подсказок на поле поиск
searchField[0].onfocus = function() {
    showTextFocus(searchField, searchStandart);

    //Создаем массив всех записей из localStorage при фокусе на этом поле
    loadFromLocalStorageForSearch();
};


searchField[0].onblur = function() {
    showTextBlur(searchField, searchStandart);

    //При снятии фокуса с поля скрываем результаты поиска
    setTimeout(function() {
	showSearch.style.display = 'none';
    }, 200);

    //Обнуляем полученный из localStorage массив
    localStorageArray = [];
};


//Навешиваем обработчик для подсказок на поле собитие
eventField[0].onfocus = function() {
    showTextFocus(eventField, eventStandart);
};


eventField[0].onblur = function() {
    showTextBlur(eventField, eventStandart);
};


//Навешиваем обработчик для подсказок на поле даты
dateField[0].onfocus = function() {
    showTextFocus(dateField, dateStandart);
};


dateField[0].onblur = function() {
    showTextBlur(dateField, dateStandart);
};


//Навешиваем обработчик для подсказок на поле участников
peopleField[0].onfocus = function() {
    showTextFocus(peopleField, peopleStandart);
};


peopleField[0].onblur = function() {
    showTextBlur(peopleField, peopleStandart);
};


//Навешиваем обработчик для подсказок на поле описания
descriptionField[0].onfocus = function() {
    showTextFocus(descriptionField, descriptionStandart);
};


descriptionField[0].onblur = function() {
    showTextBlur(descriptionField, descriptionStandart);
};


//Навешиваем обработчик для подсказок на поле быстрого создания события
addEventInput[0].onfocus = function() {
    showTextFocus(addEventInput, eventFastStandart);
};


addEventInput[0].onblur = function() {
    showTextBlur(addEventInput, eventFastStandart);
};