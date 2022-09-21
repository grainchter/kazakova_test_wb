let oldData = []; // храним предыдущий полученный по fetch запросу массив
let oldBrand = ""; // храним предыдущий полученный по fetch запросу бренд
let brand; // храним полученный с формы бренд
let request; // храним полученный с формы запрос

// получаем данные с формы
let getDataFromForm = () => {
    const regular = /^[ ]+$/g;
    request = document.getElementById('request').value;
    brand = document.getElementById('brand').value;

    if (regular.test(request) === false) {
        setInterval(() => {
            getData();
        }, 1000);
    }
}

// делаем запрос для получение данных по запросу
let fetchData = async () => {
    let arrayData = [];

    await fetch("https://search.wb.ru/exactmatch/ru/common/v4/search?" + new URLSearchParams({
        "appType": 1,
        "couponsGeo": [2, 12, 7, 3, 6, 21, 16],
        "curr": "rub",
        "dest": [-1221148, -140294, -1751445, -364763],
        "emp": 0,
        "lang": "ru",
        "locale": "ru",
        "pricemarginCoeff": 1.0,
        "query": request,
        "reg": 0,
        "regions": [64, 58, 83, 4, 38, 80, 33, 70, 82, 86, 30, 69, 1, 48, 22, 66, 31, 40],
        "resultset": "catalog",
        "sort": "popular",
        "spp": 0,
        "suppressSpellcheck": false
    })
    ).then(async (response) => {
        let data = await response.json();
        arrayData = data.data;
    }
    );

    return arrayData;
}

// вызываем функцию для получения данных по запросу и проверяем, обновились ли данные
// если да, то обновляем список на экране
let getData = async () => {
    let dataDetail = await fetchData();
    let productsData = [];

    if (dataDetail) {
        productsData = dataDetail.products;

        if (JSON.stringify(productsData) != JSON.stringify(oldData) || oldBrand != brand) {
            deleteData();
            draw(productsData);
            oldData = productsData;
            oldBrand = brand;
        }
    }
}

// отрисовка обычного текста
let simpleText = (brand, id) => {
    document.getElementById('test1').insertAdjacentHTML("beforeEnd",
        `
    <span>${id + 1}. ${brand}</span> </br>
  `)
}

// отрисовка текста, который совпадает с введенным в форму брендом
let selectedText = (brand, id) => {
    document.getElementById('test1').insertAdjacentHTML("beforeEnd",
        `
    <span class="selected">${id + 1}. ${brand}</span> </br>
  `)
}

// очищаем поле с данными для перерисовки
let deleteData = () => {
    document.getElementById('test1').innerHTML =
        `<span>
    </span>`
}

// перебираем массив с полученными данными и вызываем необходимую функцию отрисовки
let draw = (dataDetail) => {
    document.getElementById('test1').insertAdjacentHTML("beforeEnd",
        `
    <h2>Рейтинг по запросу: "${request}"</h2> </br>
  `)

    dataDetail.map((item, id) => {
        if (item.brand == brand) {
            selectedText(item.brand, id);
        } else {
            simpleText(item.brand, id)
        }
    });
}