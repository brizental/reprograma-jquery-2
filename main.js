MINES = 40;//Quaantidade de minas
HEIGHT = 20;//Altura da tabela
WIDTH = 15;//Tamanho da tabela

// Imputa randomicamente as 40 minas na tabela
function getUniqueRandomIndexesIn2DArray(table, indexes) {
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
        indexes.push([random_row, random_cell]);//Primeiro Bag era o inserção dos valores em y e x antes(indexes.push([random_cell, random_row]))
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
        row.append(mine);//A linha criada recebe a célula preenchida
        row_vector.push(mine)
        console.log(row_vector);
    }
    field.append(row);
    field_matrix.push(row_vector);
}

var mine_indexes = getUniqueRandomIndexesIn2DArray(field_matrix);
$.each(mine_indexes, function(index, coordinates) {
    var x = coordinates[0];
    var y = coordinates[1];
    var mine = $(field_matrix[x][y]);
    mine.addClass("mine");
});

$.each(mine_indexes, function (index, coordinates) {
    var adjacent_cells = getAdjacentCellIndexes(coordinates[1], coordinates[0]);
    $.each(adjacent_cells, function(index, coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var cell = $(field_matrix[x][y]);
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