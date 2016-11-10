function buildHtmlTable(data, name, settings) {
    var columns = getColumns(data);
    var columnHtml = getHtmlColumnHeaders(columns);
    var tableStr = '';
    var rowStr = '';

    if (name != null) {
        tableStr = '<table id="' + name + '" class="table table-condensed table-hover"><tbody>';
    }
    else tableStr = '<table class="table table-condensed table-hover"><tbody>';

    for (var i = 0; i < data.length; i++) {

        var colStr = '';
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = data[i][columns[colIndex]];

            if (cellValue == null) {
                cellValue = "";
            }

            var intVal = function (i) {
                return typeof i === 'string' ?
                  i.replace(/[\$,]/g, '')  :
                  typeof i === 'number' ?
                    i : 0;
            };

            var num = 0.0;

            try {
                //num = parseFloat(cellValue.replace(/[\$,]/g, ''));
                num = intVal(cellValue);
                num = Math.round(num * 100) / 100;
                //console.log(num);
            } catch (e) {
                num = 0;
            }

            //if (!isNaN(num)) {
            //    colStr = colStr + '<td align="right">' + currencyFormat(num) + '</td>';
            //}
            //else colStr = colStr + '<td>' + cellValue + '</td>';

            var defaultColAlign = "left";
            var numVal;

            if (!isNaN(num)) {

                numVal = currencyFormat(num, 2);

                if (settings != undefined) {

                    //check column defs
                    for (var colDefs = 0; colDefs < settings.columnDefs.length; colDefs++) {

                        //target matching
                        if (settings.columnDefs[colDefs].targets == colIndex) {
                            defaultColAlign = settings.columnDefs[colDefs].align;
                            if (settings.columnDefs[colDefs].decimals > 0)
                                numVal = currencyFormat(num, settings.columnDefs[colDefs].decimals);
                            else numVal = numberWithCommas(num);
                            break;
                        }
                        else defaultColAlign = "right";
                    }
                }

                colStr = colStr + '<td align=' + defaultColAlign + '>' + numVal + '</td>';
            } else colStr = colStr + '<td>' + cellValue + '</td>';
        }

        rowStr = rowStr + '<tr>' + colStr + '</tr>';
    }

    tableStr = tableStr + columnHtml + rowStr + '</tbody><tfoot></tfoot></table>';

    return '<div class="table-responsive">' + tableStr + '</div>';
}

function getColumns(data) {
    var columnSet = [];

    for (var i = 0; i < data.length; i++) {
        var rowHash = data[i];
        for (var key in rowHash) {
            columnSet.push(key);
        }
        break;
    }

    return columnSet;
}

function getHtmlColumnHeaders(columns) {
    var columnsHtml = '';

    for (var i = 0; i < columns.length; i++) {
        columnsHtml = columnsHtml + '<th>' + columns[i] + '</th>';
    }

    var htmlStr = '<thead><tr>' + columnsHtml + '</tr></thead>';

    return htmlStr;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function currencyFormat(num, decimals) {
    return num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
