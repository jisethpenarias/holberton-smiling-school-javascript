$(document).ready(function() {
    //   Quotes ===============================================================
    function displayQuotes(data) {
        let classItem = "";
        json = convertirXmlEnObjeto(data);
        data = json.quote;
        for (let i in data) {
            classItem = i == 0 ? "carousel-item active" : "carousel-item";
            let $carouselItem = $(`
        <blockquote class="${classItem}">
        <div class="row mx-auto align-items-center">
            <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
            <img
                src="${data[i].pic_url}"
                class="d-block align-self-center"
                alt="Carousel Pic ${i}"
            />
            </div>
            <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
            <div class="quote-text">
                <p class="text-white pr-md-4 pr-lg-5">
                ${data[i].text}
                </p>
                <h4 class="text-white font-weight-bold">${data.name}</h4>
                <span class="text-white">${data[i].title}</span>
            </div>
            </div>
        </div>
        </blockquote>;
    `);

            $("#carousel-items").append($carouselItem);
        }

        // END OF displayQuotes
    }

    function slideOne(id) {
        $(`#${id} .carousel-item`).each(function() {
            let minPerSlide = 4;
            let next = $(this).next();
            if (!next.length) {
                next = $(this).siblings(":first");
            }
            next.children(":first-child").clone().appendTo($(this));

            for (let i = 0; i < minPerSlide; i++) {
                next = next.next();
                if (!next.length) {
                    next = $(this).siblings(":first");
                }

                next.children(":first-child").clone().appendTo($(this));
            }
        });
    }

    function createCard(cardData) {
        let starState = "";
        let starString = "";
        let star;
        for (let i = 1; i <= 5; i++) {
            if (i <= cardData.star) {
                starState = "images/star_on.png";
            } else {
                starState = "images/star_off.png";
            }

            star = `<img src="${starState}" alt="star on" width="15px" />`;
            starString += i == 1 ? star : "\n" + star;
        }

        let card = `
    <div class="card">
      <img
        src="${cardData.thumb_url}"
        class="card-img-top"
        alt="Video thumbnail"
      />
      <div class="card-img-overlay text-center">
        <img
          src="images/play.png"
          alt="Play"
          width="64px"
          class="align-self-center play-overlay"
        />
      </div>
      <div class="card-body">
        <h5 class="card-title font-weight-bold">${cardData.title}</h5>
        <p class="card-text text-muted">
            ${cardData["sub-title"]}
        </p>
        <div class="creator d-flex align-items-center">
          <img
            src="${cardData.author_pic_url}"
            alt="Creator of Video"
            width="30px"
            class="rounded-circle"
          />
          <h6 class="pl-3 m-0 color-1">${cardData.author}</h6>
        </div>
        <div class="info pt-3 d-flex justify-content-between">
          <div class="rating">
            ${starString}
          </div>
          <span class="color-1">${cardData.duration}</span>
        </div>
      </div>
    </div>
    `;

        return card;

        // END OF createCard
    }

    function displayPopular(data) {
        let classItem = "";
        json = convertirXmlEnObjeto(data);
        data = json.video
        for (let i in data) {
            classItem = i == 0 ? "carousel-item active" : "carousel-item";
            let card = createCard(data[i]);
            let $carouselItem = $(`
      <div class="${classItem}">
        <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          ${card}
          </div>
      </div>
          `);
            $("#popular-items").append($carouselItem);
        }

        slideOne("popular");
        // END OF displayPopular
    }

    function displayLatest(data) {
        let classItem = "";
        json = convertirXmlEnObjeto(data);
        data = json.video;
        for (let i in data) {
            classItem = i == 0 ? "carousel-item active" : "carousel-item";
            let card = createCard(data[i]);
            let $carouselItem = $(`
      <div class="${classItem}">
        <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          ${card}
          </div>
      </div>
          `);
            $("#latest-videos-items").append($carouselItem);
        }

        slideOne("latest-videos");
        // END OF displayLatest
    }

    function searchObject() {
        let searchObj = {
            q: $("#keywords-input").val(),
            topic: $("#topic").text().toLowerCase(),
            sort: $("#sort-by").text().toLowerCase().replace(" ", "_"),
        };

        return searchObj;
    }

    function searchRequest() {
        let searchObj = searchObject();
        let $results = $("#results-items");
        $results.empty();
        $("#results-count").text("");

        for (let r of requestsCourses) {
            requestData(r.url, displayResults, r.id, searchObj);
        }
    }

    function parseTitle(title) {
        if (title) {
            title = title.charAt(0).toUpperCase() + title.slice(1).replace("_", " ");
        }
        return title;
    }

    function displayDropdown(list, $DOMElement, $titleElement) {
        if (list.length) {
            for (let l of list) {
                let s = parseTitle(l);
                let $item = $(`
          <a class="dropdown-item" href="#">${s}</a>
        `);
                $item.click(function() {
                    $titleElement.text(s);
                    searchRequest();
                });
                $DOMElement.append($item);
            }
        }
    }

    function displaySearch(data) {
        data = convertirXmlEnObjeto(data);
        let title;
        let topics = data.topics;
        let sorts = data.sorts;

        let $TopicDropdown = $("#topic-dropdown");
        let $TopicTitle = $("#topic");
        title = parseTitle(data.topic);
        $TopicTitle.text(title);
        displayDropdown(topics, $TopicDropdown, $TopicTitle);

        let $SortDropdown = $("#sort-dropdown");
        let $SortTitle = $("#sort-by");
        title = parseTitle(data.sort);
        $SortTitle.text(title);
        displayDropdown(sorts, $SortDropdown, $SortTitle);

        let $KeywordsInput = $("#keywords-input");

        $KeywordsInput.val(data.q);

        $KeywordsInput.change(function() {
            searchRequest();
        });
    }

    function displayResults(data) {
        data = convertirXmlEnObjeto(data);
        json = data.courses.course;
        let courses = json;
        if (!courses) return;
        let $results = $("#results-items");

        let count = Object.keys(courses).length;
        $("#results-count").text(`${count} videos`);

        if (Object.keys(courses).length) {
            for (let c of courses) {
                let card = createCard(c);
                let $resultItem = $(`
      <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
        ${card}
      </div>
     `);
                $results.append($resultItem);
            }
        }
    }

    function displaySearchAndResults(data) {
        displayResults(data);
        displaySearch(data);
        // END OF displayResults
    }

    function displayLoader(active, id) {
        if (active) {
            let $loader = $(`<div class="loader" id="loader-${id}"></div>`);
            $(`#${id}`).append($loader);
        } else {
            let $loader = $(`#loader-${id}`);
            $loader.remove();
        }

        // END OF displayLoader
    }

    function requestData(url, callback, id, data = {}) {
        displayLoader(true, id);
        $.ajax({
            url: url,
            type: "GET",
            data: data,
            headers: { "Content-Type": "application/xml" },
            success: function(response) {
                displayLoader(false, id);
                callback(response);
            },
            error: function(error) {
                alert(`Error Getting Data from ${url}`);
            },
        });
        // END OF requestData
    }

    // PERFORM DYNAMIC CONTENT REQUESTS ===================================
    let requestsHomepage = [{
            url: "https://smileschool-api.hbtn.info/xml/quotes",
            func: displayQuotes,
            id: "carousel-items",
        },
        {
            url: "https://smileschool-api.hbtn.info/xml/popular-tutorials",
            func: displayPopular,
            id: "popular-items",
        },
        {
            url: "https://smileschool-api.hbtn.info/xml/latest-videos",
            func: displayLatest,
            id: "latest-videos-items",
        },
    ];

    let requestsPricing = [{
        url: "https://smileschool-api.hbtn.info/xml/quotes",
        func: displayQuotes,
        id: "carousel-items",
    }, ];

    let requestsCourses = [{
        url: "https://smileschool-api.hbtn.info/xml/courses",
        func: displaySearchAndResults,
        id: "results-items",
    }, ];

    let $homepage = $("#homepage");
    let $pricing = $("#pricing");
    let $courses = $("#courses");

    let requestObject;

    if (Object.keys($homepage).length) requestObject = requestsHomepage;
    else if (Object.keys($pricing).length) requestObject = requestsPricing;
    else if (Object.keys($courses).length) requestObject = requestsCourses;

    for (let r of requestObject) {
        requestData(r.url, r.func, r.id);
    }

    // ======================================================================

    //   END OF DOCUMENT READY
    function convertirXmlEnObjeto(xml) {

        var objeto = {};
        var esRaiz = false;
    
        //  Objeto "raiz"
        if (xml.nodeType == 1) { // Objeto 
            // Se recuperan sus atributos
            if (xml.attributes.length > 0) {
                for (var j = 0; j < xml.attributes.length; j++) {
                    var atributo = xml.attributes.item(j);
                    objeto[atributo.nodeName] = atributo.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // Texto
            objeto = xml.nodeValue;
        } else if (xml.nodeType == 9) { // Elemento raiz
            esRaiz = true;
        }
    
        // Atributos del objeto (objetos hijos)
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nombreNodo = item.nodeName;
    
                // Si objeto no tiene un atributo con el nombre nombreNodo se anade, si ya lo tiene (es un array) se anade
                // a la lista del objeto con nombre nombreNodo
                if (typeof(objeto[nombreNodo]) == "undefined") {
                    // Si el elemento es un CDATA se copia el contenido en el elemento y no se crea un
                    // hijo para almacenar el texto
                    if (nombreNodo == "#cdata-section") {
                        objeto = item.nodeValue;
                    } else if (nombreNodo == "#text") { // Si el elemento es un texto no se crea el objeto #text
                        if (item.childNodes.length < 1) {
                            objeto = item.nodeValue;
                        } else {
                            objeto[nombreNodo] = convertirXmlEnObjeto(item);
                        }
                    } else {
                        if (esRaiz) {
                            objeto = convertirXmlEnObjeto(item);
                        } else {
                            objeto[nombreNodo] = convertirXmlEnObjeto(item);
                        }
                    }
                } else {
                    // Si el atributo no es una lista se convierte el atributo en un array y se anade el
                    // valor a dicho array
                    if (typeof(objeto[nombreNodo].push) == "undefined") {
                        var valorAtributo = objeto[nombreNodo];
                        objeto[nombreNodo] = new Array();
                        objeto[nombreNodo].push(valorAtributo);
                    }
    
                    objeto[nombreNodo].push(convertirXmlEnObjeto(item));
                }
            }
        }
        
        return objeto;
    }

});


