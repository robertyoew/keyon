console.log('indexjs loading...');

$(function () {
    console.log("ready!");
});

var lays = {};
var selectedFile; // TODO: necessary

init();

function init() {
    loadFileName();
    // loadFiles();// TODO:
    selectListener();
}

function loadFileName() {
    if (fileNames && fileNames.length > 0) {
        console.log('fileNames', fileNames);
        for (var file of fileNames) {
            console.log('fileName', file)
            $('#select1').append($('<option>', {
                value: file,
                text: file
            }));
            // console.log('fileName', file, 'inserted')
        }
        readFile();
    } else {
        // TODO: error alert
    }
}

function readFile(selectedFile) {
    clearSelect();
    var json = selectedFile || 'EDI.json';
    $.getJSON('src/js/'+json, function (data) {
        console.log('loadFiles', data)
        lays = data;
        for (var lay in data) {
            console.log('lay', lay);
            var layArr = data[lay];
            console.log('layArr', layArr);
            var firstLay = layArr[0] || {};
            console.log('firstLay', firstLay);
            var schema = firstLay.SCHEMA || '';
            var TABLE = firstLay.TABLE || '';
            if (schema && TABLE) {
                var opt = schema + '.' + TABLE;
                $('#select2').append($('<option>', {
                    value: lay,
                    text: opt
                }));
            }
            //
            var secondLay = layArr[1] || {};
            var schema2 = secondLay.SCHEMA || '';
            var TABLE2 = secondLay.TABLE || '';
            if (schema2 && TABLE2) {
                var opt2 = schema2 + '.' + TABLE2;
                $('#select3').append($('<option>', {
                    value: lay,
                    text: opt2
                }));
            }
            //
            var third = layArr[2] || {};
            var schema3 = third.SCHEMA || '';
            var TABLE3 = third.TABLE || '';
            var opt3 = schema3 + '.' + TABLE3;
            if (schema3 && TABLE3) {
                $('#select4').append($('<option>', {
                    value: lay,
                    text: opt3
                }));
            }
            // console.log('lay', lay, 'inserted');
        }
    });
}

function selectListener() {
    $('#select1').on('change', function (el) {
        // console.log('el', el)
        var selectedFile = $('#select1').val();
        console.log('selectedFile', selectedFile)
        readFile(selectedFile);
    });

    $('#select2').on('change', function (el) {
        // console.log('el', el)
        console.log('select2', this.value);
        var selectedIndex = $('#select2').val();
        $('#select3').val(selectedIndex);
        $('#select4').val(selectedIndex);
        generateResult(selectedIndex);
    });
    $('#select3').on('change', function (el) {
        // console.log('el', el)
        console.log('select3', this.value);
        var selectedIndex = $('#select3').val();
        $('#select2').val(selectedIndex);
        $('#select4').val(selectedIndex);
        generateResult(selectedIndex);

    });
    $('#select4').on('change', function (el) {
        // console.log('el', el)
        console.log('select4', this.value);
        var selectedIndex = $('#select4').val();
        $('#select2').val(selectedIndex);
        $('#select3').val(selectedIndex);
        generateResult(selectedIndex);

    });
}

function generateResult(index) {
    console.log('generateResult lays', lays);
    var selectedData = lays[index];
    console.log('generateResult selectedData', selectedData);
    if (selectedData && selectedData.length > 0) {
        var str = '';
        for (var lay of selectedData) {
            if (!isEmptyObject(lay)) {
                var SCHEMA = lay.SCHEMA || '';
                var TABLE = lay.TABLE || '';
                console.log('SCHEMA', SCHEMA)
                console.log('TABLE', TABLE)
                str += SCHEMA + '.' + TABLE + ' , ';
            }
        }
    }
    $('#result').text(str);
}

function isEmptyObject(obj) {
    return obj // 👈 null and undefined check
        && Object.keys(obj).length === 0
        && Object.getPrototypeOf(obj) === Object.prototype;
}

function clearSelect() {
    $('#select2').empty().append($('<option>', {
        disabled: true,
        selected: true,
        text: 'plz select'
    }));
    $('#select3').empty().append($('<option>', {
        disabled: true,
        selected: true,
        text: 'plz select'
    }));
    $('#select4').empty().append($('<option>', {
        disabled: true,
        selected: true,
        text: 'plz select'
    }));
    $('#result').text('');
}
