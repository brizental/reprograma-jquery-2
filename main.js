//variaveis globais a serem usadas no código todo e constante, não precisa de var e será sempre em letra maiúscula
//quatidade de minas
MINES = 40;
//altura do tabuleiro
HEIGHT = 20;
//numero de linhas do tabuleiro
WIDTH = 15;

//gerar indexes randomicos na array com arrays dentro (row e cells) para posicionar as BOMBAS
function getUniqueRandomIndexesInField(indexes) {
    //condicao ? valor1 : valor2
    //Se condicao for verdadeira, o operador terá o valor de valor1. Caso contrário, terá o valor de valor2.
    //if (indexes) { (se verdadeiro)
    //    indexes = indexes
    //} else { (se falso)
    //    indexes = []
    //}
    indexes = indexes ? indexes : [];
    //loop que inicia no tamanho de indexes existentes
    for (var i = indexes.length; i < MINES; i++) {
        //random_cell gera número randômico de 0 a 15 (coordX)
        var random_cell = Math.floor(Math.random() * WIDTH);
        //random_row gera número ranômico de 0 a 20 (coordY)
        var random_row = Math.floor(Math.random() * HEIGHT);
        for (var j = 0; j < indexes.length; j++) {
            //condicao verifica se as coordenadas atuais já foram preenchidas conferindo valor e tipo para não tentar popular repetidamente (0 e 1 são os valores da array [0,1])
            if (indexes[j][0] === random_cell &&
                indexes[j][1] === random_row) {
                //arguments.callee é uma propriedade que contém a função atualmente em execução, na situação em que está.
                return arguments.callee(indexes);
            }
        }
        //sobe na array os valores de random_row e random_cell gerados
        indexes.push([random_cell, random_row]);
        console.log(indexes);
    }
    return indexes;
}

//percorre as céluas adjacentes às BOMBAS e dá coordenadas X,Y
function getAdjacentCellIndexes(x, y) {
    //A função $.grep recebe um array e uma função de filtro. Esta função retorna um novo array (não altera o original) contendo apenas os elementos para os quais a função filtro retorna true.
    //Essa função do jQuery funciona como filter do javascript
    return $.grep([
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1]
    ], function (coordinate) {
        //a coordenada X deve ser >= 0 e menor que a WIDTH e a coordenada Y deve ser >=0 e menor que a HEIGHT
        return coordinate[0] >= 0 && coordinate[1] >= 0
            && coordinate[0] < WIDTH && coordinate[1] < HEIGHT
    });
}

//field_matrix cria uma array vazia
var field_matrix = [];
//field chama a <table> dentro da div com id field. Esse seletor do jQuery funciona como querySelectorAll do javascript
var field = $("#field table");
//loop que rodará qtd de linhas até o máximo de 20
for (var i = 0; i < HEIGHT; i++) {
    //variavel que cria uma lista vazia, uma array normal que salvará a lista de números
    var row_vector = [];
    //variavel que cria a linha da tabela, um nodulo do DOM. Esse seletor do jQuery funciona como createElement do javascript
    var row = $("<tr>");
    //loop que rodará a qtd de células até o maximo de 15
    for (var j = 0; j < WIDTH; j++) {
        //variavel que cria a celula da tabela, um nodulo do DOM. Esse seletor do jQuery funciona como createElement do javascript
        var cell = $("<td>");
        //.data é utilizado para colocar um valor dentro do objeto da célula
        cell.data("mines", 0);

        //tr recebe td (poe dentro do HTML)
        row.append(cell);
        //objeto de javascripr dentro do vetor (para mexer no JS)
        row_vector.push(cell)

    }
    //table rebece tr
    field.append(row);
    //array com celulas dentro da matrix com todas as linhas
    field_matrix.push(row_vector);
}

//recebe array de array com indexeszx randomicos
var mine_indexes = getUniqueRandomIndexesInField();
//lupar indexes $.each (loop especifico para arrays, recebe) Esse método do jQuery funciona como "for of" do javascript
$.each(mine_indexes, function (index, coordinates) {
    var x = coordinates[0];
    var y = coordinates[1];
    var mine = $(field_matrix[y][x]);
    mine.addClass("mine");
});

$.each(mine_indexes, function (index, coordinates) {
    var adjacent_cells = getAdjacentCellIndexes(coordinates[0], coordinates[1]);
    $.each(adjacent_cells, function (index, coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var cell = $(field_matrix[y][x]);
        if (!cell.hasClass("mine")) {
            var num_mines = cell.data("mines") + 1;
            cell.data("mines", num_mines);
            cell.text(num_mines);
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
