MINES = 40;//Quantidade de minas
HEIGHT = 20;//Altura da tabela
WIDTH = 15;//Tamanho da tabela
TIMER = false;

// Imputa randomicamente as 40 minas na tabela
function getUniqueRandomIndexesInField(table, indexes) {
    // Verifica se a váriavel indexes é indefinida e atribui o array esta vazia
    indexes = indexes ? indexes : [];
    // Variável i começa no 0(array vazio), enquando o i for menor que 40 minas, incrementa 1 no valor de i
    for (var i = indexes.length; i < MINES; i++) {
        //Váriavel recebe um numero ramdomico de 0 até 15 , equivalente ao eixo x
        var random_cell = Math.floor(Math.random() * WIDTH);
        //Váriavel recebe um numero ramdomico de 0 até 20, equivalente ao eixo y
        var random_row = Math.floor(Math.random() * HEIGHT);
        // Variável j começa no 0, enquando o j for menor que tamanho do array no momento, incrementa 1 no valor de j
        for (var j = 0; j < indexes.length; j++) {
            //Condição verifica se as coordenadas atuais já foram preenchidas com valor e tipo iguais
            if (indexes[j][0] === random_cell &&
                indexes[j][1] === random_row) {
                // Sendo iguais volta para função, no momento que ela está(arguments.callee, mas poderia ser o nome da função também)
                return arguments.callee(table, indexes);
            }
        }
        //insere na lista os valores de y e x
        indexes.push([random_cell, random_row]);//Primeiro Bag era o inserção dos valores em y e x antes(indexes.push([random_cell, random_row]))
    }
    return indexes;
}

// Mapeia as celulas que possui as minas adjacentes
function getAdjacentCellIndexes(x, y) {
    //Mapeia as células adjacentes a cordenada estudada
    return $.grep([
        [ x - 1, y - 1 ],
        [ x, y - 1 ],
        [ x + 1, y - 1 ],
        [ x - 1, y ],
        [ x + 1, y ],
        [ x - 1, y + 1 ],
        [ x, y + 1 ],
        [ x + 1, y + 1 ]
    ], function (element) {
        return element[0] >= 0 && element[1] >= 0
            && element[0] < WIDTH && element[1] < HEIGHT//Segundo bag, o segundo elemento refere-se ao eixo y (element[0] para element[1])
    });
}

var field_matrix = [];//Criado array vazia
var field = $("#field table");// Chama o id field e tag table do html
// Variável i começa no 0, enquando o i for menor que 20 que é a altura e incrementa 1 no valor de i até chegar a condição não valer mais
for (var i = 0; i < HEIGHT; i++) {
    var row_vector = [];// Cria um array vazia para linha
    var row = $("<tr>");// Cria uma linha nova no html
    //Variável j começa no 0, enquando o j for menor que 15 que é a tamanho da tabela e incrementa 1 no valor de j até chegar a condição não valer mais
    for (var j = 0; j < WIDTH; j++) {
        var mine = $("<td>");//Cria uma célula vazia para linha
        mine.data("mines", 0);//Insere um dado e um valor para a célula vazia
        
        var button = $("<div>");
        button.addClass("button");
        button.data("coordinates", [j, i]);

        button.contextmenu(function () {
            return false;
        });

        button.mousedown(function(event) {
            if (!TIMER) {
                TIMER = setInterval(function () {
                    counter++;
                    $("#timer").text(counter);
                }, 1000);
            }
            if (event.which === 3) {
                $(this).toggleClass("red-flag");
                $("#mines").text($(".red-flag").length);
            } else {
                $("#reset").addClass("wow");
            }
        });

        button.mouseup(function () {
            $("#reset").removeClass("wow");
            if (!$(this).hasClass("red-flag")) {
                if ($(this).parent().hasClass("mine")) {
                    $("td .button").each(function (index, button) {
                        button.remove();
                    })
                    $("#reset").addClass("game-over");
                    clearInterval(TIMER);
                } else if ($(this).parent().data("mines") > 0) {
                    $(this).remove();
                } else if ($(this).parent().data("mines") === 0) {
                    var coordinates = $(this).data("coordinates");
                    $(this).remove();
                    (function (x, y) {
                        var adjacent_cells = getAdjacentCellIndexes(x, y);
                        for (var k = 0; k < adjacent_cells.length; k++) {
                            var x = adjacent_cells[k][0];
                            var y = adjacent_cells[k][1];
                            var cell = $(field_matrix[y][x]);
                            var button = cell.children($(".button"));
                            if (button.length > 0) {
                                button.remove();
                                if (cell.data("mines") === 0) {
                                    arguments.callee(x, y);
                                }
                            }
                        }
                    })(coordinates[0], coordinates[1]);
                }

                if ($("td .button").length === MINES) {
                    $("#reset").addClass("winner");
                    clearInterval(TIMER);
                }

            }
        })

        mine.append(button);

        row.append(mine);//A linha criada recebe a célula preenchida
        row_vector.push(mine)
        console.log(row_vector);
    }
    //table rebece tr
    field.append(row);
    //array com celulas dentro da matrix com todas as linhas
    field_matrix.push(row_vector);
}

//recebe array de array com indexeszx randomicos
var mine_indexes = getUniqueRandomIndexesInField();
//lupar indexes $.each (loop especifico para arrays, recebe) Esse método do jQuery funciona como "for of" do javascript
$.each(mine_indexes, function(index, coordinates) {
    var x = coordinates[0];
    var y = coordinates[1];
    var mine = $(field_matrix[y][x]);
    mine.addClass("mine");
});

$.each(mine_indexes, function (index, coordinates) {
    var adjacent_cells = getAdjacentCellIndexes(coordinates[0], coordinates[1]);
    $.each(adjacent_cells, function(index, coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var cell = $(field_matrix[y][x]);
        if (!cell.hasClass("mine")) {
            var num_mines = cell.data("mines") + 1;
            cell.data("mines", num_mines);
            switch (num_mines) {
                case 1:
                    cell.css("color", "blue");
                    break;
                case 2:
                    cell.css("color", "green");
                    break;
                case 3:
                    cell.css("color", "red");
                    break;
                case 4:
                    cell.css("color", "navy");
                    break;
                case 5:
                    cell.css("color", "maroon");
                    break;
                case 6:
                    cell.css("color", "teal");
                    break;
                case 7:
                    cell.css("color", "DarkMagenta");
                    break;
                case 8:
                    cell.css("color", "black");
                    break;
            }
        }
    })
});

$.each(field_matrix, function(index, row) {
    $.each(row, function(index, cell) {
        var number = $(cell).data("mines");
        if (number > 0) {
            $(cell).append(number);
        }
    });
});
